'use client'

import CalendarDialDefault from "@/components/dials/CalendarDialDefault";
import { OverplannerSessionContext } from "@/components/OverplannerSessionContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";


export default function UserSidebar() {

    const router = useRouter();

    const UserContext = useContext(OverplannerSessionContext);

    return (
        <div className="flex flex-col p-1 h-full w-full flex-col bg-foreground/3">
            <Button  {...{
                variant: 'ghost',
                className: 'flex justify-start items-center px-3 py-2 gap-3 w-full rounded-sm h-14',
                onClick: (e) => {
                    router.push('/v2/me/settings')
                }
            }}  >
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex items-start flex-col">
                    <p className="text-xs font-bold tracking-tight">{UserContext.user?.name}</p>
                    <p className="text-[0.6rem] opacity-50">Profile</p>
                </div>
            </Button>
            <CalendarDialDefault />
            <div className="flex flex-col min-h-0 flex-1 p-1 gap-1">
                <Button variant={'outline'} className={'flex w-full h-8 items-center px-2 justify-start gap-2'}>
                    <div className="w-5 h-5 bg-muted rounded-full" />
                    <p className="text-xs">2026 Chicago Cubs</p>
                </Button>
                <Button variant={'outline'} className={'flex w-full h-8 items-center px-2 justify-start gap-2'}>
                    <div className="w-5 h-5 bg-muted rounded-full" />
                    <p className="text-xs">2026 Chicago Cubs</p>
                </Button>
                <Button variant={'outline'} className={'flex w-full h-8 items-center px-2 justify-start gap-2'}>
                    <div className="w-5 h-5 bg-muted rounded-full" />
                    <p className="text-xs">2026 Chicago Cubs</p>
                </Button>
                <Button variant={'outline'} className={'flex w-full h-8 items-center px-2 justify-start gap-2'}>
                    <div className="w-5 h-5 bg-muted rounded-full" />
                    <p className="text-xs">2026 Chicago Cubs</p>
                </Button>
            </div>
        </div>
    );
}