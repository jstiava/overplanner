'use server'

import { EventsService } from "@/lib/events/EventsService";


export async function getCalendarAgendaServerAction(props: {
    event_id?: string,
    user_id?: string
}) {

    if (props.event_id) {
        return await EventsService.getCalendarEvents({
            calendar: props.event_id
        })
    }

    if (props.user_id) {

        return await EventsService.getCalendarsForUser({
            user_id: props.user_id,
        });
    }

    return [];
}