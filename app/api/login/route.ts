import Drizzle from '@/lib/drizzle';
import { generateUUID, getNewSessionTemplateWithId, getNewUserTemplate } from '@/lib/events';
import { OverplannerSessionType, Sessions, Users } from '@/schema';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {

    const body = await req.json()
    const drizzle = await Drizzle.getInstance();

    const { username, password, ...rest } = body

    const [theUser] = await drizzle.db.select().from(Users).where(
        or(
            eq(Users.username, username),
            eq(Users.email, username),
        )
    ).limit(1)

    if (!theUser) {

        return NextResponse.json(
            {
                error: 'An unknown error.',
                message: "Error code 100"
            },
            { status: 400 }
        );
    }


    const isValid = await bcrypt.compare(
        password,
        theUser.passkey
    );

    if (!isValid) {
        return NextResponse.json(
            {
                error: 'An unknown error.',
                message: "Error code 101"
            },
            { status: 400 }
        );
    }

    try {

        const { passkey, ...theUserWithoutPasskey } = theUser;

        const parser = new UAParser(
            req.headers.get("user-agent") ?? ""
        );

        const result = parser.getResult();

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            req.headers.get("x-real-ip") ??
            null;

        const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        const newSession: OverplannerSessionType = {
            ...getNewSessionTemplateWithId(),
            user_id: theUserWithoutPasskey.id,
            ipAddress: ip,
            product_version: result.device.type,
            expires_at: expirationDate,
            notes: JSON.stringify({
                deviceType: result.device.type,
                browser: result.browser.name,
                os: result.os.name
            })
        };

        const inserted = await drizzle.db.insert(Sessions).values(newSession).returning();

        (await cookies()).set("session", newSession.id, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            expires: expirationDate, // Expires in 7 days
        })

        return NextResponse.json({
            success: true,
            message: "Login successful, use me to verify token.",
            data: {
                user: theUserWithoutPasskey,
            }
        });

    }
    catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'An unknown error.' },
            { status: 400 }
        );
    }

}