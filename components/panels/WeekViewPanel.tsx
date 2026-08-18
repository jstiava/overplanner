'use client'

import CalendarDayVerticalTimeListV2 from "@/components/CalendarDayVerticalTimeListV2";
import CalendarDayView from "@/components/CalendarDayView";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import RenderEventsInDayViewVerticalTimeList from "@/components/RenderEventsInDayViewVirtualTimeList";
import Seperator from "@/components/Seperator";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { cn } from "@/lib/utils";
import { useContext, useMemo, useRef, useState } from "react";
import { PanelProps } from "react-resizable-panels";


export default function WeekViewPanel(props: PanelProps) {

    const containerRef = useRef(null);
    const { user, focusedDate } = useContext(OverplannerSessionContext);
    const [api, setApi] = useState<CarouselApi>();

    // Populate days in the week.
    const daysInWeek = useMemo(
        () =>
            focusedDate
                ? OverplannerDate.getAllDatesInTheWeekOf(focusedDate)
                : null,
        [focusedDate]
    );

    if (!user || !focusedDate) {
        return (<p>No selected date.</p>)
    }

    return (
        <div className="flex  w-full h-full">
            <Carousel
                setApi={setApi}
                opts={{
                    loop: false,
                }}
                className="carousel relative w-full z-0 h-full p-0 "
            >
                <CarouselContent className="flex carousel_content h-full">

                    <CarouselItem className="flex flex-col w-full h-full">

                        <div className="flex w-full h-fit">

                            {daysInWeek?.map(day => {
                                return (
                                    <div key={day.print("yyyy-MM-dd")} className="flex items-center flex-col w-[calc(100%/7)] h-full border border-border">

                                        {/* Today declaration */}
                                        <div className="flex w-full justify-center items-center opacity-50 text-sm h-10">
                                            <p>{day.print("eee dd")}</p>
                                        </div>

                                        <Seperator />

                                        {/* All Day Expandable List */}
                                        <div className="flex p-1 py-1 pb-3 w-full h-fit ">
                                            <div className="flex flex-col gap-[2px] w-full">
                                                <Button variant={'outline'} className="bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>
                                                <Button variant={'outline'} className=" bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>
                                                <Button variant={'outline'} className="bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
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
                                        {/* <RenderEventsInDayViewVerticalTimeList {...{
                                                        events: props.events,
                                                        onEventClick: (e, action, target) => {
                                                            alert(target)
                                                        }
                                                    }} /> */}
                                    </CalendarDayVerticalTimeListV2>
                                </div>
                                <div className="flex flex-col h-[50vh]">

                                </div>
                            </div>
                        </ScrollArea>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </div>
    );
}