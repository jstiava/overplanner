"use client";

import * as React from "react";

import {
    GripVertical,
    PencilIcon,
    X,
} from "lucide-react";

import { HexColorPicker } from "react-colorful";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";

import type {
    ColorItem,
} from "@/components/ColorListV2";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

type ColorListItemV2Props = {
    color: ColorItem & {
        id: string;
    };

    index: number;

    updateColor: (
        id: string,
        color: ColorItem
    ) => void;

    removeColor: (id: string) => void;
};

export default function ColorListItemV2({
    color,
    updateColor,
    removeColor,
}: ColorListItemV2Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: color.id,
    });

    const [open, setOpen] =
        React.useState(false);

    const [draftColor, setDraftColor] =
        React.useState(color.value);

    const [draftName, setDraftName] =
        React.useState(color.name);

    const style = {
        transform: CSS.Transform.toString(
            transform
        ),
        transition,
    };

    const handleOpenChange = (
        nextOpen: boolean
    ) => {
        if (nextOpen) {
            setDraftColor(color.value);
            setDraftName(color.name);
        }

        setOpen(nextOpen);
    };

    const handleSave = () => {
        updateColor(color.id, {
            name: draftName,
            value: draftColor,
        });

        setOpen(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 px-3 py-3",
                "bg-background",
                isDragging &&
                "relative z-10 opacity-50 shadow-md"
            )}
        >
            {/* Drag handle */}
            <button
                type="button"
                className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
                aria-label={`Reorder ${color.name}`}
            >
                <GripVertical className="size-4" />
            </button>

            {/* Color preview */}
            <div
                className="size-5 shrink-0 rounded-full border-2 border-foreground"
                style={{
                    backgroundColor: color.value,
                }}
            />

            {/* Color information */}
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
                    {color.name}
                </div>

                <div className="text-xs text-muted-foreground">
                    {color.value}
                </div>
            </div>

            {/* Edit */}
            <Popover
                open={open}
                onOpenChange={handleOpenChange}
            >
                <PopoverTrigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label={`Edit ${color.name}`}
                    >
                        <PencilIcon className="size-4" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-3">
                    <div className="space-y-3">
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input 
                                    value={draftName}
                                    onChange={(event) => {
                                        setDraftName(
                                            event.target.value
                                        );
                                    }}
                                    placeholder="Color name"
                                />
                            </FieldContent>
                        </Field>

                        <HexColorPicker
                            color={draftColor}
                            onChange={setDraftColor}
                        />

                        <Field>
                            <FieldLabel>Color Hex</FieldLabel>
                            <FieldContent>
                                <Input 
                                    value={draftColor}
                                    onChange={(event) => {
                                        setDraftColor(
                                            event.target.value
                                        );
                                    }}
                                    placeholder="Color name"
                                />
                            </FieldContent>
                        </Field>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() =>
                                    setOpen(false)
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                type="button"
                                onClick={handleSave}
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Remove */}
            <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                type="button"
                onClick={() =>
                    removeColor(color.id)
                }
                aria-label={`Remove ${color.name}`}
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}