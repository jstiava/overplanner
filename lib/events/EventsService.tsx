import Drizzle from '@/lib/drizzle';
import { Certificates, Events, OverplannerCertificateType, OverplannerEventType, OverplannerEventViewType, OverplannerSessionType, OverplannerUserType, POSTGRES_ERROR_CODES, Users } from '@/schema';
import { and, eq, gte, lt, inArray, lte, getTableColumns, isNotNull, or, gt, sql, isNull } from 'drizzle-orm';
import { getNewCertificateTemplate } from './Templates';

const { passkey, ...UsersTableWithoutPasskey } = getTableColumns(Users);

export class EventsService {


    static async getEvent(id: string) {
        const drizzle = await Drizzle.getInstance();
        const data = await drizzle.db
            .select()
            .from(Events)
            .where(eq(Events.id, id))
            .limit(1)
        return data[0] ?? null;
    }

    static async deleteEvents({ eventIds }: {
        eventIds: string[]
    }) {
        const drizzle = await Drizzle.getInstance();
        const data = await drizzle.db.delete(Events).where(
            inArray(Events.id, eventIds)
        )
        return data;
    }

    /**
     * Returns a single event with the attached certificate of the user with access. 
     * If no certificate matches the event, return the public version.
     * @param event_id 
     * @param user_id 
     * @returns 
     */
    static async getEventWithUserCertificate(event_id: string, user_id: string) {

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
            const doesTraceExists = await EventsService.isEventConnectedToUserInAnyWay({
                user_id, event_id
            })
            console.log({ doesTraceExists })
            if (doesTraceExists) {
                return await EventsService.getEvent(event_id)
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

            return publicAccess ?? null;
        }

        return data ?? null;

    }

    static async getAllEventsOnDayAndAfter({
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

    static async getEvents({
        startDate,
        types = []
    }: {
        startDate: Date,
        types: string[]
    }) {

        const drizzle = await Drizzle.getInstance();

        const endDateSet24HoursAfterStart = new Date(startDate);
        endDateSet24HoursAfterStart.setDate(endDateSet24HoursAfterStart.getDate() + 1);

        if (types.length == 0) {
            return [];
        }

        const data = await drizzle.db
            .select()
            .from(Events)
            .where(
                and(
                    gte(Events.start, startDate),
                    lt(Events.end, endDateSet24HoursAfterStart),
                    inArray(Events.type, types as any)
                )
            );

        return data
    }


    static async getCalendarsForUser({
        user_id
    }: {
        user_id: string
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
                eq(Certificates.user_id, user_id)
            )
            .orderBy(Events.start);

        return data
    }

    static async getCalendarEvents({
        calendar
    }: {
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
                or(
                    eq(Certificates.event_id, calendar),
                    eq(Certificates.user_id, calendar),
                )
            )
            .orderBy(Events.start);

        return data
    }

    static async addNewEventWithSharing({
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


    static async isEventConnectedToUserInAnyWay({ user_id, event_id }: {
        user_id: string,
        event_id: string
    }) {
        const trace = await EventsService.getRecursiveLookupAccessPointsForEvent({ user_id, event_id });

        // console.log(trace)
        const isUserFound = trace.some(x => x.user_id == user_id);

        return isUserFound
    }


    static async getRecursiveLookupAccessPointsForEvent({ user_id, event_id }: {
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
        start: x.start ? new Date(x.start) : null,
        end: x.end ? new Date(x.end) : null,
    })) as any

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




