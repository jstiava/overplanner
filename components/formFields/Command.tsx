'use client'
import * as React from "react"
import {
    CalculatorIcon,
    CalendarIcon,
    CreditCardIcon,
    PersonStanding,
    SettingsIcon,
    SmileIcon,
    UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import * as Select from "@/components/ui/select"
import { Field, FieldLabel } from "../ui/field"

export default function CommandFormField() {

    const [open, setOpen] = React.useState(false)

    return (
        <>
           <Field>
             <Select.Select>
                <Select.SelectTrigger onClick={() => setOpen(true)} className="w-full">
                    <p>Calendars & People</p>
                </Select.SelectTrigger>
            </Select.Select>
           </Field>
            <CommandDialog open={open} onOpenChange={setOpen}>

                <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="People">
                            <CommandItem className="h-8">
                                <PersonStanding />
                                <span>Jeremy Stiava</span>
                            </CommandItem>
                            
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Settings">
                            <CommandItem className="h-8">
                                <UserIcon />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem className="h-8">
                                <CreditCardIcon />
                                <span>Billing</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem className="h-8">
                                <SettingsIcon />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}
