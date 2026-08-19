import { NextRequest, NextResponse } from 'next/server';
import { Certificates, Events, OverplannerEventType, POSTGRES_ERROR_CODES } from '@/schema';
import { and, eq, gte, lt } from 'drizzle-orm';
import Drizzle from '@/lib/drizzle';
import { generateEventId } from '@/lib/generate_id';
import { generateUUID, getNewCertificateTemplate, getNewEventTemplate } from '@/lib/events';
import { cookies } from 'next/headers';
import getSessionUser from '@/lib/getUser';
import { EventsService } from '@/lib/events/EventsService';

export type Stub = {
    id: string,
    name: string,
    type: string
}


/**
 * How the inbound data differs from how its stored.
 */
export type EventToCreateType = OverplannerEventType & {
    share_with_calendars_and_people: string,
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

        const { name, type, start, end, start_time, end_time, location_details, ...rest } = body
        const initialEventRow = getNewEventTemplate();
        const eventRow = {
            ...initialEventRow,
            name,
            type,

            start: start ? new Date(start) : null,
            start_timezone: rest.start_timezone,

            end: end ? new Date(end) : null,
            end_timezone: rest.end_timezone ?? rest.start_timezone,

            location_details: null,

            description: rest.description,

            created_at: new Date(),
            created_by: 'test_user_123',

            last_updated_at: new Date(),
            last_updated_with: 'api',

            version: 0,
        }

        eventRow['id'] = generateUUID()


        const inserted = await drizzle.db.insert(Events)
            .values(eventRow)
            .returning()


        const newCerts = []

        const mentions = JSON.parse(rest.share_with_calendars_and_people).root.children
            .flatMap((paragraph: any) => paragraph.children)
            .filter((node: any) => node.type === "custom-beautifulMention")
            .map((node: any) => node.data);

        for (const mention of mentions) {

            if (mention.type == 'profile') {
                newCerts.push({
                    ...getNewCertificateTemplate(),
                    child_event_id: eventRow['id'],
                    user_id: mention.id
                })
            }
            else if (mention.type === 'event') {
                newCerts.push({
                    ...getNewCertificateTemplate(),
                    child_event_id: eventRow['id'],
                    event_id: mention.id
                })
            }
        }


        const inserted_cert = await drizzle.db.insert(Certificates)
            .values(newCerts);


        const newlyCreatedEvent = await EventsService.getEventWithUserCertificate(eventRow.id, theUser.id);


        return NextResponse.json({
            success: true,
            message: "Request successful",
            data: {
                newEvent: newlyCreatedEvent,
                index: 0,
                type: "member",
                role: null,
                notes: "Still in development"
            }
        })

    }
    catch (err) {
        console.error(err)
        return NextResponse.json(
            { success: false, message: 'An unknown error.' },
            { status: 400 }
        );

    }

};


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
                    type ? eq(Events.type, type as any) : undefined
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