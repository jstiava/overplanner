import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventViewType } from "@/schema"
import Seperator from "@/components/Seperator";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import CalendarWeekRowVirtualCarousel from "@/components/CalendarWeekRowVirtualCarousel";
import CalendarDayVirtualCarousel from "@/components/CalendarDayVirtualCarousel";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OverplannerPanelContext } from "@/components/ResizableDraggablePanel";
import { AlignLeft, CalendarPlus, CircleFadingArrowUp, PencilIcon, Plus, TrashIcon } from "lucide-react";
import { EventsService } from "@/lib/events/EventsService";
import { getCalendarAgendaServerAction } from "@/components/panels/GetCalendarEventsServerAction";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import RenderEventIcon from "@/components/RenderEventIcon";
import { RenderEventDateTimeHelperText } from "@/components/UserSidebar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PreviewViewPanel() {

    const { user, viewEvent, deleteEvent, startCreateNewEvent } = useContext(OverplannerSessionContext);
    const { id, panel, props } = useContext(OverplannerPanelContext);

    const [agendaItems, setAgendaItems] = useState<OverplannerEventViewType[] | null>(null);

    const event = props?.event as OverplannerEventViewType;

    useEffect(() => {

        if (!user) {
            return;
        }

        const getCalendarAgenda = async () => {
            const eventsForUser = await getCalendarAgendaServerAction({
                event_id: event.id
            })
            return eventsForUser
        }

        getCalendarAgenda()
            .then(events => {
                console.log(events)
                setAgendaItems(events ?? [])
            })

    }, [user])

    if (!event) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No event selected
            </div>
        );
    }

    if (!agendaItems) {
        return null;
    }

    return (
        <div className="flex h-full flex-col overflow-auto">
            {/* Header */}
            <div className="border-b px-6 py-5">

                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                        {event.color && (
                            <div
                                className="mt-1 size-3 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: event.color,
                                }}
                            />
                        )}

                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold">
                                {event.name || "Untitled Event"}
                            </h2>
                        </div>
                    </div>

                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6 p-6">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                        Type
                    </p>

                    <p className="text-sm capitalize">
                        {event.type?.replace("_", " ") || "Calendar"}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                        Start
                    </p>

                    <p className="text-sm">
                        {/* {event.start?.print?.("MMM d, yyyy h:mm a") ??
                            event.start} */}
                    </p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                        End
                    </p>

                    <p className="text-sm">
                        {/* {event.end?.print?.("MMM d, yyyy h:mm a") ??
                            event.end} */}
                    </p>
                </div>

                {/* {event.location && (
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                            Location
                        </p>

                        <p className="text-sm">
                            {event.location}
                        </p>
                    </div>
                )} */}


            </div>

            {/* Sub-events */}
            <div className="space-y-3 px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold">
                            Agenda
                        </h3>

                        <p className="text-xs text-muted-foreground">
                            Add more events...
                        </p>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => {
                            // Add sub-event
                            startCreateNewEvent && startCreateNewEvent({
                                share_with_calendars_and_people: JSON.stringify({
                                    "root": {
                                        "children": [
                                            {
                                                "children": [
                                                    {
                                                        "trigger": "@",
                                                        "value": event.name,
                                                        "data": {
                                                            ...event,
                                                            "label": event.name,
                                                            "type": "event"
                                                        },
                                                        "type": "custom-beautifulMention",
                                                        "version": 1
                                                    }
                                                ],
                                                "direction": null,
                                                "format": "",
                                                "indent": 0,
                                                "type": "paragraph",
                                                "version": 1,
                                                "textFormat": 0,
                                                "textStyle": ""
                                            }
                                        ],
                                        "direction": null,
                                        "format": "",
                                        "indent": 0,
                                        "type": "root",
                                        "version": 1
                                    }
                                })
                            })
                        }}
                    >
                        <Plus className="size-3.5" />
                        Add
                    </Button>
                </div>

                {agendaItems.length === 0 ? (
                    <button
                        type="button"
                        className="
                                flex w-full flex-col items-center
                                justify-center gap-2
                                rounded-lg border border-dashed
                                px-4 py-6
                                text-center
                                transition-colors
                                hover:bg-muted/50
                            "
                        onClick={() => {
                            // Add sub-event
                            startCreateNewEvent && startCreateNewEvent({
                                share_with_calendars_and_people: JSON.stringify({
                                    "root": {
                                        "children": [
                                            {
                                                "children": [
                                                    {
                                                        "trigger": "@",
                                                        "value": event.name,
                                                        "data": {
                                                            ...event,
                                                            "label": event.name,
                                                            "type": "event"
                                                        },
                                                        "type": "custom-beautifulMention",
                                                        "version": 1
                                                    }
                                                ],
                                                "direction": null,
                                                "format": "",
                                                "indent": 0,
                                                "type": "paragraph",
                                                "version": 1,
                                                "textFormat": 0,
                                                "textStyle": ""
                                            }
                                        ],
                                        "direction": null,
                                        "format": "",
                                        "indent": 0,
                                        "type": "root",
                                        "version": 1
                                    }
                                })
                            })
                        }}
                    >
                        <CalendarPlus className="size-5 text-muted-foreground" />

                        <div>
                            <p className="text-sm font-medium">
                                Add a sub-event
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Break this event into smaller events.
                            </p>
                        </div>
                    </button>
                ) : (
                    <div className="flex flex-col gap-1">
                        {agendaItems.map((subEvent: any) => {

                            try {

                                return (
                                    <ContextMenu key={subEvent.id}>
                                        <ContextMenuTrigger>
                                            <Button key={subEvent.id} variant={'outline'} className={'flex w-full h-6 items-center px-1 justify-between gap-2'} onClick={e => {
                                                viewEvent && viewEvent(subEvent.id);
                                            }}>
                                                <div className="flex items-center gap-2">
                                                    <RenderEventIcon event={subEvent} />
                                                    <p className="text-xs">{subEvent.name}</p>
                                                    <span className="text-xs opacity-50">{subEvent.id.slice(0, 5)}...</span>
                                                </div>
                                                <RenderEventDateTimeHelperText {...subEvent} />
                                            </Button>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuGroup>
                                                <ContextMenuItem variant="destructive" onClick={e => {
                                                    // handleDelete(subEvent.id);
                                                }}>
                                                    Delete
                                                    {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                                                </ContextMenuItem>
                                            </ContextMenuGroup>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                )
                            }
                            catch (err) {
                                return null;;
                            }

                        })}
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-2 px-6 py-6">
                <Label htmlFor="notes">
                    <AlignLeft className="size-4" />
                    Notes
                </Label>

                <Textarea
                    // value={data.description ?? ""}
                    // onChange={handleChangeData}
                    id="notes"
                    name="notes"
                    placeholder="Add notes..."
                    className="min-h-24 resize-none"
                />
               
            </div>


            <div className="flex flex-col p-6">
                 {event.id && (
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                            ID
                        </p>

                        <p className="break-all font-mono text-xs text-muted-foreground">
                            {event.id}
                        </p>
                    </div>
                )}

            </div>
               
            <div className="flex flex-col p-6 gap-1">
                <Button variant={'outline'} ><PencilIcon size={'xs'} />Edit</Button>
                   <Button variant={'outline'} ><CircleFadingArrowUp size={'xs'} />Convert</Button>
                 <Button variant={'destructive'}  ><TrashIcon size={'xs'} />Delete</Button>
            </div>





        </div>
    );
}