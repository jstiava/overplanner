import Drizzle from '@/lib/drizzle';
import { generateUUID, getNewSessionTemplateWithId, getNewUserTemplate } from '@/lib/events';
import { OverplannerSessionType, OverplannerUserPublicType, Sessions, Users } from '@/schema';
import { eq, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { UAParser } from "ua-parser-js";
import getSessionUser from '@/lib/getUser';


export type UserProfilePatch = OverplannerUserPublicType & {
    preferred_timezones: string[]
}


export async function PATCH(req: NextRequest) {

    try {

        const body = await req.json() as UserProfilePatch
        const drizzle = await Drizzle.getInstance();


        const sessionId = (await cookies()).get("session")?.value;
        const theUser = await getSessionUser(sessionId)

        if (!theUser) {
            return NextResponse.json(
                { success: false, message: 'Not signed in.' },
                { status: 400 }
            );
        }

        const { preferred_timezones, name, description, ...rest } = body;

        const updated = await drizzle.db.update(Users).set({
            home_timezone: preferred_timezones && preferred_timezones.length > 0 ? preferred_timezones[0] : null,
            name,
            description,
            preferred_timezones
        })


        return NextResponse.json({
            success: true,
            message: "Request successful",
            data: {
                updated,
                index: 0,
                type: "member",
                role: null,
                notes: "Still in development"
            }
        });
    }

    catch (err) {
        console.error(err)
        return NextResponse.json(
            { success: false, message: 'An unknown error.' },
            { status: 400 }
        );

    }

}