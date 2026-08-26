"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const roles = [
  "Admin",
  "Manager",
  "Editor",
  "Viewer",
]



export function UserList() {
  return (
    <div className="space-y-2">

      <div>
        <h2 className="text-lg font-medium">Users</h2>
        {/* <p className="text-sm text-muted-foreground">
          Individuals
        </p> */}
      </div>

      <div className="rounded-lg border divide-y w-full max-w-120">


        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 px-5"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <div className="ml-auto text-xs text-muted-foreground">
              {/* {user.role} */}
              <RoleDropdown />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export function RoleDropdown() {
  const [role, setRole] = useState("Viewer")

  return (
    <Select value={role} onValueChange={setRole}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        {roles.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const users = [
  {
    id: "1",
    name: "Jeremy Stiava",
    email: "jeremy@example.com",
    avatar: "/avatars/jeremy.jpg",
    role: "Owner",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/avatars/sarah.jpg",
    role: "Administrator",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@example.com",
    avatar: "/avatars/michael.jpg",
    role: "Manager",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "/avatars/emily.jpg",
    role: "Employee",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    avatar: "/avatars/david.jpg",
    role: "Viewer",
  },
] as const