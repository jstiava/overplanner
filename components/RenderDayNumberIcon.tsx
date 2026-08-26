'use client'

import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { useContext } from "react";


export default function RenderDayNumberIcon(props: {
    day: OverplannerDate
}) {

    const { day, ...rest } = props;

    const { now, user, focusedDate } = useContext(OverplannerSessionContext)

    // Today
    if (now && day.isSameLocalDate(new OverplannerDate(now, user?.home_timezone))) {

        if (focusedDate && day.isSameLocalDate(focusedDate)) {
            return (
                <div key="today_selected" className={'flex items-center justify-center size-6 text-[0.65rem] font-bold tracking-tight mb-1 text-white '}>
                    <div className="z-0 absolute size-5 border border-1 rounded-full border-red-500 bg-red-500 " />
                    <span className="z-1" >{day.print("d")}</span>
                </div>
            )
        }

        return (
            <div key="today" className={'flex items-center justify-center size-6 text-[0.65rem] font-bold tracking-tight mb-1 text-red-500'}>
                <div className="absolute size-5 border border-1 rounded-full border-red-500 bg-none" />
                {day.print("d")}
            </div>
        )
    }
    else if (focusedDate && day.isSameLocalDate(focusedDate)) {
        return (
            <div key="selected" className={'flex items-center justify-center size-6 text-[0.65rem] font-bold tracking-tight mb-1'}>
                <div className="absolute size-5 border border-1 rounded-full border-white" />
                {day.print("d")}
            </div>
        )
    }

    return (
        <div className={'flex items-center justify-center size-6 text-[0.65rem] font-bold tracking-tight mb-1'}>
            <div className="absolute size-5 border border-1 rounded-full" />
            {day.print("d")}
        </div>
    );
}