'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardClock } from "lucide-react";
import { useState } from "react";

const WEEK_DEFAULT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']


export default function ScheduleEventEditor() {

    const [selectedDay, setSelectedDay] = useState('Su');
    const [scheduleMask, setScheduleMask] = useState('Week');

    return (
        <div className="flex flex-col gap-4 w-full p-4 border bg-muted/50 rounded-sm">
            <div className="flex w-full justify-between">
                <Label>
                    <ClipboardClock className="size-4" />

                    Schedule
                </Label>
                <Select value={scheduleMask}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={'Week'}>Week</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex w-full justify-between items-center">
                    {WEEK_DEFAULT.map(day => (
                        <Button
                            key={day}
                            variant={day == selectedDay ? 'default' : 'outline'}
                            className="flex items-center justify-center size-8 rounded-full"
                            onClick={e => {
                                setSelectedDay(day)
                            }}
                        >
                            <p className="text-xs">{day.slice(0, 1)}</p>
                        </Button>
                    ))}
                </div>
                <div className="flex w-full">
                    <Field>
                        <FieldLabel>Hours Text</FieldLabel>
                        <FieldContent> <Textarea /></FieldContent>
                        <FieldDescription>e.g. "Mon-Wed: 8am-4pm"</FieldDescription>
                    </Field>
                </div>
            </div>
        </div>
    );
}