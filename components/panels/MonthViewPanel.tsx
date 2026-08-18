import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventViewType } from "@/schema"
import Seperator from "@/components/Seperator";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import CalendarWeekRowVirtualCarousel from "@/components/CalendarWeekRowVirtualCarousel";
import CalendarDayVirtualCarousel from "@/components/CalendarDayVirtualCarousel";
import { useContext, useMemo, useRef, useState } from "react";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MonthViewPanel(props: {
    events: OverplannerEventViewType[],
}) {

    const containerRef = useRef(null);
    const { user, focusedDate } = useContext(OverplannerSessionContext);
    const [api, setApi] = useState<CarouselApi>();

    // Populate days in the week.
    const daysInMonth = useMemo(
        () =>
            focusedDate
                ? OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(focusedDate)
                : null,
        [focusedDate]
    );

    return (
        <>
            <ScrollArea className="flex w-full h-full">
                <div className="flex w-full h-fit  flex-wrap -gap-x-1 -gap-y-1">
                    {daysInMonth?.map(day => {
                        return (
                            <div key={day.print("yyyy-MM-dd")} className="relative flex items-center flex-col w-[calc(100%/7)] aspect-square  border border-border">

                                <div className="flex absolute left-0 top-0 flex w-8 h-8 rounded-xs border  border border-transparent ">
                                    <Button variant={'ghost'} className="relative w-full h-full font-bold tracking-tight bg-background/30 border border-border p-0" >
                                        <p className="text-[0.65rem]">{day.print("d")}</p>
                                        <div className="absolute w-5 h-5 border border-foreground rounded-full " />
                                    </Button>
                                </div>



                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </>
    )

}