'use client'

import CalendarDayVerticalTimeListV2 from "@/components/CalendarDayVerticalTimeListV2";
import CalendarDayView from "@/components/CalendarDayView";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import RenderEventsInDayViewVerticalTimeList, { getTimeOfVerticalStartPosition } from "@/components/RenderEventsInDayViewVirtualTimeList";
import Seperator from "@/components/Seperator";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PanelProps } from "react-resizable-panels";


function getTimezoneLabel(timezone: string, date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset",
    }).formatToParts(date);

    const offset = parts.find(
        (part) => part.type === "timeZoneName"
    )?.value ?? "";

    const abbr = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "short",
    })
        .formatToParts(date)
        .find((part) => part.type === "timeZoneName")?.value ?? "";

    // "GMT-05:00" → "-05"
    const match = offset.match(/GMT([+-]\d{2})(?::\d{2})?/);

    return `${abbr}${match ? match[1] : ""}`;
}

export default function WeekViewPanel(props: PanelProps) {

    const [scrollPosition, setScrollPosition] = useState(0);
    const shouldRestoreScroll = useRef(false);

    const chatAreaRef = useRef<any>([]);


    const containerRef = useRef(null);
    const { now, user, focusedDate, setFocusedDate, events, viewEvent } = useContext(OverplannerSessionContext);

    const [fauxWeekFrames, setFauxWeekFrames] = useState<OverplannerDate[][] | null>(focusedDate ? [
        OverplannerDate.getAllDatesInTheWeekOf(focusedDate?.add(-7, 'days')),
        OverplannerDate.getAllDatesInTheWeekOf(focusedDate),
        OverplannerDate.getAllDatesInTheWeekOf(focusedDate?.add(7, 'days')),
    ] : null);

    const [api, setApi] = useState<CarouselApi>();

    // Update the virtual carousel items.
    useEffect(() => {
        if (!api) return;
        setFauxWeekFrames(focusedDate ? [
            OverplannerDate.getAllDatesInTheWeekOf(focusedDate?.add(-7, 'days')),
            OverplannerDate.getAllDatesInTheWeekOf(focusedDate),
            OverplannerDate.getAllDatesInTheWeekOf(focusedDate?.add(7, 'days')),
        ] : null)
        api.scrollTo(1, true);
        shouldRestoreScroll.current = true;

    }, [focusedDate, api]);

    const setChatAreaRef = (el: HTMLDivElement | null) => {
        chatAreaRef.current = el;

        if (!el || !shouldRestoreScroll.current) {
            return;
        }

        shouldRestoreScroll.current = false;

        el.scrollTop = scrollPosition;
    };
    // Monitor scroll and select.
    useEffect(() => {
        if (!api) return;

        // const onScroll = () => {
        //     const scrollPosition = api.scrollProgress();
        // }

        const onSelect = () => {
            const selectedIndex = api.selectedScrollSnap();

            if (selectedIndex == 0) {
                // LEFT

                console.log({
                    message: "Move left"
                })
                setFocusedDate && setFocusedDate(prev => prev?.add(-7, 'days') ?? null)

                // api.scrollTo(1, true)
            }

            if (selectedIndex == 2) {
                // RIGHT
                console.log({
                    message: "Move right"
                })
                setFocusedDate && setFocusedDate(prev => prev?.add(7, 'days') ?? null)

                // api.scrollTo(1, true)
            }

        }

        api.on("select", onSelect);
        // api.on("scroll", onScroll);

        return () => {
            api.off("select", onSelect);
            // api.off("scroll", onScroll);
        };
    }, [api, focusedDate, setFocusedDate]);

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


                    {fauxWeekFrames?.map((daysInWeek, carouselIndex) => {
                        return (
                            <CarouselItem
                                key={daysInWeek[0].print("yyyy-MM-dd")}
                                className="flex flex-col w-full h-full"
                            >

                                <div className="flex w-full h-fit">

                                    <div className="flex items-center justify-center w-[3rem] h-full px-1 bg-muted/50">
                                        {/* <p>Scale</p> */}
                                        <p className="text-[0.6rem] leading-none">{getTimezoneLabel(user.home_timezone)}</p>
                                    </div>

                                    <div className="flex h-full w-[calc(100%-3rem)]">
                                        {daysInWeek?.map(day => {

                                            const allDayEventsOnDay = events?.filter(x => {
                                                return x.type == 'all_day' && day.isSameLocalDate(new OverplannerDate(new Date(x.start), day.timezone))
                                            });

                                            return (
                                                <div key={day.print("yyyy-MM-dd")} className="flex items-center flex-col w-[calc(100%/7)] h-full border border-border">

                                                    {/* Today declaration */}
                                                    <div className="flex w-full justify-center items-center opacity-50 text-sm h-10">
                                                        <p>{day.print("eee dd")}</p>
                                                    </div>

                                                    <Seperator />

                                                    {/* All Day Expandable List */}

                                                    <div className="flex flex-col w-full">
                                                        {allDayEventsOnDay?.map(event => {

                                                            if (event.type != 'all_day') {
                                                                return null;
                                                            }

                                                            try {
                                                                return (
                                                                    <Button key={event.id} onClick={e => {
                                                                        viewEvent && viewEvent(event.id)
                                                                    }} variant={'outline'} className={'flex w-full h-6 items-center px-2 justify-between gap-2 overflow-hidden rounded-xs'}>
                                                                        <div className="flex items-center gap-2">
                                                                            {/* <div className="w-3 h-3 bg-muted rounded-full" /> */}
                                                                            <p className="text-xs">{event.name}</p>
                                                                        </div>
                                                                    </Button>
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
                                                        {/* <Button variant={'outline'} className="bg-transparent! hover:bg-foreground/5! w-full h-7 bg-border"></Button>  */}
                                                    </div>


                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <ScrollArea
                                    id={`scroll_area_${carouselIndex}`}
                                    viewportProps={carouselIndex === 1 ? {
                                        ref: setChatAreaRef,
                                        onScroll: () => {
                                            if (carouselIndex !== 1) return;

                                            const viewport = chatAreaRef.current;

                                            if (!viewport) return;

                                            console.log(
                                                viewport.scrollHeight,
                                                viewport.scrollTop,
                                                viewport.clientHeight
                                            );

                                            setScrollPosition(viewport.scrollTop);
                                        }
                                    } : {}}
                                    className={cn(
                                        `flex flex-col w-full h-full z-0 min-h-0 flex-1`
                                    )}>
                                    <div className="flex w-full">
                                        <div className="flex flex-col w-[3rem] bg-muted/50">
                                            <div className="relative flex flex-col h-fit min-h-20">


                                            </div>
                                            <CalendarDayVerticalTimeListV2 {...{
                                                timezone: user?.home_timezone,
                                                showNow: false
                                            }}>

                                            </CalendarDayVerticalTimeListV2>
                                            <div className="flex flex-col h-[50vh]">

                                            </div>
                                        </div>
                                        <div className="flex flex-col w-[calc(100%-3rem)] h-fit  border-l border-l-border ">
                                            <div className="relative flex flex-col h-fit min-h-20">


                                            </div>
                                            <div ref={containerRef} className="relative flex w-full h-fit overflow-visible" >
                                                {daysInWeek?.map(day => {

                                                    const eventsOnDay = events?.filter(x => {
                                                        return day.isSameLocalDate(new OverplannerDate(new Date(x.start), day.timezone))
                                                    })

                                                    return (
                                                        <div key={day.print("yyyy-MM-dd")} className="flex items-center flex-col w-[calc(100%/7)] h-full border border-border border-1">

                                                            <CalendarDayVerticalTimeListV2 {...{
                                                                timezone: user?.home_timezone,
                                                                showLabels: false,
                                                                showNow: false
                                                            }}>
                                                                <RenderEventsInDayViewVerticalTimeList {...{
                                                                    events: eventsOnDay,
                                                                    onEventClick: (e, action, target) => {
                                                                        alert(target)
                                                                    }
                                                                }} />

                                                                <div className="z-0 absolute w-full bg-muted/50" style={{
                                                                    top: `${getTimeOfVerticalStartPosition(new OverplannerDate(new Date(new Date().setHours(6, 0, 0, 0)), user.home_timezone))}px`,
                                                                    height: `${((80) * ((7.5 * 60) / 60))}px`,
                                                                }} />
                                                            </CalendarDayVerticalTimeListV2>

                                                        </div>
                                                    )
                                                })}

                                            </div>
                                            <div className="flex flex-col h-[50vh]">

                                            </div>
                                        </div>

                                    </div>
                                </ScrollArea>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
        </div >
    );
}