"use client";

import { MouseEvent, useContext, useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Bell,
    Repeat,
    AlignLeft,
    GlobeIcon,
    Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { OverplannerSessionContext, Panel } from "@/components/OverplannerSessionContext";
import { TimezoneSelect } from "@/components/creating/TimezoneSelect";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { ColorItem, OverplannerEventType, OverplannerEventViewType } from "@/schema";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { fromZonedTime } from "date-fns-tz";
import ComboboxEditor from "@/components/editor/ComboboxEditor";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import { ColorSelector } from "@/components/ColorSelector";
import EventTypeSelect from "@/components/EventTypeSelect";
import { EVENT_TYPE_EDITOR_TEMPLATES } from "@/components/event_types/EventTypeEditorTemplates";
import { OverplannerPanelContext } from "@/components/ResizableDraggablePanel";
import useDataStoreState from "@/components/useDataStoreState";
import { COLORS_GOOGLE_CALENDAR_CLASSIC } from "@/components/ColorListV2";
import LocationField from "@/components/LocationField";
import { FileDropArea } from "@/components/FileDropArea";
import { UploadFilesToUploadThing } from "@/lib/uploadthing/UploadThingServerActions";

export type OverplannerCreateEventType = Partial<Omit<OverplannerEventType, "start" | "end" | "start_time" | "end_time"> & {
    start_time: OverplannerDate | null,
    end_time: OverplannerDate | null,
    start: OverplannerDate | null,
    end: OverplannerDate | null,
    share_with_calendars_and_people: any | null,
    color: ColorItem | null
}>;


const DEBUG_FLAG = true;

const DEFAULT_COLORS = COLORS_GOOGLE_CALENDAR_CLASSIC

export default function CreateEventPanel(props: Panel) {



    const [progress, setProgress] = useState<'creating' | 'submitting' | 'error' | 'done'>('creating');
    const { now, user, addNewEvent } = useContext(OverplannerSessionContext);
    const { props: panelProps, setProps } = useContext(OverplannerPanelContext);

    const { data, metadata, handleChangeData, handleChangeMetadata, handleMultiChangeData, handleMultiChangeMetadata, setData, setMetadata } = useDataStoreState<OverplannerCreateEventType | null>(null);

    const handleTypeChange = (newEventType: string | null) => {

        if (!newEventType || !data) {
            return;
        }

        if (newEventType === 'single_time') {
            const start = data.start ?? new OverplannerDate('now', data.start_timezone);
            handleMultiChangeData({
                start,
                end: start,
                type: "single_time"
            })
            handleMultiChangeMetadata({
                end: metadata.start
            })
            return;
        }
        else if (newEventType === 'all_day') {
            const start = data.start ?? new OverplannerDate('now', data.start_timezone);
            const end = data.end ?? start;
            handleMultiChangeData({
                // end: data.start,
                start: start,
                end: end,
                start_time: null,
                end_time: null,
                type: "all_day"
            })
        }
        else if (newEventType == 'calendar') {
            handleMultiChangeData({
                // end: data.start,
                type: "calendar",
                start: null,
                end: null,
                start_time: null,
                end_time: null
            })
        }

        return;
    }

    const [allDay, setAllDay] = useState(false);


    const [calendarAndPeopleOptions, setCalendarAndPeopleOptions] = useState(null);

    const handleCreate = (e: ((event: MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined) => {

        if (!data) {
            return;
        }

        fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                start: data.start && data.start.utc.toISOString(),
                end: data.end && data.end.utc.toISOString(),
                start_time: null,
                end_time: null,
                color: data.color ? data.color.value : null
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.message ?? `Request failed (${res.status})`);
                }
                // router.push('/login')
                // addNewEvent(re)
                console.log(res);

                const data = await res.json();

                if (addNewEvent) {
                    addNewEvent(data.data.newEvent)
                }

                toast.success("Event successfully created!")
                return;
            })
            .catch(err => {
                console.log({
                    success: false,
                    err
                })
                toast.error("Failed to create event.")
                setProgress('error')
            })

        return null;
    }


    useEffect(() => {

        if (!user) {
            return;
        }

        const initialValues = {
            type: props.type ?? 'single_time',
            start: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
            end: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
            start_timezone: user?.home_timezone ?? "",
            end_timezone: user?.home_timezone ?? "",
            color: user.colors && user.colors.length > 0 ? user.colors[0] : DEFAULT_COLORS[0],
            share_with_calendars_and_people: JSON.stringify({
                "root": {
                    "children": [
                        {
                            "children": [
                                {
                                    "trigger": "@",
                                    "value": user.name,
                                    "data": {
                                        ...user,
                                        "label": user.name,
                                        "type": "profile"
                                    },
                                    "type": "custom-beautifulMention",
                                    "version": 1
                                }
                            ],
                            "direction": null,
                            "format": "",
                            "indent": 0,
                            "type": "paragraph",
                            "version": 1,
                            "textFormat": 0,
                            "textStyle": ""
                        }
                    ],
                    "direction": null,
                    "format": "",
                    "indent": 0,
                    "type": "root",
                    "version": 1
                }
            }),
            ...(panelProps.event ?? {})
        } as Partial<OverplannerCreateEventType>

        setMetadata({
            start: initialValues.start,
            start_time: initialValues.start.print("HH:mm"),
            end: initialValues.start._zeroOutSeconds(),
            end_time: initialValues.start.add(60, 'minutes').print("HH:mm"),
        })

        setData(initialValues)

    }, [user, panelProps])

    if (!data) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <h2 className="font-semibold">Create Event</h2>
                    <p className="text-xs text-muted-foreground">
                        Add something to your calendar
                    </p>
                </div>

                <Button type="submit" size="sm" onClick={handleCreate}>
                    Create
                </Button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-auto">
                <div className="space-y-5 p-4">


                    <FileDropArea
                        {...{
                            onFileSelect: async (file) => {
                                const uploaded = await UploadFilesToUploadThing(file)
                            },
                            accept: 'jpg, png',
                            className: 'border-1 h-fit py-6 text-xs'
                        }}
                    />


                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="name"
                            placeholder="Event title"
                            autoFocus
                            onChange={handleChangeData}
                        />
                    </div>

                    <EventTypeSelect
                        value={data.type as any}
                        onChange={handleTypeChange}
                    />


                    {EVENT_TYPE_EDITOR_TEMPLATES.map(Module => {

                        if (Module.value != data.type) {
                            return null;
                        }

                        return (
                            <div className="flex w-full h-fit" key={Module.value}>
                                {Module.Interface ? (
                                    <Module.Interface
                                        {...{
                                            data, metadata, handleChangeData, handleChangeMetadata, handleMultiChangeData, handleMultiChangeMetadata
                                        }}
                                    />
                                ) : (
                                    <div className="flex p-2 border rounded-sm w-full" key={Module.value}>
                                        <p className="w-full p-3 opacity-50 text-xs text-center">No date & time configration.</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}


                    {/* Location */}
                    <div className="flex w-full">
                        <LocationField {...{
                            selected: data.location_details,
                            onSelect: (newPlace) => {
                                handleMultiChangeData({
                                    location_details: newPlace,
                                })
                            }
                        }} />
                    </div>

                    {/* Calendar */}
                    <div className="flex w-full">
                        <Field>
                            <FieldLabel>Calendars & People</FieldLabel>
                            <FieldContent>
                                <ComboboxEditor
                                    {...{
                                        placeholder: "Calendars & People",
                                        value: data.share_with_calendars_and_people ?? "",
                                        name: 'share_with_calendars_and_people',
                                        onChange: (e => {
                                            console.log(e)
                                            handleChangeData({
                                                target: {
                                                    name: "share_with_calendars_and_people",
                                                    value: e.target.value
                                                }
                                            })
                                        }),
                                        variables: {
                                            "@": [
                                                { ...user, value: user?.name, label: user?.name, "type": "profile" },
                                            ],
                                            "#": ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"],
                                            "due:": ["Today", "Tomorrow", "01-01-2023"],
                                            "rec:": ["week", "month", "year"],
                                            "\\w+:": [],
                                        }

                                    }}
                                />
                            </FieldContent>
                        </Field>
                    </div>



                    <div className="flex w-full">
                        <Field>
                            <FieldLabel>Color</FieldLabel>
                            <FieldContent>
                                <ColorSelector
                                    colors={user?.colors ?? DEFAULT_COLORS}
                                    value={data.color ?? ""}
                                    onChange={(newColor => {
                                        handleChangeData({
                                            target: {
                                                name: 'color',
                                                value: newColor
                                            }
                                        })
                                    })} />
                            </FieldContent>
                        </Field>
                    </div>


                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            <AlignLeft className="size-4" />
                            Description
                        </Label>

                        <Textarea
                            value={data.description ?? ""}
                            onChange={handleChangeData}
                            id="description"
                            name="description"
                            placeholder="Add a description..."
                            className="min-h-24 resize-none"
                        />
                    </div>

                    {DEBUG_FLAG && <p className="debug">{JSON.stringify({
                        data,
                        metadata
                    }, null, 2)}</p>}

                </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
                <Button
                    type="submit"
                    className="w-full"
                    onClick={handleCreate}
                >
                    Create Event
                </Button>
            </div>
        </div>
    );
}