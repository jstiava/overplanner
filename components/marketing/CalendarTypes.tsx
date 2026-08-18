"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Clock3,
  Sun,
  CalendarClock,
  CalendarRange,
  CheckSquare,
  DoorOpen,
  Link2,
  MousePointer2,
  SlidersHorizontal,
  Grid2X2,
  CircleSmallIcon,
  MapPinIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";



export function EventTypes() {

  const router = useRouter();

  return (
    <section className="flex flex-col w-full px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Event types
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Plan time the way it actually happens.
          </h2>

          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Some things happen at a moment. Some take a day. Some span a week. Some just need to get done. Your calendar should be able to represent all of them.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_TYPES.map((type) => {
            const Icon = type.icon;

            return (
              <a
                key={type.title}
                href={type.path}
                className="group rounded-lg border bg-background p-5 transition-colors hover:bg-muted/30"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {type.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {type.description}
                </p>

                {type.OverrideExampleComponent && (
                  <>{type.OverrideExampleComponent}</>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}


const EVENT_TYPES = [
  {
    icon: CalendarDays,
    title: "Calendar",
    path: '/types/calendar',
    description:
      "A collection of events and todos for personal use or shared with a team.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">
        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-[0.4rem]  h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit items-center">
            <div className="w-4 h-4 rounded-full bg-border" />
            <p className="text-xs">2026 Chicago Cubs</p>
          </div>
        </div>
        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit items-center">
            <div className="w-4 h-4 rounded-full bg-border" />
            <p className="text-xs">Work</p>
          </div>
        </div>
        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit items-center">
            <div className="w-4 h-4 rounded-full bg-border" />
            <p className="text-xs">Personal website project</p>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: Clock3,
    title: "Single time",
    path: '/types/single_time',
    description:
      "A traditional event with a start date and end date and time.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">

        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-[0.4rem] pb-4  h-fit text-sm",
        )}>

          <div className="flex flex-col w-full gap-1 h-fit">
            <p className="text-xs">7AM Standup Meeting</p>
          </div>
        </div>

        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-[0.4rem] pb-6 h-fit text-sm",
        )}>

          <div className="flex flex-col w-full gap-1 h-fit">
            <p className="text-[0.6rem] opacity-50">6 - 8 PM</p>
            <p className="text-xs">Company Happy Hour</p>
          </div>
        </div>

      </div>
    )
  },
  {
    icon: MapPinIcon,
    title: "Location",
    path: '/types/location',
    description:
      "An address, building, room, or suite.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">

        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-2 h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit">
            <MapPinIcon size={14} />
            <div className="flex flex-col gap-1">
              <p className="text-xs">Wrigley Field</p>
              <p className="text-[0.6rem] opacity-50 underline">1015 W. Sheifield Ave, Chicago, IL 60603</p>
            </div>
          </div>
        </div>


        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-2 h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit">
            <DoorOpen size={14} />
            <div className="flex flex-col gap-1">
              <p className="text-xs">Danforth, Room 215</p>
              <p className="text-[0.6rem] opacity-50 underline">Danforth House, South 40</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: CircleSmallIcon,
    title: "Moment",
    path: '/types/moment',
    description:
      "A meaningful point in time you want to remember or mark.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">

        <div className={cn(
          "relative rounded-sm rounded-tl-none border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>
          <div className="absolute -top-[0.25rem]  -left-[0.25rem] w-2 h-2  border border-2   rounded-sm border-[#3d3d3d] z-10  bg-background" />
          <div className="flex w-full gap-2 h-fit items-start">
            <p className="text-[0.6rem] opacity-50">6:23 AM</p>
            <p className="text-xs">Kelly R. requests IT support.</p>
          </div>
        </div>

        <div className={cn(
          "mt-3 relative rounded-sm rounded-tl-none border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>
          <div className="absolute -top-[0.25rem] -left-[0.25rem] w-2 h-2 border border-2  rounded-sm  border-[#3d3d3d] z-10 bg-background" />
          <div className="flex w-full gap-2 h-fit items-start">
            <p className="text-[0.6rem] opacity-50">6:46 AM</p>
            <p className="text-xs w-[calc(100%-3rem)]">Kelly R. request resolved by Carl L.</p>
          </div>
        </div>

      </div>
    )
  },
  {
    icon: Sun,
    title: "All day",
    path: '/types/all_day',
    description:
      "Something that belongs to a particular day rather than a specific time.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">

        <div className={cn(
          "relative rounded-sm border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>
          <div className="flex w-full gap-2 h-fit items-start">
            <p className="text-xs">W DAY</p>
          </div>
        </div>


        <div className={cn(
          "relative rounded-sm border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>
          <div className="flex w-full gap-2 h-fit items-start">
            <p className="text-xs">Chicago Cubs vs. Pittsburgh Pirates</p>
          </div>
        </div>

      </div>
    )
  },
  {
    icon: CalendarClock,
    title: "Multi-day",
    path: '/types/multi_day',
    description:
      "An event that spans multiple days, with a defined beginning and end.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">

        <div className={cn(
          "relative rounded-sm border bg-muted/40 px-2 py-[0.4rem] h-fit text-sm",
        )}>
          <div className="flex flex-col w-full gap-1 h-fit items-start">
            <p className="text-[0.6rem] opacity-50">AUG 12 - 15</p>
            <p className="text-xs">2026 ABC Conference at Hilton</p>
          </div>
        </div>

      </div>
    )
  },
  {
    icon: CheckSquare,
    title: "To-do",
    path: '/types/todo',
    description:
      "Something you want to accomplish without deciding exactly when it needs to happen.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">
        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-1 h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit">
            <Checkbox />
            <p className="text-xs">Send booking request to Adam</p>
          </div>
        </div>
        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-1 h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit">
            <Checkbox defaultChecked={true} />
            <p className="text-xs">Start laundry</p>
          </div>
        </div>
        <div className={cn(
          "rounded-sm border bg-muted/40 px-2 py-1 h-fit text-sm",
        )}>

          <div className="flex w-full gap-2 h-fit">
            <Checkbox />
            <p className="text-xs">Apply for open position</p>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: DoorOpen,
    title: "Booking space",
    path: '/types/booking_space',
    description:
      "A period of time that other people can book based on your availability.",
    OverrideExampleComponent: (
      <div className="mt-5 flex flex-col gap-1">

        <div className={cn(
          "rounded-lg border border-dashed px-2 py-[0.4rem] pb-8 h-fit text-sm",
        )}>

          <div className="flex flex-col w-full gap-1 h-fit opacity-50">
            <p className="text-[0.6rem] ">9 - 10 AM</p>
            <p className="text-xs">Open</p>
          </div>
        </div>

        <div className={cn(
          "rounded-sm border border-dashed px-1 py-1 h-fit text-sm",
        )}>

          <div className={cn(
            "rounded-md border bg-muted/40 px-2 py-[0.4rem] pb-8 h-fit text-sm",
          )}>

            <div className="flex flex-col w-full gap-1 h-fit">
              <p className="text-[0.6rem] ">10 - 10:45 AM</p>
              <p className="text-xs">Interview with Carl L.</p>
            </div>
          </div>
        </div>


      </div>
    )
  },
  {
    icon: CalendarRange,
    title: "All month",
    path: '/types/all_month',
    description:
      "Something that applies across an entire month rather than a single day.",
    example: {
      classNames: "",
      text: "2026 Chicago Cubs",
    }
  },
];