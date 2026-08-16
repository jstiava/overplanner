'use client'
import { CalendarProblems } from "@/components/CalendarProblems";
import MarketingHeader from "@/components/MarketingHeader";
import { PlanningTransformation } from "@/components/PlanningTransformation";
import SortableSpacerList from "@/components/SortableSpacerList";
import { ThemeProvider } from "@/components/theme-provider";
import { ServerComponentChildren } from "@/lib/helpers";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home(props : ServerComponentChildren) {

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

        {props.children}


      </div>
    </ThemeProvider>
  );
}