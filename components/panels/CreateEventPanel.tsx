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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OverplannerSessionContext, Panel } from "@/components/OverplannerSessionContext";
import { TimezoneSelect } from "@/components/creating/TimezoneSelect";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { OverplannerEventType } from "@/schema";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { fromZonedTime } from "date-fns-tz";
import ComboboxEditor from "@/components/editor/ComboboxEditor";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

export type OverplannerCreateEventType = Partial<Omit<OverplannerEventType, "start" | "end" | "start_time" | "end_time"> & {
    start_time: OverplannerDate | null,
    end_time: OverplannerDate | null,
    start: OverplannerDate | null,
    end: OverplannerDate | null,
    share_with_calendars_and_people: any | null
}>

export default function CreateEventPanel(props: Panel) {

    const [progress, setProgress] = useState<'creating' | 'submitting' | 'error' | 'done'>('creating');
    const { now, user, addNewEvent } = useContext(OverplannerSessionContext)

    const [data, setData] = useState<OverplannerCreateEventType | null>(null);

    const [metadata, setMetadata] = useState<any>({});
    const handleChangeData = (e: any) => {

        setData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
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
                start: data.start_time ? data.start_time.utc.toISOString() : null,
                end: data.end_time ? data.end.utc.toISOString() : null,
                start_time:  null,
                end_time:  null,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.message ?? `Request failed (${res.status})`);
                }
                // router.push('/login')
// addNewEvent(re)
console.log(res)
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

        setData({
            start: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
            end: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
            start_time: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
            end_time: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
            start_timezone: user?.home_timezone ?? "",
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
            })
        })

    }, [user])

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

                    <div className="flex flex-col gap-4 w-full p-4 border bg-muted/50 rounded-sm">
                        <Label>
                            <CalendarDays className="size-4" />
                            Date & Time
                        </Label>

                        {/* Date */}
                        <div className="flex items-end gap-2">
                            <div className="min-w-0 flex-1">
                                <Input
                                    {...{
                                        type: 'date',
                                        name: 'start',
                                        value: data.start?.print("yyyy-MM-dd"),
                                        onChange: (e) => {
                                            const utc = fromZonedTime(`${e.target.value}T00:00:00`, data.start_timezone);
                                            handleChangeData({
                                                target: {
                                                    name: 'start',
                                                    value: new OverplannerDate(utc, data.start_timezone ?? 'UTC')
                                                }
                                            })
                                        }
                                    }}
                                />
                            </div>

                            {allDay && (
                                <>
                                    <span className="pb-2 text-sm text-muted-foreground">
                                        to
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <Input
                                            {...{
                                                type: 'date',
                                                name: 'end',
                                                value: data.end?.print("yyyy-MM-dd"),
                                                onChange: (e) => {
                                                    const utc = fromZonedTime(`${e.target.value}T00:00:00`, data.start_timezone);
                                                    handleChangeData({
                                                        target: {
                                                            name: 'end',
                                                            value: new OverplannerDate(utc, data.start_timezone ?? 'UTC')
                                                        }
                                                    })
                                                }
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* All day */}
                        <div className="flex w-full items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="all-day"
                                    checked={allDay}
                                    onCheckedChange={(value) =>
                                        setAllDay(value === true)
                                    }
                                />

                                <Label
                                    htmlFor="all-day"
                                    className="font-normal"
                                >
                                    All day
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={e => {
                                        handleChangeData({
                                            target: {
                                                name: 'start',
                                                value: new OverplannerDate('now', data.start_timezone)
                                            }
                                        })
                                    }}
                                    size={'sm'}
                                    variant={'outline'}
                                    disabled={data.start ? data.start?.isSameLocalDate(new OverplannerDate('now', data.start_timezone)) : false}
                                >Today</Button>
                            </div>
                        </div>

                        {/* Time */}
                        {!allDay && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>
                                        <Clock className="size-4" />
                                        Start
                                    </Label>

                                    <Input
                                        {...{
                                            type: 'time',
                                            name: 'start_time',
                                            value: data.start_time?.print("HH:mm") ?? "",
                                            onChange: (e) => {
                                                if (!data.start) return;

                                                const localDateTime = `${data.start.print("yyyy-MM-dd")}T${e.target.value}`;

                                                const utc = fromZonedTime(
                                                    localDateTime,
                                                    data.start_timezone ?? "UTC"
                                                );

                                                handleChangeData({
                                                    target: {
                                                        name: 'start_time',
                                                        value: new OverplannerDate(utc, data.start_timezone ?? 'UTC')
                                                    }
                                                })
                                            }
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        <Clock className="size-4" />
                                        End
                                    </Label>

                                    <Input
                                        {...{
                                            type: 'time',
                                            name: 'end_time',
                                            value: data.end_time?.print("HH:mm") ?? "",
                                            onChange: (e) => {
                                                if (!data.start) return;

                                                const localDateTime = `${data.start.print("yyyy-MM-dd")}T${e.target.value}`;

                                                const utc = fromZonedTime(
                                                    localDateTime,
                                                    data.start_timezone ?? "UTC"
                                                );

                                                handleChangeData({
                                                    target: {
                                                        name: 'end_time',
                                                        value: new OverplannerDate(utc, data.start_timezone ?? 'UTC')
                                                    }
                                                })
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Timezone */}
                        <div className="w-full">
                            <Field>
                                <FieldLabel>Timezone</FieldLabel>

                                <FieldContent className="w-full">
                                    <Select
                                        value={data.start_timezone}
                                        onValueChange={(value) => {
                                            handleChangeData({
                                                target: {
                                                    name: "start_timezone",
                                                    value,
                                                },
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <Globe className="size-4 text-muted-foreground" />

                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {user?.preferred_timezones?.map((timezone) => (
                                                <SelectItem
                                                    key={timezone}
                                                    value={timezone}
                                                >
                                                    {timezone}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FieldContent>
                            </Field>
                        </div>
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

                    <p className="debug">{JSON.stringify(data, null, 2)}</p>

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