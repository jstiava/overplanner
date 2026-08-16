import { cn } from "@/lib/utils";
import {
  BeautifulMentionsMenuItemProps,
  BeautifulMentionsMenuProps,
} from "lexical-beautiful-mentions";
import { forwardRef } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Menu component for the BeautifulMentionsPlugin.
 */
export function Menu({ loading, children, ...other }: BeautifulMentionsMenuProps) {
  if (loading) {
    return (
      <div className="bg-popover text-popover-foreground top-[2px] m-0 min-w-[8rem] overflow-hidden rounded-md border p-2.5 text-sm shadow-md">
        Loading...
      </div>
    );
  }
  return (
    <ul
      className="flex flex-col gap-0 bg-black text-popover-foreground absolute top-[2px] m-0 min-w-[12rem] overflow-hidden rounded-md border p-1 whitespace-nowrap shadow-md pointer-events-auto"
      {...other}
    >
      {children}
    </ul>

  )
    ;

}

/**
 * MenuItem component for the BeautifulMentionsPlugin.
 */
export const MenuItem = forwardRef<
  HTMLLIElement,
  BeautifulMentionsMenuItemProps
>(({ selected, item, itemValue, ...props }, ref) => (
  <Button
    variant={'ghost'}
    ref={ref as any}
    className={cn(
      "h-8 relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive! hover:bg-accent",
      selected && 'bg-accent'
    )}
    {...props}
  >
    {itemValue}
    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
  </Button>

));
MenuItem.displayName = "MenuItem";
