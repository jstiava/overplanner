'use client'

import { OverplannerEventViewType, OverplannerSessionType, OverplannerUserPublicType } from "@/schema"
import { createContext, Dispatch, JSX, SetStateAction, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from "./theme-provider";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerCreateEventType } from "@/components/panels/CreateEventPanel";

export type PanelPrebuiltTypes = 'create-event' | 'day' | 'week' | 'month' | 'preview' | 'edit' | 'table'

export type Panel = {
    id: string;
    type?: PanelPrebuiltTypes | (string & {});
    props?: any,
    setProps?: Dispatch<SetStateAction<any>> | null,
    size?: number,
    sizeInPixels?: number
};

export type PanelCreationProps = {
    type?: PanelPrebuiltTypes,
    props?: any
}


export const OverplannerSessionContext = createContext<{
    panelGroupRef: any,
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
    removePanel: ((id: string) => any) | null,
    events: OverplannerEventViewType[] | null,
    addNewEvent: ((newEvent: OverplannerEventViewType) => any) | null,
    deleteEvent: ((newEvent: string) => any) | null,
    viewEvent: ((newEvent: string) => any) | null,
    startCreateNewEvent: ((props: OverplannerCreateEventType) => any) | null,
}>({
    panelGroupRef: null,
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
    events: null,
    addNewEvent: null,
    deleteEvent: null,
    viewEvent: null,
    startCreateNewEvent: null
});

const DEFAULT_PANELS = [
    {
        "type": "day-view",
        "id": "fe8e8772-751a-4a18-a09e-69d5d1410896",
        "size": 23.404
    },
    {
        "type": "week-view",
        "id": "818229c2-21c2-4bf6-b6c1-74731e375976",
        "size": 52.848
    },
    {
        "type": "create-event",
        "props": {
            event: {
                type: 'single_time'
            }
        },
        "id": "6c6d658d-8cd9-4568-8ca4-da436affca47",
        "size": 23.747
    },

]

export default function OverplannerSessionContextComponent(props: {
    user: OverplannerUserPublicType | null,
    session: OverplannerSessionType | null,
    children: JSX.Element,
    events: OverplannerEventViewType[]
}) {

    const panelGroupRef = useRef<any>(null);
    const date = new Date();
    const [focusedDate, setFocusedDate] = useState<OverplannerDate | null>(new OverplannerDate(date, props.user?.home_timezone ?? 'utc'));
    const [isDark, setIsDark] = useState(() => props.user?.is_dark ?? false)
    const [calendar, setCalendar] = useState<OverplannerEventViewType | null>(null);
    const [events, setEvents] = useState(props.events)

    const toggleDarkMode = () => {
        setIsDark(prev => !prev);
    }

    const [panels, setPanels] = useState<Panel[]>(DEFAULT_PANELS);


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

    const addNewEvent = (newEvent: OverplannerEventViewType) => {
        setEvents(prev => {
            return [...prev, newEvent]
        })
    }

    const deleteEvent = (eventId: string) => {
        setEvents(prev => {
            const newEventList = [...(prev ?? [])].filter(e => {
                return e.id != eventId
            })
            return newEventList
        })
    }


    const startCreateNewEvent = (initialProps: OverplannerCreateEventType) => {
        const createPanel = panels.find(x => x.type == 'create-event');

        console.log({
            message: "startCreateNewEvent",
            initialProps
        });


        if (createPanel) {
            setPanels((prev) =>
                prev.flatMap((panel) =>
                    panel.type === "create-event"
                        ? [
                            {
                                id: crypto.randomUUID(),
                                type: "create-event",
                                props: {
                                    event: initialProps as any,
                                },
                                sizeInPixels: createPanel.sizeInPixels,
                                size: createPanel.size,
                            }
                        ]
                        : [panel]
                )
            );
        }
        else {
            addPanel({
                type: 'create-event',
                props: {
                    event: initialProps
                }
            })
        }
    }

    const viewEvent = (eventId: string) => {
        const previewPanel = panels.find(x => x.type == 'preview');

        const theEvent = events.find(x => x.id == eventId);

        if (!theEvent) {
            return null;
        }

        if (previewPanel) {

            const group = panelGroupRef.current;

            if (!group) return;

            const currentLayout = group.getLayout();
            const newId = crypto.randomUUID();

            const nextLayout = Object.fromEntries(
                Object.entries(currentLayout).map(([id, size]) =>
                    id === previewPanel.id
                        ? [newId, size]
                        : [id, size]
                )
            );

            console.log({
                currentLayout,
                nextLayout
            })

            setPanels((prev) =>
                prev.flatMap((panel) =>
                    panel.id === previewPanel.id
                        ? [
                            {
                                id: newId,
                                sizeInPixels: previewPanel.sizeInPixels,
                                size: previewPanel.size,
                                type: "preview",
                                props: {
                                    event: theEvent,
                                },
                            },
                        ]
                        : [panel]
                )
            );

            requestAnimationFrame(() => {
                group.setLayout(nextLayout);
            });
        }
        else {
            addPanel({
                type: 'preview',
                props: {
                    event: theEvent
                }
            })
        }
    }



    const value = useMemo(
        () => ({
            panelGroupRef,
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
            removePanel,
            events,
            addNewEvent,
            deleteEvent,
            viewEvent,
            startCreateNewEvent,
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