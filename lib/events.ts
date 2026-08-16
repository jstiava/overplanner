import Drizzle from '@/lib/drizzle';
import { Certificates, Events, OverplannerCertificateType, OverplannerEventType, OverplannerEventViewType, OverplannerSessionType, OverplannerUserType, POSTGRES_ERROR_CODES, Users } from '@/schema';
import { and, eq, gte, lt, inArray, lte, getTableColumns, isNotNull, or, gt, sql, isNull } from 'drizzle-orm';




export async function getEvent(id: string) {

    const drizzle = await Drizzle.getInstance();

    const data = await drizzle.db
        .select()
        .from(Events)
        .where(eq(Events.id, id))
        .limit(1);

    return data[0] ?? null;

}


const { passkey, ...UsersTableWithoutPasskey } = getTableColumns(Users);

export async function getAllCertificatesForEvent(event_id: string) {

    const drizzle = await Drizzle.getInstance();

    const usersWithCertificate = await drizzle.db
        .select({
            ...UsersTableWithoutPasskey,
            certificate: getTableColumns(Certificates)
        })
        .from(Certificates)
        .leftJoin(Users, eq(Users.id, Certificates.user_id))
        .where(
            and(
                eq(Certificates.child_event_id, event_id),
                isNotNull(Certificates.user_id)
            )
        )

    return usersWithCertificate;

}


/**
 * Returns a single event with the attached certificate of the user with access. 
 * If no certificate matches the event, return the public version.
 * @param event_id 
 * @param user_id 
 * @returns 
 */
export async function getEventWithUserCertificate(event_id: string, user_id: string) : Promise<OverplannerEventViewType & {
    certificate: OverplannerCertificateType | null
} | null> {

    const drizzle = await Drizzle.getInstance();

    let [data] = await drizzle.db
        .select({
            ...getTableColumns(Events),
            certificate: getTableColumns(Certificates)
        })
        .from(Certificates)
        .innerJoin(Events, eq(Events.id, Certificates.child_event_id))
        .where(
            and(
                eq(Certificates.child_event_id, event_id),
                eq(Certificates.user_id, user_id),
                isNotNull(Events.id),
            )
        )
        .limit(1)


    // The user has access, but its not first level.
    if (!data) {
        const doesTraceExists = await isEventConnectedToUserInAnyWay({
            user_id, event_id
        })
        console.log({ doesTraceExists })
        if (doesTraceExists) {

            const eventData = await getEvent(event_id)
            return {
                ...eventData,
                certificate: null
            } as any
        }
    }

    // Get public access version
    if (!data) {
        const [publicAccess] = await drizzle.db
            .select({
                ...getTableColumns(Events),
                certificate: getTableColumns(Certificates)
            })
            .from(Certificates)
            .innerJoin(Events, eq(Events.id, Certificates.child_event_id))
            .where(
                and(
                    eq(Certificates.child_event_id, event_id),
                    eq(Certificates.user_id, 'public'),
                )
            )
            .limit(1)

        return (publicAccess as any) ?? null;
    }

    return (data as any) ?? null;

}



export async function getAllEventsOnDayAndAfter({
    date
}: {
    date: Date
}) {

    const drizzle = await Drizzle.getInstance();

    const data = await drizzle.db
        .select()
        .from(Events)
        .where(
            gte(Events.start, date)
        );

    return data
}

export async function getAllEvents() {

    const drizzle = await Drizzle.getInstance();

    const data = await drizzle.db
        .select()
        .from(Events)

    return data
}


export async function getCertificatesForEventInIdArray({ eventIds, target }: {
    eventIds: string[],
    target: string
}) {
    const drizzle = await Drizzle.getInstance();

    const data = await drizzle.db.select({
        ...getTableColumns(Certificates)
    })
        .from(Certificates)
        .where(
            and(
                inArray(Certificates.child_event_id, eventIds),
                eq(Certificates.event_id, target)
            )
        )

    return data;
}

export async function deleteCertificates({ ids }: {
    ids: string[]
}) {
    const drizzle = await Drizzle.getInstance();

    const operation = await drizzle.db.delete(Certificates)
        .where(
            and(
                inArray(Certificates.id, ids)
            )
        )

    return operation;
}

export async function createBatchCertificates({ childEventIds, parentEventId }: {
    childEventIds: string[],
    parentEventId: string
}) {
    const drizzle = await Drizzle.getInstance();

    const newCerts: OverplannerCertificateType[] = [];
    for (const childId of childEventIds) {
        newCerts.push({
            ...getNewCertificateTemplate(),
            event_id: parentEventId,
            child_event_id: childId,
            notes: "Created by move operation from another folder."
        })
    }

    const operation = await drizzle.db.insert(Certificates).values(newCerts);

    return operation;


}


export async function getCalendars({
    calendar
}: {
    calendar: string
}): Promise<OverplannerEventViewType[]> {

    const drizzle = await Drizzle.getInstance();

    const twoLevelEventLookup = sql`
    WITH RECURSIVE graph AS (
        SELECT
            m.id,
            m.event_id,
            m.child_event_id,
            m.event_id AS connected_from,
            1 AS level
        FROM certificates m
        WHERE m.event_id = ${calendar}

        UNION ALL

        SELECT
            m.id,
            m.event_id,
            m.child_event_id,
            g.child_event_id,
            g.level + 1
        FROM certificates m
        JOIN graph g
            ON m.event_id = g.child_event_id
    )

    SELECT
        e.*,
        g.level,
        row_to_json(c) AS certificate
    FROM graph g
    JOIN events e ON e.id = g.child_event_id
    JOIN certificates c ON c.event_id = g.event_id AND c.child_event_id = g.child_event_id;
    `

    const result = await drizzle.db.execute(twoLevelEventLookup as any);

    return result.rows.map(x => ({
        ...x,
        start: x.start ? new Date(String(x.start)) : null,
        end: x.end ? new Date(String(x.end)) : null,
    })) as any

}


export async function getCalendarEvents({
    calendar
}: {
    calendar: string
}) : Promise<OverplannerEventViewType[]> {

    const drizzle = await Drizzle.getInstance();

    const data = await drizzle.db
        .select({
            ...getTableColumns(Events),
            certificate: getTableColumns(Certificates)
        })
        .from(Certificates)
        .leftJoin(Events, eq(Events.id, Certificates.child_event_id))
        .where(
            or(
                eq(Certificates.event_id, calendar),
                eq(Certificates.user_id, calendar),
            )
        )
        .orderBy(Events.start);

    return data as any
}


export async function getCalendarEventsOnAndAfterDate({
    date,
    calendar
}: {
    date: Date,
    calendar: string
}) {

    const drizzle = await Drizzle.getInstance();

    const data = await drizzle.db
        .select({
            ...getTableColumns(Events),
            certificate: getTableColumns(Certificates)
        })
        .from(Certificates)
        .leftJoin(Events, eq(Events.id, Certificates.child_event_id))
        .where(
            and(
                or(
                    eq(Certificates.event_id, calendar),
                    eq(Certificates.user_id, calendar),
                ),
                or(
                    gte(Events.start, date), // start is greater than or equal to,
                    gt(Events.end, date),
                    and(isNull(Events.start), eq(Events.type, 'calendar')),
                    and(isNull(Events.start), eq(Events.type, 'all_day'))
                )
            )
        )
        .orderBy(Events.start);

    return data
}


export async function getCalendarEventsForDay({
    date
}: {
    date: Date
}) {

    const drizzle = await Drizzle.getInstance();

    const endDateSet24HoursAfterStart = new Date(date);
    endDateSet24HoursAfterStart.setDate(endDateSet24HoursAfterStart.getDate() + 1);

    const data = await drizzle.db
        .select()
        .from(Events)
        .where(
            and(
                gte(Events.start, date),
                lt(Events.end, endDateSet24HoursAfterStart),
                eq(Events.type, 'single_time')
            )
        );

    const allDayEventsOverlapping = await drizzle.db.select().from(Events)
        .where(
            and(
                gte(Events.end, date),
                lte(Events.start, date),
                eq(Events.type, 'all_day')
            )
        )

    return [...data, ...allDayEventsOverlapping]
}

export async function getEvents({
    startDate,
    types = []
}: {
    startDate: Date,
    types: string[]
}) {

    const drizzle = await Drizzle.getInstance();

    const endDateSet24HoursAfterStart = new Date(startDate);
    endDateSet24HoursAfterStart.setDate(endDateSet24HoursAfterStart.getDate() + 1);

    const data = await drizzle.db
        .select()
        .from(Events)
        .where(
            and(
                gte(Events.start, startDate),
                lt(Events.end,endDateSet24HoursAfterStart),
                // @ts-ignore
                inArray(Events.type, types)
            )
        );

    return data
}


export async function addNewEventWithSharing({
    newEventRow,
    sharedWithUsers
}: {
    newEventRow: OverplannerEventType,
    sharedWithUsers: string
}) {

    const drizzle = await Drizzle.getInstance();


    const insertedEvent = await drizzle.db.insert(Events)
        .values(newEventRow)
        .returning()


    return insertedEvent;
}


export function getNewEventTemplate(): OverplannerEventType {

    const keys = Object.keys({} as OverplannerEventType) as (keyof OverplannerEventType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = 'placeholder'

    return initial

}


export function getNewUserTemplate(): OverplannerUserType {

    const keys = Object.keys({} as OverplannerUserType) as (keyof OverplannerUserType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = 'placeholder'

    return initial

}

export function getNewCertificateTemplate(): OverplannerCertificateType {

    const keys = Object.keys({} as OverplannerCertificateType) as (keyof OverplannerCertificateType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = generateUUID()

    return initial

}

export function getNewSessionTemplateWithId(): OverplannerSessionType {

    const keys = Object.keys({} as OverplannerSessionType) as (keyof OverplannerSessionType)[];
    const initial: any = Object.fromEntries(
        keys.map(key => [key, null])
    );

    // Elements that cannot be null
    initial.id = generateUUID()

    return initial

}

export function generateUUID(): string {
    return crypto.randomUUID()
}



export async function isEventConnectedToUserInAnyWay({ user_id, event_id }: {
    user_id: string,
    event_id: string
}) {
    const trace = await getRecursiveLookupAccessPointsForEvent({ user_id, event_id });

    // console.log(trace)
    const isUserFound = trace.some(x => x.user_id == user_id);

    return isUserFound
}


export async function getRecursiveLookupAccessPointsForEvent({ user_id, event_id }: {
    user_id: string,
    event_id: string
}) {

    const drizzle = await Drizzle.getInstance();

    const getAccessTradeFromEventToUser = sql`

        WITH RECURSIVE access_hierarchy AS (
            SELECT
                c.*,
                1 AS level,
                (c.user_id = ${user_id}) AS found
            FROM certificates c
            WHERE c.user_id = ${user_id}

            UNION ALL

            SELECT
                c.*,
                ah.level + 1,
                (c.user_id = ${event_id}) AS found
            FROM certificates c
            JOIN access_hierarchy ah
            ON c.child_event_id = ah.event_id
            WHERE
                ah.level < 3
                AND NOT ah.found   
        )

        SELECT *
        FROM access_hierarchy
        ORDER BY level;

    `

    const result = await drizzle.db.execute(getAccessTradeFromEventToUser as any);

    return result.rows


}