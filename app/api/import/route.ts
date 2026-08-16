import Drizzle from '@/lib/drizzle';
import { getNewEventTemplate } from '@/lib/events';
import { Certificates, Events } from '@/schema';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { NextRequest, NextResponse } from 'next/server';
import Papa from "papaparse";

dayjs.extend(utc);
dayjs.extend(timezone);

export function generate255Id() {
  const bytes = crypto.getRandomValues(new Uint8Array(192)); 
  return Buffer.from(bytes).toString("base64url").slice(0, 255);
}

function applyTime(date: dayjs.Dayjs, timeStr: string) {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    const isPM = modifier?.toLowerCase() === "pm";
    const isAM = modifier?.toLowerCase() === "am";

    if (isPM && hours < 12) {
        hours += 12;
    }

    if (isAM && hours === 12) {
        hours = 0;
    }

    return date
        .hour(hours)
        .minute(minutes)
        .second(0)
        .millisecond(0);
}

export async function GET(req: NextRequest) {

    const res = await fetch("http://localhost:3000/cubs_schedule.csv");
    const csv = await res.text();
    const drizzle = await Drizzle.getInstance();

    const newEvents = []
    const newCertificates = []

    const parsed = Papa.parse<any>(csv, {
        header: true,
        skipEmptyLines: true,
    });

    const initialCalendarRow = getNewEventTemplate();
    const chicagoCubsSeasonCalendar = {
        ...initialCalendarRow,
        id: '2026_chicago_cubs_regular_season_schedule',
        name: "2026 Chicago Cubs Regular Season Schedule",
        type: 'all_day',
        start: new Date("March 17, 2026"),
        start_timezone: 'America/Chicago',
        end: new Date("October 1, 2026"),
        end_timezone: 'America/Chicago',
        created_at: new Date(),
        last_updated_at: new Date(),
        version: 0,
        checksum: null
    }

    for (const [key, game] of Object.entries(parsed.data)) {


        const date = dayjs.tz(
            `${game["Date"]} 2026`,
            "America/Chicago"
        );

        const dateWithTime = applyTime(date, game['RA'])

        const initialEventRow = getNewEventTemplate();

        const eventRow = {
            ...initialEventRow,
            start: dateWithTime.toDate(),
            start_timezone: 'America/Chicago',
            end: dateWithTime.add(2, 'hour').toDate(),
            end_timezone: 'America/Chicago',
            created_at: new Date(),
            last_updated_at: new Date(),
            version: 0,
            checksum: null,
            type: "single_time"
        }

        if (game['_1'] == '@') {
            eventRow.name = `Chicago Cubs at ${game['Opp']}`
        }
        else {
            eventRow.name = `Chicago Cubs vs. ${game['Opp']}`
            eventRow.location_address_line_1 = '1060 W Addison St'
            eventRow.location_city = 'Chicago'
            eventRow.location_state = 'IL'
            eventRow.location_country = 'USA'
            eventRow.location_zip_code = '60613'
        }


        eventRow.id = `${dayjs(eventRow.start).format("YYYYMMDDhhmm")}-2026ChicagoCubs-${game['Opp']}`

        newEvents.push(eventRow)

        newCertificates.push({
            id: generate255Id(),
            event_id: '2026_chicago_cubs_regular_season_schedule',
            child_event_id: eventRow.id,
            notes: 'first try'
        })

    }

    const report = await drizzle.db.insert(Events).values(newEvents)

    const newCertsReport = await drizzle.db.insert(Certificates).values(newCertificates)

    return NextResponse.json({
        success: true,
        message: "Request successful",
        data: newEvents,
        report,
        newCertsReport
    });



}