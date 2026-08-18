'use client'

import { OverplannerEventViewType, OverplannerSessionType, OverplannerUserPublicType } from "@/schema"
import { createContext, Dispatch, JSX, SetStateAction, useMemo, useState } from 'react';
import { ThemeProvider } from "./theme-provider";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";

export type PanelPrebuiltTypes = 'create' | 'day' | 'week' | 'month' | 'preview' | 'edit' | 'table'

export type Panel = {
    id: string;
    type?: PanelPrebuiltTypes;
};

export type PanelCreationProps = {
    type?: PanelPrebuiltTypes
}


export const OverplannerSessionContext = createContext<{
    now: Date | null,
    user: OverplannerUserPublicType | null,
    session: OverplannerSessionType | null,
    isDark: boolean,
    focusedDate: OverplannerDate | null,
    setFocusedDate: Dispatch<SetStateAction<OverplannerDate | null>> | null,
    toggleDarkMode: () => any,
    panels: Panel[],
    setPanels: Dispatch<SetStateAction<Panel[]>> | null,
    addPanel: ((props?: PanelCreationProps) => any) | null,
    removePanel: ((id: string) => any) | null
}>({
    now: null,
    user: null,
    session: null,
    isDark: false,
    focusedDate: null,
    setFocusedDate: null,
    toggleDarkMode: () => { },
    panels: [
        { id: crypto.randomUUID() },
    ],
    setPanels: null,
    addPanel: null,
    removePanel: null,
});

export default function OverplannerSessionContextComponent(props: {
    user: OverplannerUserPublicType | null,
    session: OverplannerSessionType | null,
    children: JSX.Element
}) {

    const date = new Date();
    const [focusedDate, setFocusedDate] = useState<OverplannerDate | null>(new OverplannerDate(date, props.user?.home_timezone ?? 'utc'));
    const [isDark, setIsDark] = useState(() => props.user?.is_dark ?? false)
    const [calendar, setCalendar] = useState<OverplannerEventViewType | null>(null);

    const toggleDarkMode = () => {
        setIsDark(prev => !prev);
    }

    const [panels, setPanels] = useState<Panel[]>([
        { id: crypto.randomUUID() },
    ]);


    const addPanel = (props?: PanelCreationProps) => {
        setPanels((current) => {
            if (current.length >= 4) return current;

            return [
                ...current,
                { ...props, id: crypto.randomUUID() },
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
            now: date,
            user: props.user,
            session: props.session,
            isDark,
            focusedDate,
            setFocusedDate,
            toggleDarkMode,
            panels,
            addPanel,
            setPanels,
            removePanel
        }),
        [date, props.user, props.session, isDark, focusedDate, panels, toggleDarkMode, calendar]
    );

    return (
        <OverplannerSessionContext.Provider
            value={value}
        >
            <ThemeProvider
                attribute="class"
                forcedTheme={isDark ? 'dark' : 'light'}
            >
                {props.children}
            </ThemeProvider>
        </OverplannerSessionContext.Provider>
    )
}