"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function UploadFilesToUploadThing(file: File) {
    if (!file || file.size === 0) {
        throw new Error("No file provided");
    }

    const result = await utapi.uploadFiles(file);

    if (result.error) {
        throw new Error(result.error.message);
    }

    return result.data;
}