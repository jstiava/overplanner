'use client'

import { OverplannerEventViewType } from "@/schema";
import { CalendarDaysIcon, CalendarIcon, CalendarRangeIcon, SquareDashed } from "lucide-react";

export default function RenderEventIcon({ event }: { event: OverplannerEventViewType }) {

    if (event.type == 'all_day') {
        return (
            <div className="flex items-center justify-center w-5 h-5">

                <div className="w-3 h-2 bg-muted rounded-full" style={{
                    backgroundColor: event.color ?? "unset"
                }} />
            </div>
        )
    }

    if (event.type == 'single_time') {
        return (
            <div className="flex items-center justify-center w-5 h-5">
                <div className="w-2 h-2 bg-muted rounded-full bg-transparent border border-1" style={{
                    borderColor: event.color ?? "unset"
                }} />
            </div>
        )
    }

    if (event.type == 'calendar') {
        return (
            <div className="flex items-center justify-center w-5 h-5">

                <CalendarIcon className="w-5 h-5" />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center w-5 h-5">
            <div className="w-3 h-3 bg-muted rounded-full" style={{
                backgroundColor: event.color ?? "unset"
            }} />
        </div>
    );
}