"use client";

import * as React from "react";
import {
    Check,
    ChevronsUpDown,
    GripVertical,
    Plus,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TimezoneListProps = {
    value: string[] | undefined;
    onChange: (value: string[]) => void;
};

const TIMEZONES = Intl.supportedValuesOf("timeZone");

function getTimezoneOffset(timeZone: string) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "longOffset",
    })
        .formatToParts(new Date())
        .find((part) => part.type === "timeZoneName")?.value
        .replace("GMT", "UTC") ?? "";
}

function getTimezoneCity(timeZone: string) {
    const parts = timeZone.split("/");

    if (parts.length < 2) {
        return timeZone;
    }

    return parts
        .slice(1)
        .join(" / ")
        .replaceAll("_", " ");
}

export function TimezoneList({
    value,
    onChange,
}: TimezoneListProps) {

    const [data, setData] = React.useState<string[]>([])
    const [open, setOpen] = React.useState(false);
    const [draggedTimezone, setDraggedTimezone] =
        React.useState<string | null>(null);

    React.useEffect(() => {
        setData(value && Array.isArray(value) ? value : []);
    }, [value]);

    const addTimezone = (timezone: string) => {
        if (data.includes(timezone)) {
            return;
        }

        onChange([...data, timezone]);
        setOpen(false);
    };

    const removeTimezone = (timezone: string) => {
        onChange(
            data.filter((item) => item !== timezone)
        );
    };

    const moveTimezone = (
        fromTimezone: string,
        toTimezone: string
    ) => {
        const fromIndex = data.indexOf(fromTimezone);
        const toIndex = data.indexOf(toTimezone);

        if (fromIndex === -1 || toIndex === -1) {
            return;
        }

        const next = [...data];

        next.splice(fromIndex, 1);
        next.splice(toIndex, 0, fromTimezone);

        onChange(next);
    };

    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-medium">
                        Preferred Timezones
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Choose and order the timezones you want
                        to display.
                    </p>
                </div>

                {/* Add timezone */}
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                >
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="mr-2 size-4" />
                            Add timezone
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="end"
                        className="w-[320px] p-0"
                    >
                        <Command>
                            <CommandInput
                                placeholder="Search timezones..."
                            />

                            <CommandList>
                                <CommandEmpty>
                                    No timezone found.
                                </CommandEmpty>

                                <CommandGroup>
                                    {TIMEZONES.map(
                                        (timezone) => {
                                            const selected =
                                                data.includes(
                                                    timezone
                                                );

                                            return (
                                                <CommandItem
                                                    key={timezone}
                                                    value={timezone}
                                                    disabled={
                                                        selected
                                                    }
                                                    onSelect={() =>
                                                        addTimezone(
                                                            timezone
                                                        )
                                                    }
                                                >
                                                    <div className="flex min-w-0 flex-1 flex-col">
                                                        <span className="truncate">
                                                            {
                                                                timezone
                                                            }
                                                        </span>

                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                getTimezoneOffset(
                                                                    timezone
                                                                )
                                                            }
                                                        </span>
                                                    </div>

                                                    {selected && (
                                                        <Check className="size-4 shrink-0 text-muted-foreground" />
                                                    )}
                                                </CommandItem>
                                            );
                                        }
                                    )}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Selected timezones */}
            <div className="overflow-hidden rounded-lg border">
                {data.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No timezones selected.
                    </div>
                ) : (
                    <div className="divide-y">
                        {data.map(
                            (timezone, index) => {
                                return (
                                    <div
                                        key={timezone}
                                        draggable
                                        onDragStart={() =>
                                            setDraggedTimezone(
                                                timezone
                                            )
                                        }
                                        onDragEnd={() =>
                                            setDraggedTimezone(
                                                null
                                            )
                                        }
                                        onDragOver={(event) => {
                                            event.preventDefault();
                                        }}
                                        onDrop={() => {
                                            if (
                                                !draggedTimezone ||
                                                draggedTimezone ===
                                                timezone
                                            ) {
                                                return;
                                            }

                                            moveTimezone(
                                                draggedTimezone,
                                                timezone
                                            );

                                            setDraggedTimezone(
                                                null
                                            );
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3",
                                            "bg-background",
                                            "transition-opacity",
                                            draggedTimezone ===
                                            timezone &&
                                            "opacity-50"
                                        )}
                                    >
                                        {/* Drag handle */}
                                        <GripVertical
                                            className={cn(
                                                "size-4 shrink-0",
                                                "cursor-grab",
                                                "text-muted-foreground"
                                            )}
                                        />

                                        {/* Order */}
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium">
                                            {index + 1}
                                        </div>

                                        {/* Timezone */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="truncate text-sm font-medium">
                                                    {
                                                        getTimezoneCity(
                                                            timezone
                                                        )
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                                                <span>
                                                    {
                                                        timezone
                                                    }
                                                </span>

                                                <span>
                                                    {getTimezoneOffset(
                                                        timezone
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 shrink-0"
                                            onClick={() =>
                                                removeTimezone(
                                                    timezone
                                                )
                                            }
                                            aria-label={`Remove ${timezone}`}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}