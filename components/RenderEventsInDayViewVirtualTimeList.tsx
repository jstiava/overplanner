'use client'

import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import SmallEventBlock from "@/components/SmallEventBlock";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { cn } from "@/lib/utils";
import { OverplannerEventViewType } from "@/schema"
import { differenceInMinutes } from "date-fns";
import { MouseEventHandler, useContext } from "react";
import { toast } from "sonner";


const getVerticalAbsoluteStartPosition = (date: OverplannerDate) => {
    // TODO fix
    return 50;
}

export const getTimeOfVerticalStartPosition = (date: OverplannerDate) => {
    const hour = date.zoned_time.getHours();
    const minute = date.zoned_time.getUTCMinutes();
    return (hour * 80) + ((minute / 60) * 80);
}


const getEventDurationBlockHeight = (start: OverplannerDate, end: OverplannerDate) => {
    return getVerticalAbsoluteStartPosition(end) - getVerticalAbsoluteStartPosition(start)
}


export default function RenderEventsInDayViewVerticalTimeList({
    events,
    onEventClick,
    className = ""
}: {
    events: OverplannerEventViewType[],
    onEventClick: (e: MouseEventHandler<HTMLButtonElement> | any, action: 'preview' | 'edit' | 'delete' | 'create', target: string) => any,
    className?: string
}) {

    const { deleteEvent, viewEvent } = useContext(OverplannerSessionContext);

    const handleDelete = (eventId: string) => {

        if (!deleteEvent) {
            return;
        }


        fetch(`/api/events/${eventId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.message ?? `Request failed (${res.status})`);
                }
                // router.push('/login')
                // addNewEvent(re)
                console.log(res);

                const data = await res.json();

                deleteEvent(eventId)

                toast.success("Event deleted!")
                return;
            })
            .catch(err => {
                console.log({
                    success: false,
                    err
                })
                toast.error("Failed to delete event.")
            })

        return null;
    }



    return (
        <>
            {events.map((event) => {

                if (event.type == 'all_day') {
                    return null;
                }

                if (!event.start || !event.end) {
                    return null;
                }

                const startDateTime = new OverplannerDate(new Date(event.start), event.start_timezone);
                const endDateTime = new OverplannerDate(new Date(event.end), event.end_timezone ?? event.start_timezone);

                const getContrastTextColor = (hexColor: string) => {
                    const hex = hexColor.replace('#', '');
                    if (hex.length !== 6) return '#ffffff';

                    const r = parseInt(hex.substring(0, 2), 16) / 255;
                    const g = parseInt(hex.substring(2, 4), 16) / 255;
                    const b = parseInt(hex.substring(4, 6), 16) / 255;

                    // Calculate relative luminance
                    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    return L > 0.5 ? '#000000' : '#ffffff';
                };

                const eventColor = event.color || '#3B82F6';
                const textColor = getContrastTextColor(eventColor);


                const timeHeightForEvent = Math.max(differenceInMinutes(event.end, event.start), 30);

                if (timeHeightForEvent <= 30) {
                    return (
                        <ContextMenu key={event.id}>
                            <ContextMenuTrigger> 
                                    <Button variant='outline'
                                        className={cn(
                                            "z-5 absolute flex flex-col items-start justify-start gap-1 py-2 px-3 w-full overflow-hidden!",
                                            "border border-1 ",
                                            "[background-color:color-mix(in_srgb,var(--event-color)_10%,var(--background))]!",
                                            "hover:[background-color:color-mix(in_srgb,var(--event-color)_18%,var(--background))]!",
                                            "[border-color:color-mix(in_srgb,var(--event-color)_45%,var(--border))]!",
                                            className
                                        )}
                                        style={{
                                            top: `${getTimeOfVerticalStartPosition(startDateTime)}px`,
                                            height: `${((80) * (timeHeightForEvent / 60))}px`,
                                            "--event-color": eventColor,
                                        }}
                                        onClick={(e) => {
                                            viewEvent && viewEvent(event.id)
                                        }}>
                                        <div className="flex flex-row gap-2 items-center w-full h-fit">
                                            <p className="text-xs opacity-50">{startDateTime.print("h:mm a")} - {endDateTime.print("h:mm a")}</p>
                                            <p className="text-xs font-semibold">{event.name}</p>
                                            <p className="text-xs opacity-50">{event.id.slice(0, 5)}...</p>
                                        </div>
                                        {/* <p>{verticalAbsolutePosition}</p>
                                     <p>{timeOfDayVerticalPosition(dayjs(event.start))} - {timeOfDayVerticalPosition(dayjs(event.end))}</p> */}
                                    </Button> 
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuGroup>
                                    <ContextMenuItem variant="destructive" onClick={e => {
                                        handleDelete(event.id);
                                    }}>
                                        Delete
                                        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                                    </ContextMenuItem>
                                </ContextMenuGroup>
                            </ContextMenuContent>
                        </ContextMenu>
                    )
                }

                return (
                    <ContextMenu key={event.id}>
                        <ContextMenuTrigger> 
                                <Button variant='outline'
                                    className={cn(
                                        "z-5 absolute w-full flex flex-col items-start justify-start gap-1 py-2 px-3  overflow-hidden!",
                                        "border border-1 ",
                                        "[background-color:color-mix(in_srgb,var(--event-color)_10%,var(--background))]!",
                                        "hover:[background-color:color-mix(in_srgb,var(--event-color)_18%,var(--background))]!",
                                        "[border-color:color-mix(in_srgb,var(--event-color)_45%,var(--border))]!",
                                        className
                                    )}
                                    style={{
                                        top: `${getTimeOfVerticalStartPosition(startDateTime)}px`,
                                        height: `${((80) * (timeHeightForEvent / 60))}px`,
                                        // @ts-ignore
                                        "--event-color": eventColor,
                                    }}
                                    onClick={(e) => {
                                        viewEvent && viewEvent(event.id)
                                    }}>
                                    <p className="text-xs opacity-50">{startDateTime.print("h:mm a")} - {endDateTime.print("h:mm a")}</p>
                                    <p className="text-xs font-semibold">{event.name}</p>
                                    <p className="text-xs opacity-50">{event.id}</p>
                                    {/* <p className="text-xs opacity-50">{event.color}</p> */}
                                    {/* <p>{verticalAbsolutePosition}</p>
                                     <p>{timeOfDayVerticalPosition(dayjs(event.start))} - {timeOfDayVerticalPosition(dayjs(event.end))}</p> */}
                                </Button> 
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuGroup>
                                <ContextMenuItem variant="destructive" onClick={e => {
                                    handleDelete(event.id);
                                }}>
                                    Delete
                                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                                </ContextMenuItem>
                            </ContextMenuGroup>
                        </ContextMenuContent>
                    </ContextMenu>
                )
            })}
        </>
    )
}