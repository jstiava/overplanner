'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { cn } from "@/lib/utils";
import { OverplannerEventViewType, OverplannerUserPublicType } from "@/schema"
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Seperator from "@/components/Seperator";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { OverplannerCalendarContext } from "@/components/OverplannerCalendarContext";
import CalendarDayVerticalTimeListV2 from "@/components/CalendarDayVerticalTimeListV2";
import RenderEventsInDayViewVerticalTimeList from "@/components/RenderEventsInDayViewVirtualTimeList";
import SmallEventBlock from "@/components/events/SmallEventBlock";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { OverplannerPanelContext } from "@/components/ResizableDraggablePanel";


export default function CalendarDayViewSingleDaySlide(props: {
    date: OverplannerDate,
    events: OverplannerEventViewType[],
}) {

    const containerRef = useRef(null);
    const { now, user, setFocusedDate } = useContext(OverplannerSessionContext) 

    const [localEvents, setLocalEvents] = useState(props.events ?? []);

    useEffect(() => {

        setLocalEvents(props.events ?? [])

    }, [props.events])

    const updateColors = (
        next: any[]
    ) => {
        setLocalEvents(next);

        // onChange(
        //     next.map(({ id, ...color }) => color)
        // );
    };


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = localEvents.findIndex(
            (item) => item.id === active.id
        );

        const newIndex = localEvents.findIndex(
            (item) => item.id === over.id
        );

        if (
            oldIndex === -1 ||
            newIndex === -1
        ) {
            return;
        }

        updateColors(
            arrayMove(localEvents, oldIndex, newIndex)
        );
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    if (!now) {

        return <p>Now not found in OverplannerSessionContext</p>
    }

    if (!user || !setFocusedDate) {
        return (<p>No selected date.</p>)
    }

    if (!localEvents) {
        return <p>No events.</p>
    }

    return (
        <>
            {/* Today declaration */}
            <div className="flex w-full justify-center items-center opacity-50 text-sm h-10">
                <p><span className="">{props.date.print("eeee")}</span>, {props.date.print("MMMM dd, yyyy")}</p>
            </div>

            <Seperator />

            {/* All Day Expandable List */}
            <div className="flex p-2 py-3 pb-6 w-full h-fit ">
                <div className="flex flex-col gap-2 w-fit pr-[0.5rem]">
                    <Button variant={'outline'} className="aspect-square size-12 "></Button>
                    <p className="text-[0.6rem] uppercase opacity-50 px-1">All-Day</p>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-[0px] w-full"  
                    >

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >

                            <SortableContext
                                items={localEvents.map(
                                    (item) => item.id
                                )}
                                strategy={
                                    verticalListSortingStrategy
                                }
                            >


                                {localEvents?.map(event => {

                                    if (event.type != 'all_day') {
                                        return null;
                                    }

                                    try {
                                        return (
                                            <SmallEventBlock
                                                key={event.id}
                                                event={event}
                                            />
                                        )
                                    }
                                    catch (err) {
                                        console.log({
                                            err,
                                            message: "Can't render the event",
                                            event
                                        })
                                        return null;
                                    }
                                })}

                            </SortableContext>
                        </DndContext>
                        {/* <Button variant={'outline'} className="bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>  */}
                    </div>
                </div>
            </div>

            <Seperator />


            <ScrollArea className={cn(
                `flex flex-col w-full h-full z-0 py-2 px-1 min-h-0 flex-1`
            )}>
                <div className="flex flex-col w-full h-fit">
                    <div className="flex flex-col h-fit min-h-20">
                        {/* <p className="debug">{JSON.stringify(props.events, null, 2)}</p> */}

                    </div>
                    <div ref={containerRef} className="relative flex flex-col w-full h-fit overflow-visible" >
                        <CalendarDayVerticalTimeListV2 {...{
                            timezone: user?.home_timezone
                        }}>
                            <RenderEventsInDayViewVerticalTimeList {...{
                                events: props.events,
                                onEventClick: (e, action, target) => {
                                    alert(target)
                                },
                                className: "left-[2.5rem] w-[calc(100%-2.5rem)]"
                            }}
                            />
                        </CalendarDayVerticalTimeListV2>
                    </div>
                    <div className="flex flex-col h-[50vh]">

                    </div>
                </div>
            </ScrollArea>
        </>
    )
}