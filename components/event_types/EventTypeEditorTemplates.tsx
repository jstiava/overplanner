'use client'


import AllDayEventEditor from "@/components/event_types/AllDayEventEditor";
import CalendarEventEditor from "@/components/event_types/CalendarEventEditor";
import ScheduleEventEditor from "@/components/event_types/ScheduleEventEditor";
import SingleTimeEventEditor from "@/components/event_types/SingleTimeEventEditor";
import { Calendar, AlarmClockCheck, RefreshCw, SquareCheck, ClipboardClock, MapPin, Calendar1, CalendarDays, CirclePlay, ListTodoIcon } from "lucide-react";


export const EVENT_TYPE_EDITOR_TEMPLATES = [
  {
    label: "Record",
    value: 'record',
    Icon: CirclePlay,
    mood: 'destructive',
    // Interface: MomentEventTabContent, 
  },
  {
    label: "Moment",
    value: 'moment',
    Icon: AlarmClockCheck,
    // Interface: MomentEventTabContent, 
  },
  {
    label: "To-do",
    value: 'todo',
    Icon: ListTodoIcon,
    // Interface: MomentEventTabContent, 
  },
  {
    label: "Event",
    value: 'single_time',
    Icon: Calendar1,
    Interface: SingleTimeEventEditor, 
  },
  {
    label: "All-Day",
    value: 'all_day',
    Icon: CalendarDays,
    Interface: AllDayEventEditor, 
  },
  {
    label: "Calendar",
    value: 'calendar',
    Icon: Calendar,
    Interface: CalendarEventEditor,
  },
  {
    label: "Location",
    value: 'location',
    Interface: null,
    Icon: MapPin,
  },
   {
    label: "Schedule",
    value: 'schedule',
    Interface: ScheduleEventEditor,
    Icon: ClipboardClock,
  }


]