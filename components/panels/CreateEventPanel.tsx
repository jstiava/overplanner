"use client";

import { useContext, useState } from "react";
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

export type OverplannerCreateEventType = Partial<Omit<OverplannerEventType, "start" | "end" | "start_time" | "end_time"> & {
    start_time: OverplannerDate | null,
    end_time: OverplannerDate | null,
    start: OverplannerDate | null,
    end: OverplannerDate | null,
}>

export default function CreateEventPanel(props: Panel) {

    const { now, user } = useContext(OverplannerSessionContext)

    const [data, setData] = useState<OverplannerCreateEventType>({
        start: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
        end: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
        start_time: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
        end_time: new OverplannerDate(new Date(), user?.home_timezone ?? 'utc')._zeroOutSeconds(),
        start_timezone: user?.home_timezone ?? ""
    });

    const [metadata, setMetadata] = useState<any>({});
    const handleChangeData = (e: any) => {

        setData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const [allDay, setAllDay] = useState(false);

    return (
        <form className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <h2 className="font-semibold">Create Event</h2>
                    <p className="text-xs text-muted-foreground">
                        Add something to your calendar
                    </p>
                </div>

                <Button type="submit" size="sm">
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

                    <div className="flex flex-col gap-4 w-full p-4 border border-white border-dashed rounded-sm">
                        <Label>
                            <CalendarDays className="size-4" />
                            Date
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
                                                value: data.end?.zoned_time,
                                                onChange: handleChangeData
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
                                        type="time"
                                        name="start"
                                        value={data.start?.zoned_time.toString()}
                                        onChange={(e => {
                                            handleChangeData({
                                                target: {
                                                    name: 'start',
                                                    value: new Date(e.target.value)
                                                }
                                            })
                                        })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        <Clock className="size-4" />
                                        End
                                    </Label>

                                    <Input
                                        type="time"
                                        name="end"
                                        value={data.end?.zoned_time.toString()}
                                        onChange={(e => {
                                            handleChangeData({
                                                target: {
                                                    name: 'end',
                                                    value: new Date(e.target.value)
                                                }
                                            })
                                        })}
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
                    <div className="space-y-2">
                        <Label>Calendar</Label>

                        <Select defaultValue="personal">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="personal">
                                    Personal
                                </SelectItem>

                                <SelectItem value="work">
                                    Work
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            <AlignLeft className="size-4" />
                            Description
                        </Label>

                        <Textarea
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
                >
                    Create Event
                </Button>
            </div>
        </form>
    );
}