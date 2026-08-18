'use client'

import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventViewType, OverplannerUserPublicType } from "@/schema"
import { useContext, useEffect, useState } from "react";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import {OverplannerCalendarContext} from "@/components/OverplannerCalendarContext";
import CalendarDayViewSingleDaySlide from "@/components/CalendarDayViewSingleDaySlide";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";

export default function CalendarDayVirtualCarousel(props: {
    events: OverplannerEventViewType[]
}) {

    const { user, focusedDate, setFocusedDate } = useContext(OverplannerSessionContext);

    const [fauxDaysFrame, setFauxDateFrame] = useState<OverplannerDate[] | null>(focusedDate ? [
        focusedDate?.add(-1, 'days'),
        focusedDate,
        focusedDate?.add(1, 'days'),
    ] : null);

    const [api, setApi] = useState<CarouselApi>();

    // Update the virtual carousel items.
    useEffect(() => {
        if (!api) return;
        setFauxDateFrame(focusedDate ? [
            focusedDate?.add(-1, 'days'),
            focusedDate,
            focusedDate?.add(1, 'days'),
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
                setFocusedDate && setFocusedDate(prev => prev?.add(-1, 'days') ?? null)

                // api.scrollTo(1, true)
            }

            if (selectedIndex == 2) {
                // RIGHT
                console.log({
                    message: "Move right"
                })
                setFocusedDate && setFocusedDate(prev => prev?.add(1, 'days') ?? null)

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


    /**
        * Arrows can control calendar days scroll left and right.
        */
    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {

            if (!setFocusedDate || !focusedDate) {
                return;
            }

            const target = event.target as HTMLElement;

            if (
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target.isContentEditable
            ) {
                return;
            }

            if (event.key === "ArrowLeft") {
                setFocusedDate((date) => focusedDate.add(-1, 'days'));
            }

            if (event.key === "ArrowRight") {
                setFocusedDate((date) => focusedDate.add(1, 'days'));
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [focusedDate]);


    if (!user || !focusedDate || !setFocusedDate) {
        return (<p>No selected date.</p>)
    }

    return (
        <Carousel
            setApi={setApi}
            opts={{
                loop: false,
            }}
            className="carousel relative w-full z-0 h-full p-0 "

        >
            <CarouselContent className="flex carousel_content h-full">

                {fauxDaysFrame?.map(date => (
                    <CarouselItem key={date.print("yyyy-MM-dd")} className="flex flex-col h-full" >
                        <CalendarDayViewSingleDaySlide {...{
                            date: date,
                            events: props.events.filter(x => {
                                if (x.type == 'single_time') {
                                    const zonedStart = new OverplannerDate(x.start, x.start_timezone);
                                    if (zonedStart.isSameLocalDate(date)) {
                                        return true;
                                    }
                                }
                                return false;
                            })
                        }} />
                    </CarouselItem>

                ))}


            </CarouselContent>
        </Carousel>
    )
}

