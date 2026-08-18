'use client'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

const PRESET_COLORS = [
    { "name": "Crimson", "hex": "#E11D48" },
    { "name": "Rose Red", "hex": "#F43F5E" },
    { "name": "Coral Pink", "hex": "#FB7185" },

    { "name": "Vibrant Orange", "hex": "#F97316" },
    { "name": "Amber", "hex": "#F59E0B" },

    { "name": "Golden Yellow", "hex": "#FACC15" },

    { "name": "Lime Green", "hex": "#84CC16" },
    { "name": "Emerald", "hex": "#10B981" },
    { "name": "Mint", "hex": "#34D399" },
    { "name": "Teal", "hex": "#14B8A6" },

    { "name": "Bright Cyan", "hex": "#06B6D4" },
    { "name": "Sky Cyan", "hex": "#22D3EE" },
    { "name": "Light Sky", "hex": "#38BDF8" },

    { "name": "Electric Blue", "hex": "#3B82F6" },
    { "name": "Indigo", "hex": "#6366F1" },

    { "name": "Violet", "hex": "#8B5CF6" },
    { "name": "Purple Punch", "hex": "#A855F7" },
    { "name": "Deep Orchid", "hex": "#C026D3" },
    { "name": "Magenta", "hex": "#D946EF" },
    { "name": "Hot Pink", "hex": "#EC4899" },
]

type OverplannerColorSwatch = { name: string, hex: string }

export default function ColorPicker({value, initialColor = null, onSelect}: {value: OverplannerColorSwatch | null, initialColor?: OverplannerColorSwatch | null, onSelect : (newColorSwatch: OverplannerColorSwatch) => any}) {

    const [selected, setSelected] = useState<OverplannerColorSwatch | null>(value ?? initialColor);

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger >
                <Button variant="outline">
                    {selected ? (
                        <>
                            <div className="w-4 h-4 rounded-full" style={{
                                backgroundColor: selected.hex
                            }} />
                            {selected.name}
                        </>
                    ) : (
                        <p>Select color...</p>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  className="max-h-[30vh] " onWheel={(e) => e.stopPropagation()}>
                {PRESET_COLORS.map(color => (
                    <DropdownMenuItem
                        onSelect={(e) => {
                            setSelected(color);
                            onSelect(color);
                        }}
                        key={color.hex}
                    >
                        <div className="w-4 h-4 rounded-full" style={{
                            backgroundColor: color.hex
                        }} />{color.name}</DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}