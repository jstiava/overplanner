"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, GlobeIcon } from "lucide-react";

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
import { Input } from "@/components/ui/input";

type TimezoneSelectProps = {
    value?: string | null;
    onChange: (timezone: string) => void;
};


function getTimezoneLabel(timezone: string) {
    const offset = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset",
    })
        .formatToParts(new Date())
        .find((part) => part.type === "timeZoneName")
        ?.value
        .replace("GMT", "GMT") ?? "GMT";

    return `${timezone} (${offset})`;
}

export function TimezoneSelect({
    value,
    onChange,
}: TimezoneSelectProps) {
    const [open, setOpen] = useState(false);

    const timezones = useMemo(
        () => Intl.supportedValuesOf("timeZone"),
        []
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                {/* <Button
                    variant="link"
                    className="gap-2"
                    size={'xs'}
                >
                    <GlobeIcon className="size-4" />

                    <span className="truncate">
                        {value ?? "Select timezone"}
                    </span>

                    <ChevronsUpDown className="size-3.5 opacity-50" />
                </Button> */}
                <Input
                      id="timezone"
                      type="text"
                      placeholder="Select timezone"
                      value={value ?? ""} 
                    />
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[320px] p-0"
            >
                <Command>
                    <CommandInput placeholder="Search timezone..." />

                    <CommandList>
                        <CommandEmpty>
                            No timezone found.
                        </CommandEmpty>

                        <CommandGroup>
                            {timezones.map((timezone) => (
                                <CommandItem
                                    key={timezone}
                                    value={timezone}
                                    onSelect={() => {
                                        onChange(timezone);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={
                                            value === timezone
                                                ? "mr-2 size-4 opacity-100"
                                                : "mr-2 size-4 opacity-0"
                                        }
                                    />

                                    {getTimezoneLabel(timezone)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}