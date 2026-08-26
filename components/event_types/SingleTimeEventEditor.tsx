"use client";

import {
    CalendarDays,
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { fromZonedTime } from "date-fns-tz";
import { OverplannerCreateEventType } from "@/components/panels/CreateEventPanel";
import { useContext, useState } from "react";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CalendarDialDefault from "@/components/dials/CalendarDialDefault";

export default function SingleTimeEventEditor({ data, metadata, handleChangeData, handleChangeMetadata, handleMultiChangeData, handleMultiChangeMetadata }: {
    data: OverplannerCreateEventType,
    metadata: any,
    handleChangeData: any,
    handleChangeMetadata: any,
    handleMultiChangeData: any,
    handleMultiChangeMetadata: any
}) {

    const [allDay, setAllDay] = useState(false);

    const { now, user, addNewEvent } = useContext(OverplannerSessionContext);

    const changeStartDate = (date: OverplannerDate | null | undefined) => {
        if (!date) {
            console.log({
                message: "changeStartDate",
                date
            })
            return;
        }
        try {
            const result = {
                start: date.toMidnight(),
                end: date.toMidnight(),
            };

            handleMultiChangeData(result);
            handleMultiChangeMetadata({
                start: result.start.print("yyyy-MM-dd"),
                end: result.end.print("yyyy-MM-dd"),
            })
        } catch (err) {
            console.log(err)
            return;
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full p-4 border bg-muted/50 rounded-sm">
            <Label>
                <CalendarDays className="size-4" />
                Date & Time
            </Label>

            <div className="flex w-full gap-4">

                {/* Date */}
                <div className="flex-1 min-w-0 items-end gap-1">
                    <Field
                        {...{
                            // "data-invalid": data.end && data.start?.isAfter(data.end),
                            className: "min-w-0 flex-1",
                        }}
                    >
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "relative w-full justify-between text-left font-normal",
                                        !data.end && "text-muted-foreground"
                                    )}
                                // aria-invalid={data.end && data.start?.isAfter(data.end)}
                                >
                                    <div className="flex w-fit items-center gap-1">
                                        <CalendarIcon className="mr-1 size-4" />

                                        {data.start
                                            ? data.start.print("EEEE, MMM d, yyyy")
                                            : "Select date"}
                                    </div>

                                    <div className="absolute right-1    flex gap-0">
                                        <Button {...{
                                            size: 'xs',
                                            className: 'aspect-square',
                                            variant: 'ghost',
                                            onClick: e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                changeStartDate(data.start?.add(-1, 'days'))
                                            }
                                        }} ><ChevronLeft /></Button>
                                        <Button {...{
                                            size: 'xs',
                                            className: 'aspect-square',
                                            variant: 'ghost',
                                            onClick: e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                changeStartDate(data.start?.add(1, 'days'))
                                            }
                                        }} ><ChevronRight /></Button>
                                    </div>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="flex w-screen max-w-[300px]">
                                    <CalendarDialDefault
                                        {...{
                                            selected: data.start,
                                            onSelect: changeStartDate
                                        }}
                                    />

                                </div>
                            </PopoverContent>
                        </Popover>
                    </Field>

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
                <div className="flex w-fit items-center gap-2">
                    {/* <div className="flex items-center gap-2">
                        <Checkbox
                            id="all-day"
                            checked={allDay}
                            onCheckedChange={(value) =>
                                if (value) {
                                    
                                }
                            }
                        />

                        <Label
                            htmlFor="all-day"
                            className="font-normal"
                        >
                            All day
                        </Label>
                    </div> */}
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
                                name: 'start',
                                value: metadata.start_time,
                                onChange: (e) => {
                                    if (!data.start) return;

                                    const timezone = data.start_timezone ?? data.end_timezone ?? "UTC"

                                    const localDateTime = `${data.start.print("yyyy-MM-dd")}T${e.target.value}`;

                                    const utc = fromZonedTime(
                                        localDateTime,
                                        timezone
                                    );

                                    handleChangeData({
                                        target: {
                                            name: 'start',
                                            value: new OverplannerDate(utc, timezone)
                                        }
                                    })

                                    handleChangeMetadata({
                                        target: {
                                            name: 'start_time',
                                            value: e.target.value
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
                                name: 'end',
                                value: metadata.end_time,
                                onChange: (e) => {

                                    if (!data.end) return;

                                    const timezone = data.start_timezone ?? data.end_timezone ?? "UTC"

                                    const localDateTime = `${data.end.print("yyyy-MM-dd")}T${e.target.value}`;


                                    const utc = fromZonedTime(
                                        localDateTime,
                                        timezone
                                    );

                                    console.log({
                                        value: e.target.value,
                                        localDateTime,
                                        utc
                                    })

                                    handleChangeData({
                                        target: {
                                            name: 'end',
                                            value: new OverplannerDate(utc, timezone)
                                        }
                                    })

                                    handleChangeMetadata({
                                        target: {
                                            name: 'end_time',
                                            value: e.target.value
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
    );
}