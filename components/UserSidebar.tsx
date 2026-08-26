'use client'

import CalendarDialDefault from "@/components/dials/CalendarDialDefault";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import RenderEventIcon from "@/components/RenderEventIcon";
import { Button } from "@/components/ui/button";
import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";
import { OverplannerEventViewType } from "@/schema";
import SmallEventBlock from "@/components/events/SmallEventBlock";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function UserSidebar() {

    const router = useRouter();
    const { user, events, setFocusedDate } = useContext(OverplannerSessionContext);

    if (!events) {
        return null;
    }

    try {

        return (
            <div className="flex flex-col p-1 h-full w-full flex-col bg-foreground/3">
                <div className="flex flex-col gap-0 h-fit w-full">
                    <Button  {...{
                    variant: 'ghost',
                    className: 'flex justify-start items-center px-3 py-2 gap-3 w-full rounded-sm h-14',
                    onClick: (e) => {
                        router.push('/v2/me/settings')
                    }
                }}  >
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="flex items-start flex-col">
                        <p className="text-xs font-bold tracking-tight">{user?.name}</p>
                        <p className="text-[0.6rem] opacity-50">Profile</p>
                    </div>
                </Button>
                <CalendarDialDefault
                    {...{
                        onSelect: (date) => {
                            setFocusedDate && setFocusedDate(date)
                        }
                    }}
                />
                </div>
                <ScrollArea className="min-h-0 flex-1 w-full p-1 ">

                    <div className="flex flex-col gap-1 pb-32">


                        {!events || events.length === 0 && (
                            <p>No events.</p>
                        )}

                        {events?.map((e, index) => {
                            try {
                                return (
                                    <SmallEventBlock
                                        key={`${e.id}_${index}`}
                                        event={e}
                                    />
                                )
                            }
                            catch (err) {
                                return null;;
                            }
                        })}
                    </div>
                </ScrollArea>
            </div>
        );
    }
    catch (err) {
        return (
            <div className="flex w-full h-full p-2">
                <div className="flex w-full h-full border border-red-500 rounded-sm border-dashed">
                    <p className="debug">{JSON.stringify(err, null, 2)}</p>
                </div>
            </div>
        )
    }
}


export const RenderEventDateTimeHelperText = (event: OverplannerEventViewType) => {

    if (event.type === 'single_time') {
        const startDate = new OverplannerDate(new Date(event.start), event.start_timezone);
        return (
            <span className="text-xs opacity-50">{startDate.print("MMM dd, h:mma")}</span>
        )
    }

    if (event.type === 'all_day') {
        const startDate = new OverplannerDate(new Date(event.start), event.start_timezone);
        return (
            <span className="text-xs opacity-50">{startDate.print("MMM dd")}</span>
        )
    }


    return (
        <></>
    )
}