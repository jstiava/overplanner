'use client'
import { Button } from "@/components/ui/button";
import {
   CheckCircle2,
   Circle,
   ListTodo,
   CalendarDays,
   Clock3,
   ArrowRight,
   Link,
   ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TodoEventPage() {

   const router = useRouter();

   return (
      <main className="min-h-screen bg-background">


         {/* Hero */}
         <section className="mx-auto max-w-6xl px-6 pb-24 pt-20">
            <div className="mx-auto max-w-3xl text-center">

               <div className="flex w-full mb-20">
                  <Button variant={'link'} onClick={e => {
                     router.push(`/features`)
                  }}><ArrowLeft /> All event types</Button>
               </div>

               <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
                  <ListTodo className="h-4 w-4" />
                  Todo
               </div>

               <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                  Things you need to do,
                  <br />
                  <span className="text-muted-foreground">
                     without scheduling them.
                  </span>
               </h1>

               <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Not everything belongs on your calendar. Todos are for tasks that
                  need to get done, but don't need their own time slot.
               </p>
            </div>

            {/* Todo preview */}
            <div className="mx-auto mt-16 max-w-2xl">
               <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                     <div>
                        <p className="font-medium">Today's todos</p>
                        <p className="text-sm text-muted-foreground">
                           3 things left to do
                        </p>
                     </div>

                     <div className="rounded-lg bg-muted p-2">
                        <ListTodo className="h-5 w-5" />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <TodoItem
                        title="Send the project proposal"
                        completed
                     />
                     <TodoItem
                        title="Review pull request"
                     />
                     <TodoItem
                        title="Pick up dry cleaning"
                     />
                     <TodoItem
                        title="Buy groceries"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* Explanation */}
         <section className="border-y bg-muted/30">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
               <div>
                  <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                     A different kind of planning
                  </p>

                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                     A task doesn't always need a time.
                  </h2>

                  <p className="mt-5 text-lg leading-8 text-muted-foreground">
                     A calendar is great for knowing where you need to be. A todo is
                     better for knowing what you need to accomplish.
                  </p>

                  <p className="mt-4 text-lg leading-8 text-muted-foreground">
                     Keep your schedule focused on commitments while keeping your
                     tasks somewhere you can actually work through them.
                  </p>
               </div>

               <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="space-y-6">
                     <Example
                        icon={<CalendarDays className="h-5 w-5" />}
                        title="Meeting with Sarah"
                        description="Needs a specific time"
                        type="Calendar event"
                     />

                     <div className="h-px bg-border" />

                     <Example
                        icon={<ListTodo className="h-5 w-5" />}
                        title="Send Sarah the report"
                        description="Just needs to get done"
                        type="Todo"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* Benefits */}
         <section className="mx-auto max-w-6xl px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
               <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Why todos?
               </p>

               <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Plan the work, not just the time.
               </h2>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
               <Feature
                  icon={<Clock3 className="h-5 w-5" />}
                  title="No time required"
                  description="Create a task without deciding exactly when you're going to do it."
               />

               <Feature
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  title="Clear completion"
                  description="Todos have one simple purpose: give you something to accomplish and let you mark it done."
               />

               <Feature
                  icon={<CalendarDays className="h-5 w-5" />}
                  title="Keep your calendar clean"
                  description="Don't fill your calendar with artificial time blocks just to remember what needs doing."
               />
            </div>
         </section>

         {/* Examples */}
         <section className="border-y bg-muted/30">
            <div className="mx-auto max-w-6xl px-6 py-24">
               <div className="max-w-2xl">
                  <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                     Perfect for
                  </p>

                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                     The things that live on your list.
                  </h2>

                  <p className="mt-4 text-lg text-muted-foreground">
                     If it needs to happen but doesn't need a specific time, make it
                     a Todo.
                  </p>
               </div>

               <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                     "Send an email",
                     "Buy groceries",
                     "Review a document",
                     "Call the dentist",
                     "Clean the kitchen",
                     "Submit an application",
                     "Order supplies",
                     "Finish homework",
                  ].map((item) => (
                     <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border bg-card p-4"
                     >
                        <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium">{item}</span>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA */}
         <section className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
               Get it out of your head.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
               Capture what needs to get done without forcing everything into a
               schedule.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
               Create a Todo
               <ArrowRight className="h-4 w-4" />
            </button>
         </section>
      </main>
   );
}

function TodoItem({
   title,
   completed = false,
}: {
   title: string;
   completed?: boolean;
}) {
   return (
      <div className="flex items-center gap-3 rounded-xl border p-3">
         {completed ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-muted-foreground" />
         ) : (
            <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
         )}

         <span
            className={
               completed
                  ? "text-sm text-muted-foreground line-through"
                  : "text-sm font-medium"
            }
         >
            {title}
         </span>
      </div>
   );
}

function Feature({
   icon,
   title,
   description,
}: {
   icon: React.ReactNode;
   title: string;
   description: string;
}) {
   return (
      <div className="rounded-2xl border bg-card p-6">
         <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            {icon}
         </div>

         <h3 className="font-semibold">{title}</h3>

         <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
         </p>
      </div>
   );
}

function Example({
   icon,
   title,
   description,
   type,
}: {
   icon: React.ReactNode;
   title: string;
   description: string;
   type: string;
}) {
   return (
      <div className="flex gap-4">
         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            {icon}
         </div>

         <div className="min-w-0">
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
               {type}
            </p>
         </div>
      </div>
   );
}