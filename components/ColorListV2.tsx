"use client";

import * as React from "react";

import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import ColorListItemV2 from "@/components/ColorListV2Item";

export type ColorItem = {
    name: string;
    value: string;
};

type InternalColorItem = ColorItem & {
    id: string;
};

type ColorListProps = {
    value?: ColorItem[];
    onChange: (value: ColorItem[]) => void;
};

export function ColorListV2({
    value,
    onChange,
}: ColorListProps) {

    const [data, setData] = React.useState<InternalColorItem[]>(
        []
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    React.useEffect(() => {
        setData((current) => {
            return (value ?? []).map((color, index) => ({
                ...color,

                // Preserve existing IDs where possible.
                id:
                    current[index]?.id ??
                    crypto.randomUUID(),
            }));
        });
    }, [value]);

    const updateColors = (
        next: InternalColorItem[]
    ) => {
        setData(next);

        onChange(
            next.map(({ id, ...color }) => color)
        );
    };

    const updateColor = (
        id: string,
        color: ColorItem
    ) => {
        updateColors(
            data.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        ...color,
                    }
                    : item
            )
        );
    };

    const removeColor = (id: string) => {
        updateColors(
            data.filter((item) => item.id !== id)
        );
    };

    const addColor = () => {
        updateColors([
            ...data,
            {
                id: crypto.randomUUID(),
                name: "New color",
                value: "#000000",
            },
        ]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = data.findIndex(
            (item) => item.id === active.id
        );

        const newIndex = data.findIndex(
            (item) => item.id === over.id
        );

        if (
            oldIndex === -1 ||
            newIndex === -1
        ) {
            return;
        }

        updateColors(
            arrayMove(data, oldIndex, newIndex)
        );
    };

    return (
        <div className="w-full space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-medium">
                        Select color palette
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Design your color palette
                    </p>
                </div>

                <div className="flex gap-2 items-center">
                    <Button
                        variant="link"
                        size="sm"
                        type="button"
                        onClick={(e) => {
                            setData([])
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={addColor}
                    >
                        <Plus className="mr-2 size-4" />
                        Add color
                    </Button>
                </div>
            </div>

            {/* Selected colors */}
            <div className="overflow-hidden rounded-lg border">
                {data.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No colors selected.
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={data.map(
                                (item) => item.id
                            )}
                            strategy={
                                verticalListSortingStrategy
                            }
                        >
                            <div className="divide-y">
                                {data.map(
                                    (color, index) => (
                                        <ColorListItemV2
                                            key={color.id}
                                            color={color}
                                            index={index}
                                            updateColor={
                                                updateColor
                                            }
                                            removeColor={
                                                removeColor
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
                <Button
                    variant={'link'}
                    size={'xs'}
                    onClick={e => {
                        onChange(COLORS_GOOGLE_CALENDAR_CLASSIC.map(c => ({
                            ...c,
                            id: crypto.randomUUID(),
                        })))
                    }}
                >Use Google Calendar Classic Palette</Button>
                 <Button
                    variant={'link'}
                    size={'xs'}
                    onClick={e => {
                        onChange(COLORS_APPLE_CALENDAR_CLASSIC.map(c => ({
                            ...c,
                            id: crypto.randomUUID(),
                        })))
                    }}
                >Use Apple Calendar Classic Palette</Button>
                 <Button
                    variant={'link'}
                    size={'xs'}
                    onClick={e => {
                        onChange(COLORS_OUTLOOK_COLORS.map(c => ({
                            ...c,
                            id: crypto.randomUUID(),
                        })))
                    }}
                >Use Outlook Calendar Classic Palette</Button>
            </div>
        </div>
    );
}


export const COLORS_GOOGLE_CALENDAR_CLASSIC = [
    { "name": "Tomato", "value": "#D50000" },
    { "name": "Tangerine", "value": "#F4511E" },
    { "name": "Flamingo", "value": "#E67C73" },
    { "name": "Banana", "value": "#F6BF26" },
    { "name": "Sage", "value": "#33B679" },
    { "name": "Basil", "value": "#0B8043" },
    { "name": "Peacock", "value": "#039BE5" },
    { "name": "Blueberry", "value": "#3F51B5" },
    { "name": "Lavender", "value": "#7986CB" },
    { "name": "Grape", "value": "#8E24AA" },
    { "name": "Cocoa", "value": "#616161" },
    { "name": "Graphite", "value": "#616161" },
]

export const COLORS_APPLE_CALENDAR_CLASSIC = [
  { "name": "Red", "value": "#FF3B30" },
  { "name": "Orange", "value": "#FF9500" },
  { "name": "Yellow", "value": "#FFCC00" },
  { "name": "Green", "value": "#34C759" },
  { "name": "Blue", "value": "#007AFF" },
  { "name": "Purple", "value": "#AF52DE" }
]

export const COLORS_OUTLOOK_COLORS = [
    { "name": "Dark Red", "value": "#A80000" },
    { "name": "Red", "value": "#E81123" },
    { "name": "Orange", "value": "#D83B01" },
    { "name": "Yellow", "value": "#FFB900" },
  { "name": "Blue", "value": "#0078D4" },
  { "name": "Dark Blue", "value": "#002050" },
  { "name": "Teal", "value": "#008272" },
  { "name": "Green", "value": "#107C41" },
  { "name": "Dark Green", "value": "#004B1C" },
  { "name": "Purple", "value": "#5C2E91" },
  { "name": "Dark Purple", "value": "#37006B" },
  { "name": "Gray", "value": "#68768A" },
]
