import { NextRequest, NextResponse } from 'next/server';
import { Certificates, Events, OverplannerEventType, POSTGRES_ERROR_CODES } from '@/schema';
import { and, eq, gte, lt } from 'drizzle-orm';
import Drizzle from '@/lib/drizzle';
import { generateEventId } from '@/lib/generate_id';
import { getNewCertificateTemplate, getNewEventTemplate } from '@/lib/events';
import { cookies } from 'next/headers';
import getSessionUser from '@/lib/Auth/getUser';


export type Stub = {
    id: string,
    name: string,
    type: string
}


/**
 * How the inbound data differs from how its stored.
 */
export type EventToCreateType = OverplannerEventType & {
    date: {
        from: Date,
        to: Date,
        timezone: string
    },
    share_with: Stub[],
}


export async function POST(req: NextRequest) {

    try {

        const body = await req.json() as EventToCreateType
        const drizzle = await Drizzle.getInstance();


        const sessionId = (await cookies()).get("session")?.value;
        const theUser = await getSessionUser(sessionId)

        if (!theUser) {
            return NextResponse.json(
                { success: false, message: 'Not signed in.' },
                { status: 400 }
            );
        }



        const { name, type, date, location_details, share_with, ...rest } = body 



        const initialEventRow = getNewEventTemplate();

        const eventRow = {
            ...initialEventRow,
            name,
            type,

            start: date.from ? new Date(date.from) : null,
            start_timezone: date.timezone,

            end: date.to ? new Date(date.to) : null,
            end_timezone: date.timezone,

            location_details: null,

            description: rest.description,

            created_at: new Date(),
            created_by: 'test_user_123',

            last_updated_at: new Date(),
            last_updated_with: 'api',

            version: 0,
        }

        eventRow['id'] = generateEventId(eventRow)


        const inserted = await drizzle.db.insert(Events)
            .values(eventRow)
            .returning()


        const newCerts = []
        for (const sharedWithTarget of share_with) {
            newCerts.push({
                ...getNewCertificateTemplate(),
                child_event_id: eventRow['id'],
                event_id: sharedWithTarget.id
            })
            
        }
        const inserted_cert = await drizzle.db.insert(Certificates)
            .values(newCerts)


        return NextResponse.json({
            success: true,
            message: "Request successful",
            data: {
                newEvent: inserted[0],
                inserted_cert,
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


export async function GET(req: NextRequest) {

    try {

        const drizzle = await Drizzle.getInstance();
        const { searchParams } = new URL(req.url);


        const startParam = searchParams.get('start');
        const type = searchParams.get('type')

        NextResponse.json(
            { error: 'Ok' },
            { status: 200 }
        );

        if (!startParam) {
            return NextResponse.json(
                { error: 'Missing start param (ISO 8601)' },
                { status: 400 }
            );
        }

        const startDate = new Date(startParam);

        const endDateSet24HoursAfterStart = new Date(startDate);
        endDateSet24HoursAfterStart.setDate(endDateSet24HoursAfterStart.getDate() + 1);

        if (isNaN(startDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid date format' },
                { status: 400 }
            );
        }

        const data = await drizzle.db
            .select()
            .from(Events)
            .where(
                and(
                    gte(Events.start, startDate),
                    lt(Events.start, endDateSet24HoursAfterStart),
                    type ? eq(Events.type, type) : undefined
                )
            );

        return NextResponse.json({
            success: true,
            message: "Request successful",
            data,
            params: {
                start: startDate,
                end: endDateSet24HoursAfterStart,
                type
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