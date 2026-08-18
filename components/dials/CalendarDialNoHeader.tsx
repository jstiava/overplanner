'use client'

import OverplannerDate from "@/lib/DateTime/OverplannerDate";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarDialNoHeader() {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const now = new OverplannerDate('now', 'America/Chicago');

    const [frameDate, setFrameDate] = useState(now);
    const [thisMonthsDates, setThisMonthsDates] = useState(OverplannerDate.getAllDatesInTheMonthOfTargetWithOverflow(now));



    return (
        <>
            <div className="relative flex flex-col w-full h-fit">

                <div className="flex flex-col z-2 p-0 py-0 pb-2 gap-4">
                    
                    <div className="flex flex-wrap w-full h-fit gap-x-[1px]">
                        {thisMonthsDates.map(date => {

                            const isToday = date.isSameLocalDate(now);

                            const isNotSameMonth = !date.isSameLocalMonth(thisMonthsDates[6])


                            const eventsForDate = []

                            if (isToday) {
                                return (
                                    <div
                                        key={date.print("yyyy-MM-dd")}
                                        className={
                                            cn(
                                                "flex aspect-[1] w-[calc(calc(100%/7)-2px)]! h-fit p-[0.5px] mb-1 ",
                                                isNotSameMonth && 'opacity-50'
                                            )
                                        }
                                    >
                                        <div className={`flex w-full h-full rounded-xs border  border border-transparent `}>
                                            <Button className="relative w-full h-full font-bold tracking-tight bg-foreground border border-border p-0" >
                                                <p  className="text-[0.65rem]">{date.print("d")}</p>
                                                <div className="absolute w-5 h-5 border border-background rounded-full " />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div
                                    key={date.print("yyyy-MM-dd")}
                                    className={
                                        cn(
                                            "flex aspect-[1] w-[calc(calc(100%/7)-2px)]! h-fit p-[0.5px] mb-1 ",
                                            isNotSameMonth && 'opacity-50'
                                        )
                                    }
                                >
                                    <div className={`flex w-full h-full rounded-xs border  border border-transparent `}>
                                        <Button variant={'ghost'} className="relative w-full h-full font-bold tracking-tight bg-background/30 border border-border p-0" >
                                            <p className="text-[0.65rem]">{date.print("d")}</p>
                                            <div className="absolute w-5 h-5 border border-foreground rounded-full " />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>


            </div >
        </>
    )
}