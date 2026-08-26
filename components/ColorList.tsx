"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorListProps = {
    value?: string[] | null;
    onChange?: (colors: string[]) => void;
};

export function ColorList({
    value = ["#3B82F6", "#10B981", "#F59E0B"],
    onChange,
}: ColorListProps) {
    const [colors, setColors] = useState(value ?? []);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const updateColors = (next: string[]) => {
        setColors(next);
        onChange?.(next);
    };

    const updateColor = (index: number, color: string) => {
        const next = [...colors];
        next[index] = color;
        updateColors(next);
    };

    const addColor = () => {
        updateColors([...colors, "#000000"]);
    };

    const removeColor = (index: number) => {
        updateColors(colors.filter((_, i) => i !== index));
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            return;
        }

        const next = [...colors];
        const [moved] = next.splice(draggedIndex, 1);
        next.splice(targetIndex, 0, moved);

        updateColors(next);
        setDraggedIndex(null);
    };

    return (
        <div className="flex flex-col w-full">

            <div className="flex flex-col">
                <div>
                    <h3 className="text-sm font-medium">
                        Select color palette
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Design your color palette
                    </p>
                </div>
            </div>
            {colors.map((color, index) => (
                <div
                    key={`${index}-${color}`}
                    draggable
                    onDragStart={() => setDraggedIndex(index)}
                    onDragEnd={() => setDraggedIndex(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className={cn(
                        "flex items-center gap-3 px-3 py-3",
                        "bg-background",
                        "transition-opacity",
                        draggedIndex ===
                        index &&
                        "opacity-50"
                    )}
                >
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

                    <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-md border-0 bg-transparent p-0"
                        aria-label={`Color ${index + 1}`}
                    />

                    <input
                        type="text"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none"
                        spellCheck={false}
                    />

                    <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                        aria-label={`Remove color ${index + 1}`}
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addColor}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
                <Plus className="size-4" />
                Add color
            </button>
        </div>
    );
}