'use client'
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import { FC, JSX, useContext, useRef, useState } from "react";
import { OverplannerEventViewType } from "@/schema";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { cn } from "@/lib/utils";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";

interface CalendarDayVerticalTimeListProps {
  timezone: string,
  children?: JSX.Element | null,
  showLabels?: boolean,
  showNow?: boolean
}

const snapToNearestMultipleOf = (target, divisor) => {
  return Math.round(target / divisor) * divisor;
}

const CalendarDayVerticalTimeListV2: FC<CalendarDayVerticalTimeListProps> = ({
  timezone, children, showLabels = true, showNow = true
}) => {

  const { startCreateNewEvent } = useContext(OverplannerSessionContext)
  const [now, setNow] = useState(() => new OverplannerDate('now', timezone))

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      // LONG PRESS
      startCreateNewEvent && startCreateNewEvent()
    }, 500);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      className="w-full flex flex-col py-0 px-0 h-full w-full"
      style={{
        overflowY: "scroll",
        // touchAction: pendingEvent ? "none" : "auto",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative flex flex-col gap-0 w-full">
        <>
          {_getHoursInADayAsNumberArray().map((t) => {
            return (
              <div key={t} className="flex flex-col w-full h-20">
                <div className="flex items-start justify-between gap-0 h-6">
                  {showLabels && (
                    <p className="font-sans text-[0.7rem] opacity-35 -mt-2">
                      {t % 12 == 0 ? "12" : t % 12} {t < 12 ? "AM" : "PM"}
                    </p>
                  )}
                  <hr
                    style={{
                      width: showLabels ? "calc(100% - 2.5rem)" : "100%",
                    }}
                  />
                </div>
                <div className="flex pt-4 w-full opacity-50">
                  <hr className="w-full" />
                </div>
              </div>
            );
          })}

          {showNow && (
            <div
              id={"#now"}
              key={"now"}
              className={cn(
                "z-10 absolute flex items-end flex-col gap-2 w-full left-0 ",
                showLabels && "w-[calc(100%-3.5rem)] left-[3rem]"
              )}
              style={{
                top: `${(now.zoned_time.getHours() * 5) + (5 * now.zoned_time.getMinutes() / 60)}rem`,
              }}
            >

              {/* <p className="text-xs">{now.print("h:mma")} - {now.timezone}</p> */}
              <div className="w-full border border-1 border-[#ffffff75] rounded-full" />
            </div>
          )}
        </>
        <>
          {children ?? <></>}
        </>
      </div>
    </div>
  );
};

export default CalendarDayVerticalTimeListV2;



