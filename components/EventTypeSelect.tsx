'use client'

import {
    CalendarDays,
    CalendarIcon,
    CalendarRange,
    ClipboardClock,
    Clock,
    ListTodo,
    SquareIcon,
} from "lucide-react";

import * as Select from "@/components/ui/select";
import { useState } from "react";

const eventTypes = [
    {
        value: "calendar",
        label: "Calendar",
        description: "A collection of events",
        icon: CalendarDays,
    },
    {
        value: "all_day",
        label: "All-Day",
        description: "Occuring over one or more days.",
        icon: CalendarIcon,
    },
    {
        value: "single_time",
        label: "Single-Time",
        description: "A specific moment in time",
        icon: Clock,
    },
    {
        value: "todo",
        label: "Todo",
        description: "An item to complete",
        icon: SquareIcon,
    },
     {
        value: "schedule",
        label: "Schedule",
        description: "Weekly service schedule",
        icon: ClipboardClock,
    },
] as const;


export default function EventTypeSelect(props: {
    value: string  | null,
    onChange: (newEvent: string | null) => any
}) {

    const selectedEventType = eventTypes.find(
        (x) => x.value === props.value
    );

    return (
        <Select.Select

            value={props.value ?? 'none'}
            onValueChange={(value) => {
                props.onChange(value)
            }}
        >
            <Select.SelectTrigger
                size={"default"}
                className="w-full h-12! px-4"
            >
                <div className="flex items-center gap-3">
                    {selectedEventType ? (
                        <EventTypeSelectItem
                            key={selectedEventType.value}
                            {...selectedEventType}
                        />
                    ) : (
                        <EventTypeSelectItem
                            key="none"
                            {...{
                                value: "none",
                                label: "none",
                                description: "Select an event type...",
                                icon: CalendarIcon,
                            }}
                        />
                    )}
                </div>
            </Select.SelectTrigger>

            <Select.SelectContent>
                {eventTypes.map((type) => (
                    <Select.SelectItem
                        key={type.value}
                        value={type.value}
                    >
                        <EventTypeSelectItem {...type} />
                    </Select.SelectItem>
                ))}
            </Select.SelectContent>
        </Select.Select>
    );
}

const EventTypeSelectItem = (props: {
    label: string;
    description: string;
    icon: React.ElementType;
}) => {
    const Icon = props.icon;

    return (
        <div className="flex items-center gap-3">
            <Icon className="size-5 shrink-0" />

            <div className="flex flex-col text-left">
                <span className="font-medium">
                    {props.label}
                </span>

                <span className="text-xs text-muted-foreground">
                    {props.description}
                </span>
            </div>
        </div>
    );
};