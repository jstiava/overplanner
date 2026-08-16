"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function DatePicker({
  value = undefined,
  onSelect = () => {},
  buttonProps = {}
} : {
  value: Date | undefined,
  onSelect: (selected: Date | undefined) => any,
  buttonProps?: ComponentProps<typeof Button>;
}) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          {...buttonProps}
          variant="outline"
          data-empty={!value}
          className={cn("w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground", buttonProps.className ?? "")}
        >
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          // defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
