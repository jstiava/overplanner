'use client'

import CalendarDayView from "@/components/CalendarDayView";
import { PanelProps } from "react-resizable-panels";


export default function DayViewPanel(props: PanelProps) {

    return (
        <div className="flex flex-col w-full h-full">
            <CalendarDayView {...{
                events: []
            }} />
        </div>
    );
}