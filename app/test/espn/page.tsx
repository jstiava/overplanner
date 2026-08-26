'use server'

import { Button } from '@/components/ui/button';
import OverplannerDate from '@/lib/DateTime/OverplannerDate';
import Drizzle from '@/lib/drizzle';
import { GameLabel, getLeagueCode, parseGame } from './lib';
import { generateUUID, getNewCertificateTemplate, getNewEventTemplate } from '@/lib/events';
import { cn } from '@/lib/utils';
import { Certificates, Events, OverplannerEventType } from '@/schema';
// @ts-ignore
import { Scoreboard, Enums } from 'espn-api';

export default async function EspnApiWrapperTestPage() {

    const today = new OverplannerDate('now', 'America/Chicago');

    const drizzle = await Drizzle.getInstance();
    // const scoreboard = await getEspnScoreboard('MLB', today.zoned_time);
    const scoreboard = null;

    const schedule = await getSeasonScheduleForTeam('MLB', 'chc', 2026);


    return (
        <p className='debug'>{JSON.stringify(schedule, null, 2)}</p>
    )
    

    // const newCerts = []
    // const newEvents : OverplannerEventType[] = [];
    // for (const game of schedule.events) {

    //     const eventId = generateUUID();
    //     const homeAwayDetails = parseGame(game.name);
    //     const oppAbbr = homeAwayDetails.home.abbr == 'CHC' ? homeAwayDetails.away : homeAwayDetails.home;
    //     const gameStart = new OverplannerDate(new Date(game.date), 'America/Chicago')

    //     const cubs = game.competitions[0].competitors.find(x => x.team.abbreviation === 'CHC')

    //     const opp = game.competitions[0].competitors.find(x => x.team.abbreviation != 'CHC')

    //     const isGameFinal = game.competitions[0].status.type.name == 'STATUS_FINAL';

    //     if (!cubs || !opp) {
    //         continue
    //     }

    //     newEvents.push({
    //         ...getNewEventTemplate(),
    //         id: eventId,
    //         name: JSON.stringify([
    //             { type: 'icon', src: `/icons/mlb/CHC` },
    //             { type: 'string', content: 'Chicago Cubs' },
    //             { type: 'string', content: oppAbbr.isHome ? ' at ' : ' vs. '},
    //             { type: 'icon', src: `/icons/mlb/${oppAbbr.abbr}.png` },
    //             { type: 'string', content: oppAbbr.name } 
    //         ]),
    //         icon_img_uri: `/icons/mlb/${oppAbbr.abbr}.png`,
    //         abbr: oppAbbr.abbr,
    //         start: gameStart.utc,
    //         start_timezone: 'America/Chicago',
    //         end: gameStart.add(150, 'minutes').utc,
    //         end_timezone: 'America/Chicago',
    //         type: 'single_time',
    //         summary: isGameFinal ? `${cubs.winner ? 'W' : 'L'} ${cubs?.score.value}-${opp.score.value}` : null,
    //         location_details: {
    //             name: game.competitions[0].venue.fullName,
    //             line1: '',
    //             city: game.competitions[0].venue.address.city,
    //             state: game.competitions[0].venue.address.state,
    //             country: 'United States',
    //             zip: game.competitions[0].venue.address.zipCode,
    //         },
    //         // metadata: game
            
    //     })

    //     newCerts.push({
    //         ...getNewCertificateTemplate(),
    //         event_id: 'e-2026-chicago-cubs',
    //         child_event_id: eventId
    //     })
    // }

    // // await drizzle.db.insert(Events).values(newEvents);
    // // await drizzle.db.insert(Certificates).values(newCerts);


    // return (
    //     <p className='debug'>{JSON.stringify(newEvents, null, 2)}</p>
    // )


    // return (
    //     <>
    //         <div className="flex flex-wrap divide-y divide-x">
    //             {(scoreboard ?? schedule).events.map(x => {

    //                 const venue = x.competitions[0].venue.fullName;
    //                 const isHome = venue === 'Wrigley Field'
    //                 const startDate = new OverplannerDate(new Date(x.date), 'America/Chicago');
    //                 if (!x.competitions[0].tickets) {
    //                     return null;
    //                 }

    //                 // if (venue != "Wrigley Field") {
    //                 //     return null;
    //                 // }

    //                 return (
    //                     <div key={x.uid} className={cn(
    //                         "flex flex-col w-[calc(100%/7)] gap-4 p-4 h-56 overflow-y-scroll",
    //                         isHome ? 'bg-white text-black' : 'bg-black text-white'
    //                     )}>
    //                         <div className="flex flex-col">
    //                             <span className='font-bold'>{startDate.print("h:mm a")}</span>
    //                             <p>{startDate.print("EEEE, MMM dd, yyyy")}</p>
    //                             <GameLabel input={x.name} /> 
    //                             <Button variant="link" className='text-inherit w-fit px-0'>{venue}</Button>
    //                             <p>{x.competitions[0].tickets[0].summary}</p>
    //                         </div>
    //                         {/* <p className='debug'>{JSON.stringify(x, null, 2)}</p> */}
    //                         {/* <div className="flex flex-col gap-0 border border-white border-1 p-4">
    //                             {x.competitions.map(y => {



    //                                 try {
    //                                     const tickets = y.tickets[0];
    //                                     return (
    //                                         <div className="flex flex-col" key={y.uid} >
    //                                             <p className='font-black tracking-tight text-xl'>{tickets.numberAvailable} {tickets.summary}</p>
    //                                             <p className='debug'>{JSON.stringify(x.weather, null, 2)}</p>
    //                                         </div>
    //                                     )
    //                                 }
    //                                 catch (err) {
    //                                     return (
    //                                         <div className="flex flex-col">
    //                                             <p>{JSON.stringify(Object.keys(y))}</p>
    //                                             <p className='debug'>{JSON.stringify(y.ticketsAvailable, null, 2)}</p>
    //                                         </div>
    //                                     )
    //                                 }
    //                             })}
    //                         </div> */}

    //                         {/* <p className='debug'>{JSON.stringify(x.weather, null, 2)}</p> */}
    //                     </div>
    //                 )
    //             })}
    //         </div>
    //     </>
    // )
}

export async function getSeasonScheduleForTeam(league: string, team: string, season: number): Promise<{
    events: ESPNEvent[]
}> {


    const leagueCode = getLeagueCode(league);

    const BASE = "https://site.api.espn.com/apis/site/v2/sports/";
    const res = await fetch(
        `${BASE}/${leagueCode}/teams/${team}/schedule?season=${season}&seasontype=2`
    );

    if (!res.ok)
        throw new Error(`ESPN returned ${res.status}`);

    return res.json();


}

export async function getEspnScoreboard(league: string, date: Date): Promise<{
    events: ESPNEvent[]
}> {

    const leagueCode = getLeagueCode(league);

    const BASE = "https://site.api.espn.com/apis/site/v2/sports";
    const res = await fetch(
        `${BASE}/${leagueCode}/scoreboard?dates=${date.toISOString().slice(0, 10).replace(/-/g, "")}`
    );

    if (!res.ok)
        throw new Error(`ESPN returned ${res.status}`);

    return res.json();
}








export interface ESPNStatus {
    clock: number;
    displayClock: string;
    period: number;

    type: {
        id: string;
        name: string;
        state: string;
        completed: boolean;
        description: string;
        detail: string;
        shortDetail: string;
    };
}

export interface ESPNLink {
    href: string;
    text: string;
    rel: string[];
    isExternal: boolean;
    isPremium: boolean;
}

export interface ESPNWeather {
    displayValue: string;
    temperature: number;
    highTemperature?: number;
    conditionId?: string;
    link?: ESPNLink;
}