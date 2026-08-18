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


export default function CalendarDayViewSingleDaySlide(props: {
    date: OverplannerDate,
    events: OverplannerEventViewType[],
}) {

    const containerRef = useRef(null);
    const { now, user, setFocusedDate } = useContext(OverplannerSessionContext)
    const { calendar } = useContext(OverplannerCalendarContext);

    if (!now) {

        return <p>Now not found in OverplannerSessionContext</p>
    }

    if (!user || !setFocusedDate) {
        return (<p>No selected date.</p>)
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
                <div className="flex flex-col gap-2 w-[5rem] pr-[0.5rem]">
                    <Button variant={'outline'} className="aspect-square w-full h-fit"></Button>
                    <p className="text-[0.6rem] uppercase opacity-50 px-1">All-Day</p>
                </div>
                <div className="flex flex-col gap-[2px] w-[calc(100%-5rem)]">
                    <Button variant={'outline'} className="bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>
                    <Button variant={'outline'} className=" bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>
                    <Button variant={'outline'} className="bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>
                </div>
            </div>

            <Seperator />


            <ScrollArea className={cn(
                `flex flex-col w-full h-full z-0 py-2 px-1 min-h-0 flex-1`
            )}>
                <div className="flex flex-col w-full h-fit">
                    <div className="flex flex-col h-fit min-h-20">


                    </div>
                    <div ref={containerRef} className="flex flex-col w-full h-fit overflow-visible" >
                        <CalendarDayVerticalTimeListV2 {...{
                            timezone: user?.home_timezone
                        }}>
                            <RenderEventsInDayViewVerticalTimeList {...{
                                events: props.events,
                                onEventClick: (e, action, target) => {
                                    alert(target)
                                }
                            }} />
                        </CalendarDayVerticalTimeListV2>
                    </div>
                    <div className="flex flex-col h-[50vh]">

                    </div>
                </div>
            </ScrollArea>
        </>
    )
}