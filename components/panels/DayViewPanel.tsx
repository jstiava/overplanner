'use client'

import CalendarDayView from "@/components/CalendarDayView";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { useContext } from "react";
import { PanelProps } from "react-resizable-panels";


export default function DayViewPanel(props: PanelProps) {

    const { addPanel, panels, removePanel, events } = useContext(OverplannerSessionContext);

    return (
        <div className="flex flex-col w-full h-full">
            <CalendarDayiew {...{
                events
            }} />
        </div>
    );
}