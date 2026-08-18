'use client'
import { _getHoursInADayAsNumberArray } from "@/lib/DateTime/helpers";
import { FC, JSX, useState } from "react";
import { OverplannerEventViewType } from "@/schema";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";

interface CalendarDayVerticalTimeListProps {
  timezone: string,
  children?: JSX.Element | null
}

const snapToNearestMultipleOf = (target, divisor) => {
  return Math.round(target / divisor) * divisor;
}

const CalendarDayVerticalTimeListV2: FC<CalendarDayVerticalTimeListProps> = ({
  timezone, children
}) => {

  const [now, setNow] = useState(() => new OverplannerDate('now', timezone))

  return (
    <div
      className="w-full flex flex-col py-8 px-2 h-full w-full"
      style={{
        overflowY: "scroll",
        // touchAction: pendingEvent ? "none" : "auto",
      }}
    >
      <div className="relative flex flex-col gap-0 w-full">
        <>
          {_getHoursInADayAsNumberArray().map((t) => {
            return (
              <div key={t} className="flex flex-col w-full h-20">
                <div className="flex items-start justify-between gap-0 h-6">
                  <p className="font-sans text-[0.7rem] opacity-35 -mt-2">
                    {t % 12 == 0 ? "12" : t % 12} {t < 12 ? "AM" : "PM"}
                  </p>
                  <hr
                    style={{
                      width: "calc(100% - 2.5rem)",
                    }}
                  />
                </div>
                <div className="flex pt-4 w-full opacity-50">
                  <hr className="w-full" />
                </div>
              </div>
            );
          })}

          <div
            id={"#now"}
            key={"now"}
            className="absolute flex flex-col gap-2 w-[calc(100%-4rem)] left-[4rem] "
            style={{
              top: `${(now.zoned_time.getHours() * 5) + (5 * now.zoned_time.getMinutes() / 60)}rem`,
            }}
          >

            <p className="text-xs">{now.print("h:mma")} - {now.timezone}</p>
            <div className="w-full border border-1 border-[#ffffff75] rounded-full" />
          </div>
        </>
        <>
          {children ?? <></>}
        </>
      </div>
    </div>
  );
};

export default CalendarDayVerticalTimeListV2;



