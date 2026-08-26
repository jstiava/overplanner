"use client";

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

import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

import { useState } from "react";

type ColorItem = {
    name: string;
    value: string;
};

type ColorSelectorProps = {
    colors: ColorItem[];
    value?: ColorItem;
    onChange: (value: ColorItem) => void;
};

export function ColorSelector({
    colors,
    value,
    onChange,
}: ColorSelectorProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (color: ColorItem) => {
        onChange(color);
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        {value ? (
                            <>
                                <div
                                    className="size-3 shrink-0 rounded-full border"
                                    style={{
                                        backgroundColor:
                                            value.value,
                                    }}
                                />

                                <span className="truncate">
                                    {value.name}
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">
                                Select a color...
                            </span>
                        )}
                    </div>

                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
            >
                <Command>
                    <CommandInput
                        placeholder="Search colors..."
                    />

                    <CommandList>
                        <CommandEmpty>
                            No colors found.
                        </CommandEmpty>

                        <CommandGroup>
                            {colors.map((color) => (
                                <CommandItem
                                    key={color.value}
                                    value={`${color.name} ${color.value}`}
                                    onSelect={() =>
                                        handleSelect(color)
                                    }
                                >
                                    <div
                                        className="size-3 shrink-0 rounded-full border"
                                        style={{
                                            backgroundColor:
                                                color.value,
                                        }}
                                    />

                                    <span className="flex-1">
                                        {color.name} <span className="opacity-50">({color.value})</span>
                                    </span>
 
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}