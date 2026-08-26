"use client";

import {
    CalendarDays,
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

export default function CalendarEventEditor({ data, metadata, handleChangeData, handleChangeMetadata, handleMultiChangeData, handleMultiChangeMetadata }: {
    data: OverplannerCreateEventType,
    metadata: any,
    handleChangeData: any,
    handleChangeMetadata: any,
    handleMultiChangeData: (newValues: Partial<OverplannerCreateEventType>) => any,
    handleMultiChangeMetadata: (newValues: Partial<OverplannerCreateEventType>) => any
}) {

    const { now, user, addNewEvent } = useContext(OverplannerSessionContext)

    return (
        <div className="flex flex-col gap-4 w-full p-4 border bg-muted/50 rounded-sm">
            <Label>
                <CalendarDays className="size-4" />
                Date & Time
            </Label>

            {/* Date */}
            <div className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                    <div className="flex w-full flex-col gap-2">
                        <Input
                            {...{
                                type: 'date',
                                name: 'start',
                                value: metadata.start ?? "",
                                onChange: (e) => {
                                    try {

                                        
                                    console.log({
                                        message: "Calendar, Start date change",
                                        value: e.target.value
                                    })

                                        const timezone =
                                            data.start_timezone ??
                                            user?.home_timezone ??
                                            "UTC";

                                        const utc = fromZonedTime(
                                            `${e.target.value}T00:00:00`,
                                            timezone
                                        );

                                        const newUtcObject = new OverplannerDate(
                                            utc,
                                            timezone
                                        );

                                        handleChangeData({
                                            target: {
                                                name: "start",
                                                value: newUtcObject,
                                            },
                                        });

                                        handleChangeMetadata({
                                            target: {
                                                name: "start",
                                                value: e.target.value
                                            }
                                        })

                                    } catch (err) {
                                        console.error("Failed to update start date:", err);
                                    }
                                }
                            }

                            }
                        />

                    </div>
                </div>

                <>
                    <span className="pb-2 text-sm text-muted-foreground">
                        to
                    </span>

                    <div className="min-w-0 flex-1">
                        <Input
                            {...{
                                type: 'date',
                                name: 'end',
                                value: metadata.end ?? "",
                                onChange: (e) => {

                                    console.log({
                                        message: "End date change",
                                        value: e.target.value
                                    })


                                    const utc = fromZonedTime(`${e.target.value}T00:00:00`, data.start_timezone);
                                    handleChangeData({
                                        target: {
                                            name: 'end',
                                            value: new OverplannerDate(utc, data.start_timezone ?? 'UTC')
                                        }
                                    })
                                    handleChangeMetadata({
                                        target: {
                                            name: 'end',
                                            value: e.target.value
                                        }
                                    })
                                }
                            }}
                        />
                    </div>
                </>
            </div>

            <div className="flex gap-2 w-full items-start">
                <Button
                    onClick={e => {
                        const today = new OverplannerDate('now', data.start_timezone)
                        handleChangeData({
                            target: {
                                name: 'start',
                                value: today
                            }
                        })
                        handleMultiChangeMetadata({
                            start: today.print("yyyy-MM-dd"),
                            end: today.print("yyyy-MM-dd")
                        })
                    }}
                    size={'sm'}
                    variant={'outline'}
                    disabled={data.start ? data.start?.isSameLocalDate(new OverplannerDate('now', data.start_timezone)) : false}
                >Today</Button>
                <Button  variant={'link'} onClick={e => {
                    handleMultiChangeData({
                        start: null,
                        end: null
                    })
                    handleMultiChangeMetadata({
                        start: null,
                        end: null
                    })
                }}>Remove date range</Button>
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