'use client'

import { OverplannerEventViewType, OverplannerSessionType, OverplannerUserPublicType } from "@/schema"
import { createContext, Dispatch, JSX, SetStateAction, useMemo, useState } from 'react';
import { ThemeProvider } from "./theme-provider";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { Panel } from "@/components/OverplannerSessionContext";




export const OverplannerCalendarContext = createContext<{
    focusedDate: OverplannerDate | null,
    calendar: OverplannerEventViewType | null,
    setFocusedDate: Dispatch<SetStateAction<OverplannerDate | null>> | null,
    panels: Panel[],
    addPanel: (() => any) | null,
    removePanel: ((id: string) => any) | null
}>({
    focusedDate: null,
    calendar: null,
    setFocusedDate: null,
    panels: [
        { id: crypto.randomUUID() },
    ],
    addPanel: null,
    removePanel : null,
});


export default function OverplannerCalendarContextComponent(props: {
    calendar: OverplannerEventViewType,
    children: JSX.Element
}) {

    const date = new Date();
    const initialFocusDate = new OverplannerDate(date, props.calendar.start_timezone);
    const [focusedDate, setFocusedDate] = useState<OverplannerDate | null>(initialFocusDate);

    const [panels, setPanels] = useState<Panel[]>([
        { id: crypto.randomUUID() },
    ]);

    const addPanel = () => {
        setPanels((current) => {
            if (current.length >= 4) return current;

            return [
                ...current,
                { id: crypto.randomUUID() },
            ];
        });
    };

    const removePanel = (id: string) => {
        setPanels((current) => {
            if (current.length <= 1) return current;

            return current.filter((panel) => panel.id !== id);
        });
    };


    const value = useMemo(
        () => ({
            focusedDate,
            setFocusedDate,
            calendar: props.calendar,
            panels,
            addPanel,
            removePanel
        }),
        [focusedDate, panels, props.calendar]
    );

    return (
        <OverplannerCalendarContext.Provider
            value={value}
        >
            {props.children}
        </OverplannerCalendarContext.Provider>
    )
}