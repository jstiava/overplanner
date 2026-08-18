import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventViewType } from "@/schema"
import Seperator from "@/components/Seperator";
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import CalendarWeekRowVirtualCarousel from "@/components/CalendarWeekRowVirtualCarousel";
import CalendarDayVirtualCarousel from "@/components/CalendarDayVirtualCarousel";

export default function CalendarWeekView(props: {
    events: OverplannerEventViewType[],
}) {

    return (
        <>
            <div className="relative flex flex-col h-full w-full -gap-1  ">
                <div className="flex flex-col w-full shrink-0 pb-2 px-2">

                    <CalendarWeekRowVirtualCarousel {...{
                        events: props.events
                    }} />

                </div>
                <Seperator />

                <div id="SCROLLABLE_DAY" className="flex h-full w-full overflow-hidden">

                    <CalendarDayVirtualCarousel {...{
                        events: props.events
                    }} />

                </div>

            </div >
        </>
    )

}