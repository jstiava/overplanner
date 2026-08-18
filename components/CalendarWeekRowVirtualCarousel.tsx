'use client'

import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventViewType, OverplannerUserPublicType } from "@/schema"
import { useContext, useEffect, useMemo, useState } from "react";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CalendarDayViewSingleDaySlide from "./CalendarDayViewSingleDaySlide";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getDaysInMonth } from "date-fns";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { OverplannerCalendarContext } from "@/components/OverplannerCalendarContext";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";


export default function CalendarWeekRowVirtualCarousel(props: {
    events: OverplannerEventViewType[]
}) {

    const { user, focusedDate, setFocusedDate } = useContext(OverplannerSessionContext);

    // Populate days in the week.
    const daysInWeek = useMemo(
        () =>
            focusedDate
                ? OverplannerDate.getAllDatesInTheWeekOf(focusedDate)
                : null,
        [focusedDate]
    );

    const thisMonthsDates = useMemo(() => {
        if (!focusedDate) return null;

        return OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(
            focusedDate
        );
    }, [focusedDate]);

    const [fauxDaysFrame, setFauxDateFrame] = useState<(OverplannerDate[] | null)[] | null>(focusedDate ? [
        OverplannerDate.getAllDatesInTheWeekOf(focusedDate.add(-7, 'days')),
        daysInWeek,
        OverplannerDate.getAllDatesInTheWeekOf(focusedDate.add(7, 'days')),
    ] : null);

    const [api, setApi] = useState<CarouselApi>();

    // Update the virtual carousel items.
    useEffect(() => {
        if (!api) return;
        setFauxDateFrame(focusedDate ? [
            OverplannerDate.getAllDatesInTheWeekOf(focusedDate.add(-7, 'days')),
            daysInWeek,
            OverplannerDate.getAllDatesInTheWeekOf(focusedDate.add(7, 'days')),
        ] : null)
        api.scrollTo(1, true)
    }, [focusedDate, api])

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
            }

            if (selectedIndex == 2) {
                // RIGHT
                console.log({
                    message: "Move right"
                })
                setFocusedDate && setFocusedDate(prev => prev?.add(7, 'days') ?? null)
            }
        }

        api.on("select", onSelect);
        // api.on("scroll", onScroll);

        return () => {
            api.off("select", onSelect);
            // api.off("scroll", onScroll);
        };
    }, [api, focusedDate, setFocusedDate]);


    if (!user || !focusedDate || !setFocusedDate) {
        return (<p>No selected date.</p>)
    }

    if (!thisMonthsDates) {
        return (<p>No days in month populated.</p>)
    }

    return (
        <Carousel
            setApi={setApi}
            opts={{
                loop: false,
            }}
            className="carousel relative  w-full h-full  z-0 h-full  overflow-hidden p-0 "

        >
            <CarouselContent className="flex carousel_content h-full min-h-0 ">

                {fauxDaysFrame?.map(week => {

                    if (!week) {
                        return null;
                    }

                    return (
                        <CarouselItem key={week[0].print("yyyy-MM-dd")} className="h-full min-h-0" >


                            <div className="flex justify-between items-center w-full">
                                {week?.map(date => {

                                    const localToday = new OverplannerDate(new Date(), user.home_timezone ?? 'utc');
                                    const isToday = date.isSameLocalDate(localToday);

                                    const isSelected = focusedDate.isSameLocalDate(date);

                                    const isNotSameMonth = !date.isSameLocalMonth(thisMonthsDates[6])

                                    const blockProps = {
                                        date,
                                        classNames: {
                                            root: "w-full h-full rounded-xs",
                                            forFreeDay: 'hover:bg-[#5d5d5d] transition text-white',
                                            forFilledDateContent: 'pb-[0.1rem] transition',
                                            forFilledDate: 'hover:opacity-50 '
                                        },
                                        events: []
                                    }

                                    if (isSelected) {
                                        return (
                                            <div
                                                key={date.print("yyyy-MM-dd")}
                                                className={
                                                    cn(
                                                        "flex flex-col items-center justify-center aspect-[3/4] w-[calc(100%/7)] h-fit bg=background px-1 md:px-1",
                                                        isNotSameMonth && 'opacity-50'
                                                    )
                                                }>
                                                <div className="flex h-6 w-full items-center justify-center">
                                                    <p className="text-[0.6rem] uppercase opacity-50">{date.print("eee")}</p>
                                                </div>
                                                <div className={`flex w-full h-fit rounded-xs `}>
                                                    <Button variant={'ghost'} className="aspect-square relative w-full h-fit font-bold text-[1rem] tracking-tight bg-background/30 border border-border text-white border-white " onClick={e => {
                                                        setFocusedDate(date)
                                                    }}>
                                                        <p>{date.print("d")}</p>
                                                        {/* <div className="absolute w-5 h-5 border border-foreground rounded-full " /> */}
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div
                                            key={date.print("yyyy-MM-dd")}
                                            className={
                                                cn(
                                                    "flex flex-col items-center justify-center aspect-[3/4] w-[calc(100%/7)] h-fit bg=background px-1 md:px-1",
                                                    isNotSameMonth && 'opacity-50'
                                                )
                                            }>
                                            <div className="flex h-6 w-full items-center justify-center">
                                                <p className="text-[0.6rem] uppercase opacity-50">{date.print("eee")}</p>
                                            </div>
                                            <div className={`flex w-full h-fit rounded-xs `}>
                                                <Button variant={'ghost'} className="aspect-square relative w-full h-fit font-bold text-[1rem] tracking-tight bg-background/30 border border-border " onClick={e => {
                                                    setFocusedDate(date)
                                                }}>
                                                    <p>{date.print("d")}</p>
                                                    {/* <div className="absolute w-5 h-5 border border-foreground rounded-full " /> */}
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CarouselItem>
                    )
                })}


            </CarouselContent>
        </Carousel>
    )
}

