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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import CalendarDialDefault from "@/components/dials/CalendarDialDefault";

export default function AllDayEventEditor({ data, metadata, handleChangeData, handleMultiChangeMetadata, handleMultiChangeData, handleChangeMetadata }: {
    data: OverplannerCreateEventType,
    metadata: any,
    handleChangeData: any,
    handleMultiChangeData: any
    handleChangeMetadata: any,
    handleMultiChangeMetadata: any
}) {

    const [allDay, setAllDay] = useState(true);

    const { now, user, addNewEvent } = useContext(OverplannerSessionContext)


    const changeStartDate = (date: OverplannerDate | null | undefined) => {
        if (!date) {
            console.log({
                message: "changeStartDate",
                date
            })
            return;
        }
        try {


            const durationOfDays = data.end && data.start ? data.end.getLocalDaysDiff(data.start) : 0;

            const newEnd = date.toMidnight().add(durationOfDays, 'days');
            const result = {
                start: date.toMidnight(),
                end: newEnd.toMidnight()
            };

            handleMultiChangeData(result);
            handleMultiChangeMetadata({
                start: result.start.print("yyyy-MM-dd"),
                end: newEnd.print("yyyy-MM-dd"),
            })
        } catch (err) {
            console.log(err)
            return;
        }
    }

    const changeEndDate = (date: OverplannerDate | null | undefined) => {
        if (!date) {
            return;
        }
        try {
            const result = {
                end: date.toMidnight(),
            };
            handleMultiChangeData(result);
            handleMultiChangeMetadata({
                end: result.end.print("yyyy-MM-dd"),
            })
        } catch {
            return;
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full p-4 border bg-muted/50 rounded-sm">
            <Label>
                <CalendarDays className="size-4" />
                Date & Time
            </Label>

            {/* Date */}
            <div className="flex flex-col w-full gap-2">
                <div className="flex w-full items-center gap-4">
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

                    <span className=" text-sm text-muted-foreground w-fit">
                        to
                    </span>
                </div>

                <div className="flex w-full items-center gap-4">
                    <Field
                        {...{
                            "data-invalid": data.end && (data.start?.isAfter(data.end) && !data.start?.isSameLocalDate(data.end)),
                            className: "min-w-0 flex-1",
                        }}
                    >
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "relative w-full justify-start text-left font-normal",
                                        !data.end && "text-muted-foreground"
                                    )}
                                // aria-invalid={data.end && data.start?.isAfter(data.end)}
                                >
                                    <CalendarIcon className="mr-1 size-4" />

                                    {data.end
                                        ? data.end.print("EEEE, MMM d, yyyy")
                                        : "Select date"}

                                    <div className="absolute right-1    flex gap-0">
                                        <Button {...{
                                            size: 'xs',
                                            className: 'aspect-square',
                                            variant: 'ghost',
                                            onClick: e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                changeEndDate(data.end?.add(-1, 'days'))
                                            }
                                        }} ><ChevronLeft /></Button>
                                        <Button {...{
                                            size: 'xs',
                                            className: 'aspect-square',
                                            variant: 'ghost',
                                            onClick: e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                changeEndDate(data.end?.add(1, 'days'))
                                            }
                                        }} ><ChevronRight /></Button>
                                    </div>
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="flex w-screen max-w-[300px]">
                                    <CalendarDialDefault
                                        {...{
                                            selected: data.end,
                                            onSelect: changeEndDate
                                        }}
                                    />

                                </div>
                            </PopoverContent>
                        </Popover>
                    </Field>
                     <span className=" text-sm text-muted-foreground w-fit opacity-0">
                        to
                    </span>
                </div>
            </div>

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