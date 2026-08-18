import sharp from "sharp";
import {UploadThingError, UTApi } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from "next";
import { deriveServerSessionUser } from "@/lib/helpers";

const utapi = new UTApi({
    token: String(process.env.UPLOADTHING_TOKEN)
});


const f = createUploadthing();

const auth = async (req: any, res: any) => {

    const user = await deriveServerSessionUser();
    if (!user) return res.status(401).json({ message: 'Usage' });

    return { success: true, user }
};


const contentTypeToExtension: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff',
};

export async function appendExtensionByContentType(imageUrls: (string | null)[]): Promise<string[]> {
  const result: string[] = [];

  for (const url of imageUrls) {

    console.log(url);

    if (!url) {
        continue;
    }

    try {
      const response = await fetch(url, { method: 'HEAD' });

      if (!response.ok) {
        console.warn(`Failed to fetch headers for ${url}: ${response.status}`);
        // result.push(url); // leave unchanged on failure
        continue;
      }

      const key = url.split('/').pop();
      const contentType = response.headers.get('content-type')?.split(';')[0].trim();
      const extension = contentTypeToExtension[contentType || ''];

      if (!extension) {
        console.warn(`Unsupported or missing Content-Type for ${url}: ${contentType}`);
        // result.push(url); // leave unchanged if unknown
        continue;
      }

      // Only append if it doesn't already end with the correct extension
      result.push(`https://terandina.com/api/images/${key}${extension}`);

    } catch (err) {
      console.error(`Error processing ${url}:`, err);
    //   result.push(url); // leave unchanged on error
    }
  }

  return result;
}

export const uploadAllVersionsByBuffer = async (name: string, buffer: ArrayBuffer) => {

    const mediaValue = {
        small: null,
        medium: null,
        large: null
    }


    try {

        // const compressedBufferSmall = await sharp(Buffer.from(buffer))
        //     .resize(70)
        //     .webp()
        //     .toBuffer();

        // const compressedBufferMedium = await sharp(Buffer.from(buffer))
        //     .resize(500)
        //     .webp()
        //     .toBuffer();

        const uploaded = await uploadImage([
            // new File([compressedBufferSmall], `small-${name}.webp`, { type: "image/webp" }),
            // new File([compressedBufferMedium], `medium-${name}.webp`, { type: "image/webp" }),
            new File([Buffer.from(buffer)], `large-${name}.webp`, { type: "image/webp" }),
        ]);

        if (uploaded && uploaded.length === 3) {

            return {
                small: uploaded[0].data?.ufsUrl,
                medium: uploaded[1].data?.ufsUrl,
                large: uploaded[2].data?.ufsUrl,
            }
        }

    }
    catch (err) {
        console.log(err);
        throw Error("Failure")
    }
}



export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 3,
        },
    })
        .middleware(async ({ req, res } : any) => {
            console.log("Checking middleware")
            const userAuth = await auth(req, res);
            if (!userAuth) {
                console.error("Unauthorized user detected.")
                throw new UploadThingError("Unauthorized")
            };

            console.log({
                message: "User validated to upload images",
                user: userAuth.user.name
            })
            return { userId: userAuth.user.id };
        })
        .onUploadError((err) => {
            console.log(err)
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            // const firstFile = await fetch(file.ufsUrl);
            // const buffer = await firstFile.arrayBuffer();
            // const mediaValue = await uploadAllVersionsByBuffer(file.name, buffer);
            // await deleteFiles([file.key]);

            return { uploadedBy: metadata.userId, fileName: file.name };
        }),

} satisfies FileRouter;


export type OurFileRouter = typeof ourFileRouter;


export const getListOfUploadedThings = async () => {
    return await utapi.listFiles();
}

export const uploadImage = async (files: File[]) => {
    return await utapi.uploadFiles(files)
}

export const deleteFiles = async (keys: string[]) => {
    return await utapi.deleteFiles(keys)
}


export async function hashFile(file: File): Promise<string> {
    const hash = crypto.createHash("sha256"); // Create a SHA-256 hash
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            try {
                const buffer = Buffer.from(reader.result as ArrayBuffer);
                hash.update(buffer);
                const fileHash = hash.digest("hex");
                resolve(fileHash);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

export async function compressAndUploadAsWebp(file: File, quality = 100) {
    try {
        const buffer = await file.arrayBuffer();

        const compressedBuffer = await sharp(Buffer.from(buffer))
            .resize({ width: 1000 })
            .webp({ quality })
            .toBuffer();

        // Convert buffer back to a File object
        const compressedFile = new File([compressedBuffer as any], file.name.replace(/\.[^.]+$/, ".webp"), {
            type: "image/webp",
        });

        // Upload to UploadThing
        const res = await utapi.uploadFiles(compressedFile);
        return res;
    } catch (error) {
        console.error("Error compressing/uploading file:", error);
        throw error;
    }
}
