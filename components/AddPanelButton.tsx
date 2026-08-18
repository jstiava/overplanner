import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import * as Drawer from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import {
    Calendar,
    CalendarDays,
    CalendarRange,
    Eye,
    MessageSquare,
    PackageIcon,
    Pencil,
    Plus,
    Table,
} from "lucide-react";
import { OverplannerCalendarContext } from "@/components/OverplannerCalendarContext";
import { useContext, useState } from "react";
import { OverplannerSessionContext, PanelPrebuiltTypes } from "@/components/OverplannerSessionContext";


const PANEL_OPTIONS = [
    {
        type: "create-event",
        title: "Create New Event",
        description: "Create a new calendar event",
        icon: Plus,
    },
    {
        type: "day-view",
        title: "Day View",
        description: "View events for a single day",
        icon: CalendarDays,
    },
    {
        type: "week-view",
        title: "Week View",
        description: "View your week at a glance",
        icon: CalendarRange,
    },
    {
        type: "month-view",
        title: "Month View",
        description: "View your calendar by month",
        icon: Calendar,
    },
    {
        type: "preview",
        title: "Preview",
        description: "Preview an event or calendar item",
        icon: Eye,
    },
    {
        type: "edit",
        title: "Edit",
        description: "Edit an event or calendar item",
        icon: Pencil,
    },
    {
        type: "table",
        title: "Table",
        description: "View calendar data as a table",
        icon: Table,
    },
    {
        type: "conversation",
        title: "Conversation",
        description: "Discuss and collaborate",
        icon: MessageSquare,
    },
    {
        type: "blank",
        title: "Blank",
        description: "Free space",
        icon: PackageIcon,
    },
] as const;


export function AddPanel() {
    const { addPanel, panels } = useContext(OverplannerSessionContext);

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleAddPanel = (type: PanelPrebuiltTypes) => {
        addPanel && addPanel({
            type
        });
        setPopoverOpen(false);
        setDrawerOpen(false);
    };

    const disabled = panels.length >= 4;

    return (
        <>
            <div className="hidden md:block">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={disabled}
                        >
                            <Plus />
                            Add Panel
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="end"
                        className="w-[420px] p-2"
                    >
                        <div className="mb-2 px-2 py-1">
                            <h3 className="font-medium">
                                Add Panel
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Choose what you want to add to your workspace.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-1">
                            <PanelOptions
                                key="desktop_options"
                                onSelect={handleAddPanel}
                            />

                        </div>

                        {disabled && (
                            <p className="px-2 pt-2 text-xs text-muted-foreground">
                                You can have up to 4 panels.
                            </p>
                        )}
                    </PopoverContent>
                </Popover>
            </div>

            {/* Mobile */}
            <div className="block md:hidden">
                <Drawer.Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <Drawer.DrawerTrigger >
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={disabled}
                        >
                            <Plus />
                            Add Panel
                        </Button>
                    </Drawer.DrawerTrigger>

                    <Drawer.DrawerContent>
                        <Drawer.DrawerHeader className="pb-10">
                            <Drawer.DrawerTitle>Add Panel</Drawer.DrawerTitle>
                            <Drawer.DrawerDescription>
                                Choose a panel to add.
                            </Drawer.DrawerDescription>
                        </Drawer.DrawerHeader>

                        <div className="flex flex-col w-full px-4 pb-6">
                            <PanelOptions
                                key="mobile_options"
                                onSelect={handleAddPanel}
                            />
                        </div>
                    </Drawer.DrawerContent>
                </Drawer.Drawer>
            </div>
        </>
    );
}

const PanelOptions = (props: {
    onSelect: any
}) => {


    return (
        <>

            {PANEL_OPTIONS.map((option) => {
                const Icon = option.icon;

                return (
                    <button
                        key={option.type}
                        type="button"
                        onClick={() =>
                            props.onSelect(option.type)
                        }
                        className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-lg
                                    p-3
                                    text-left
                                    transition-colors
                                    hover:bg-muted
                                "
                    >
                        <div className="
                                    flex
                                    size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-md
                                    border
                                    bg-background
                                ">
                            <Icon className="size-4" />
                        </div>

                        <div className="min-w-0">
                            <div className="text-sm font-medium">
                                {option.title}
                            </div>

                            <div className="
                                        mt-0.5
                                        text-xs
                                        text-muted-foreground
                                    ">
                                {option.description}
                            </div>
                        </div>
                    </button>
                );
            })}
        </>
    )
}