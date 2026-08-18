'use client'

import SmallEventBlock from "@/components/SmallEventBlock";
import { Button } from "@/components/ui/button";
import { OverplannerEventViewType } from "@/schema"
import { differenceInMinutes } from "date-fns";
import { MouseEventHandler } from "react";


const timeOfDayVerticalPosition = (dayjsObject: Date) => {
    // TODO fix
    return 50;
}


const getEventDurationBlockHeight = (start: Date, end: Date) => {
    return timeOfDayVerticalPosition(end) - timeOfDayVerticalPosition(start)
}


export default function RenderEventsInDayViewVerticalTimeList({
    events,
    onEventClick
}: {
    events: OverplannerEventViewType[],
    onEventClick: (e: MouseEventHandler<HTMLButtonElement> | any, action: 'preview' | 'edit' | 'delete' | 'create', target: string) => any
}) {

    const handleEventClick = (
            e: MouseEventHandler<HTMLButtonElement> | any, action: 'preview' | 'edit' | 'delete' | 'create', target: any | null) => {
            onEventClick(e, action, target)
        }



    return (
        <>
            {events.map((event) => {

                 if (!event.start || !event.end) {
                    return null;
                 }

                const timeHeightForEvent = Math.max(differenceInMinutes(event.start, event.end), 0.5);
                const verticalAbsolutePosition = timeOfDayVerticalPosition(event.start)

                if (timeHeightForEvent == 0.5) {
                    return (
                        <SmallEventBlock key={event.id}>
                            <Button variant='outline'
                                className="z-5 absolute flex items-center justify-start gap-2 py-2 px-3 left-16 w-[calc(100%-8em)]"
                                style={{
                                    top: `${((64 * 21) * (verticalAbsolutePosition / 24))}px`,
                                    height: `${((64 * 21) * (timeHeightForEvent / 24))}px`
                                }}
                                onClick={(e) => {
                                    handleEventClick(e, 'preview', event)
                                }}>
                                <p className="text-xs font-semibold">{event.start.toString()}</p>
                                <p className="text-xs font-semibold uppercase">{event.name}</p>
                                {/* <p>{verticalAbsolutePosition}</p>
                                     <p>{timeOfDayVerticalPosition(dayjs(event.start))} - {timeOfDayVerticalPosition(dayjs(event.end))}</p> */}
                            </Button>
                        </SmallEventBlock>
                    )
                }

                return (
                    <SmallEventBlock key={event.id}>
                        <Button variant='outline'
                            className="z-5 absolute flex flex-col items-start justify-start gap-0 py-2 px-3 left-16 w-[calc(100%-8em)]"
                            style={{
                                top: `${((64 * 21) * (verticalAbsolutePosition / 24))}px`,
                                height: `${((64 * 21) * (timeHeightForEvent / 24))}px`
                            }}
                            onClick={(e) => {
                                handleEventClick(e, 'preview', event)
                            }}>
                            <p className="text-xs font-semibold">{event.start.toString()}</p>
                            <p className="text-xs font-semibold uppercase">{event.name}</p>
                            {/* <p>{verticalAbsolutePosition}</p>
                                     <p>{timeOfDayVerticalPosition(dayjs(event.start))} - {timeOfDayVerticalPosition(dayjs(event.end))}</p> */}
                        </Button>
                    </SmallEventBlock>
                )
            })}
        </>
    )
}