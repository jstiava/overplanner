"use client";

import { Fragment, useContext, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { CopyIcon, Minimize, MinusIcon, Plus, X } from "lucide-react";
import { OverplannerCalendarContext } from "@/components/OverplannerCalendarContext";
import { OverplannerSessionContext, Panel } from "@/components/OverplannerSessionContext";
import { AddPanel } from "@/components/AddPanelButton";
import CreateEventPanel from "@/components/panels/CreateEventPanel";
import { PanelProps } from "react-resizable-panels";
import DayViewPanel from "@/components/panels/DayViewPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import WeekViewPanel from "@/components/panels/WeekViewPanel";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import ResizeableDraggablePanel from "@/components/ResizableDraggablePanel";
import MonthViewPanel from "@/components/panels/MonthViewPanel";

const PANEL_COMPONENTS: Record<string, any> = {
  'create-event': {
    Component: CreateEventPanel,
    label: "Create New Event"
  },
  'day-view': {
    Component: DayViewPanel,
    label: "Day View"
  },
  'week-view': {
    Component: WeekViewPanel,
    label: "Week View"
  },
  'month-view': {
    Component: MonthViewPanel,
    label: "Month View"
  },
  'preview': null,
  'edit': null,
  'table': null,
  'conversation': null,
  'column': null,
  'command': null
}



export default function UserDynamicPanelsArea() {

  const { addPanel, panels, setPanels, removePanel } = useContext(OverplannerSessionContext);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!setPanels) {
      alert("NO SET PANELS AVALIABLE")
      return;
    }

    if (!over || active.id === over.id) {
      return;
    }

    setPanels((current) => {
      const oldIndex = current.findIndex(
        (panel) => panel.id === active.id
      );

      const newIndex = current.findIndex(
        (panel) => panel.id === over.id
      );

      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  if (!addPanel || !removePanel) {
    return <p>No valid panels.</p>
  }

  return (
    <div className="relative h-full w-full h-full">

      <div className="flex flex-col w-full h-full">

        {/* Header */}
        <div className="flex items-center px-4 w-full h-[3rem] bg-foreground/3 border-b border-b-border ">
          <AddPanel />
        </div>


        <div className="flex h-[calc(100%-3rem)] w-full">

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={panels.map((panel) => panel.id)}
              strategy={horizontalListSortingStrategy}
            >

              {/* Resizable Panels */}
              <ResizablePanelGroup
                // @ts-ignore
                direction="horizontal"
                className="h-full w-full  overflow-hidden"
              >
                {panels.map((panel, index) => (
                  <ResizeableDraggablePanel key={panel.id} {...{
                    panel,
                    index
                  }} />
                ))}
              </ResizablePanelGroup>
            </SortableContext>
          </DndContext>
        </div>

      </div>
    </div>
  );
}


export function RenderPanel(props: Panel) {

  const Component = PANEL_COMPONENTS[props.type as string]

  if (!Component) {
    return (
      <div className="flex w-full h-full items-center justify-center text-red-200 text-xs">
        <div>Unknown panel type: {props.type}</div>
      </div>
    );
  }

  return (
    <Component.Component {...{
      label: Component.label,
      ...props
    }} />
  )
}