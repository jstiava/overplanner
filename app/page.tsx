'use client'
import { CalendarProblems } from "@/components/CalendarProblems";
import MarketingHeader from "@/components/MarketingHeader";
import { PlanningTransformation } from "@/components/PlanningTransformation";
import SortableSpacerList from "@/components/SortableSpacerList";
import { ThemeProvider } from "@/components/theme-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();


  const DAY_INDEX = 0

  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={'dark'}
    >


      <div className="flex flex-col w-full items-center dark bg-background text-foreground min-h-screen">

        {/* Header menu */}
        <MarketingHeader />

        {/* Hero */}
        <div className="flex flex-col gap-6 justify-start w-full h-fit  rounded-sm pt-10 px-10">
          <span className="text-6xl w-full text-center tracking-tight font-bold">Track. Anticipate. Grow.</span>
          <p className="w-full text-center tracking-tight opacity-50">The last calendar you'll ever use.</p>
          {/* Mockup */}
          <div className="flex w-full px-1 justify-center h-fit">
            <div className="flex bg-contain bg-no-repeat w-full bg-center max-w-[800px] aspect-[4/3]" style={{
              backgroundImage: `url("Screenshot 2026-03-31 090610-front.png")`
            }} />
          </div>
        </div>

        {/* <SortableSpacerList /> */}

        <CalendarProblems />

        <PlanningTransformation />


      </div>
    </ThemeProvider>
  );
}


function filterByDay<T>(data: T[], dayIndex: number): T[] {
  const start = dayIndex * 24;
  const end = start + 24;
  return data.slice(start, end);
}

function getDayFromObject(
  data: Record<string, number>,
  dayIndex: number
) {
  const start = dayIndex * 24;
  const end = start + 23;

  return Object.entries(data)
    .filter(([k]) => {
      const i = Number(k);
      return i >= start && i <= end;
    })
    .map(([k, v]) => ({ x: Number(k), y: v }));
}