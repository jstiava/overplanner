import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventViewType } from "@/schema"
import Seperator from "@/components/Seperator";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import CalendarWeekRowVirtualCarousel from "@/components/CalendarWeekRowVirtualCarousel";
import CalendarDayVirtualCarousel from "@/components/CalendarDayVirtualCarousel";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RenderDayNumberIcon from "@/components/RenderDayNumberIcon";

export default function MonthViewPanel(props: {
    events: OverplannerEventViewType[],
}) {

    const containerRef = useRef(null);
    const { now, user, focusedDate, setFocusedDate, events, viewEvent } = useContext(OverplannerSessionContext);

    // Populate days in the week.

    const [fauxMonthFrames, setFauxMonthFrames] = useState<OverplannerDate[][] | null>(focusedDate ? [
        OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate.getStartOf('month').add(-1, 'days').getStartOf('month')),
        OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate.getStartOf('month')),
        OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate.getEndOf('month').add(1, 'days').getStartOf('month')),
    ] : null);

    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;
        setFauxMonthFrames(focusedDate ? [
            OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate.getStartOf('month').add(-1, 'days').getStartOf('month')),
            OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate.getStartOf('month')),
            OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate.getEndOf('month').add(1, 'days').getStartOf('month')),
        ] : null)
        api.scrollTo(1, true)
    }, [focusedDate, api]);

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
                setFocusedDate && setFocusedDate(prev => prev?.add(-1, 'months') ?? null)

                // api.scrollTo(1, true)
            }

            if (selectedIndex == 2) {
                // RIGHT
                console.log({
                    message: "Move right"
                })
                setFocusedDate && setFocusedDate(prev => prev?.add(1, 'months') ?? null)

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

    if (!setFocusedDate || !now) {
        return null;
    }

    return (
        <>
            <div className="flex w-full h-full">
                <Carousel
                    setApi={setApi}
                    opts={{
                        loop: false,
                    }}
                    className="carousel relative w-full z-0 h-full "
                >
                    <CarouselContent className="flex carousel_content h-full ">
                        {fauxMonthFrames?.map(month => {

                            const representativeDate = month[7].getStartOf('month');
                            return (
                                <CarouselItem
                                    key={representativeDate.print("yyyy-MM")}
                                    className="flex flex-col w-full h-full"
                                >
                                    <div className="flex h-16 w-full items-center gap-3 px-6 border-b">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setFocusedDate(representativeDate.add(-1, 'days').getStartOf('month'))
                                                }}
                                            >
                                                <ChevronLeft className="size-4" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setFocusedDate(representativeDate.add(40, 'days').getStartOf('month'))
                                                }}
                                            >
                                                <ChevronRight className="size-4" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-1"
                                                onClick={() => {
                                                    // go to today
                                                    setFocusedDate(new OverplannerDate(now, user?.home_timezone))
                                                }}
                                            >
                                                Today
                                            </Button>
                                        </div>

                                        <h3 className="ml-3 text-xl font-bold tracking-tight">
                                            {month[7].print("MMMM yyyy")}
                                        </h3>
                                    </div>
                                    <ScrollArea className={'flex-1 min-h-0'}>
                                        <div className="flex w-full h-fit flex-wrap -gap-1">
                                            {month.map(day => {

                                                const eventsOnDay = events?.filter(x => {
                                                    return x.start && day.isSameLocalDate(new OverplannerDate(new Date(x.start), day.timezone))
                                                })


                                                return (
                                                    <Button
                                                        variant={'ghost'}
                                                        className="relative flex flex-col gap-0 rounded-none items-center justify-start aspect-square w-[calc(100%/7)]! h-fit! py-1 px-1 border-b border-b-border"
                                                        onClick={e => {
                                                            setFocusedDate(day)
                                                        }}
                                                    >
                                                        <RenderDayNumberIcon day={day}  />

                                                        {eventsOnDay?.map(event => {

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
                                                                        {/* <span className="text-xs opacity-50">{new OverplannerDate(new Date(event.start)).print("yyyy-MM-dd")}</span> */}
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



                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    </ScrollArea>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                </Carousel>
            </div>
        </>
    )

}