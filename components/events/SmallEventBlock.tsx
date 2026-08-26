'use client'

import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import RenderEventIcon from "@/components/RenderEventIcon";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { RenderEventDateTimeHelperText } from "@/components/UserSidebar";
import { cn } from "@/lib/utils";
import { OverplannerEventViewType } from "@/schema";
import { useSortable } from "@dnd-kit/sortable";
import { useContext } from "react";
import { toast } from "sonner";
import { CSS } from "@dnd-kit/utilities";


export default function SmallEventBlock(props: {
    event: OverplannerEventViewType,
}) {

    const { event, ...rest } = props;

    const { viewEvent, deleteEvent } = useContext(OverplannerSessionContext);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: event.id,
    });


    const handleDelete = (eventId: string) => {

        if (!deleteEvent) {
            return;
        }


        fetch(`/api/events/${eventId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(error.message ?? `Request failed (${res.status})`);
                }
                // router.push('/login')
                // addNewEvent(re)
                console.log(res);

                const data = await res.json();

                deleteEvent(eventId)

                toast.success("Event deleted!")
                return;
            })
            .catch(err => {
                console.log({
                    success: false,
                    err
                })
                toast.error("Failed to delete event.")
            })

        return null;
    }

    const style = {
        transform: CSS.Transform.toString(
            transform
        ),
        transition,
    }; 
 

    try {
        return (
            <ContextMenu >
                <ContextMenuTrigger>
                    <Button
                        variant={'ghost'}
                        ref={setNodeRef}
                        style={style}
                        data-no-carousel-drag
                        className={'touch-none cursor-grab flex w-full h-7 items-center px-1 justify-between gap-2'} onClick={e => {
                            viewEvent && viewEvent(event.id);
                        }}
                        {...attributes}
                        {...listeners} 
                    >
                        <div className="flex items-center gap-2">
                            <RenderEventIcon event={event} />
                            <p className="text-xs">{event.name}</p>
                            <span className="text-xs opacity-50">{event.id.slice(0, 5)}...</span>
                        </div>
                        <RenderEventDateTimeHelperText {...event} />
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuGroup>
                        <ContextMenuItem variant="destructive" onClick={e => {
                            handleDelete(event.id);
                        }}>
                            Delete
                            {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                        </ContextMenuItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>
        );
    }
    catch (err) {
        return (
            <p className="debug">{JSON.stringify(event, null, 2)}</p>
        )
    }
}