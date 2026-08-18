import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Sun,
} from "lucide-react";

export default function AllDayEventPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Back */}
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Link
          href="/features"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All event types
        </Link>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
            <Sun className="h-4 w-4" />
            All Day
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Important for the day,
            <br />
            <span className="text-muted-foreground">
              without a specific time.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Some things belong on a particular day without needing a time
            slot. All Day events keep them visible without filling your
            schedule.
          </p>
        </div>

        {/* Calendar preview */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <p className="text-sm text-muted-foreground">Wednesday</p>
              <p className="text-lg font-medium">August 19</p>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Sun className="h-4 w-4" />
                All day
              </div>

              <div className="space-y-2">
                <DayEvent
                  title="Dad's birthday"
                  description="All day"
                />

                <DayEvent
                  title="Project deadline"
                  description="Due today"
                />

                <DayEvent
                  title="Chicago trip"
                  description="August 19–21"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              A day, not a time
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Some things need a date, not a clock.
            </h2>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              All Day events are tied to a specific day, but they don't need
              to compete with everything else happening on your schedule.
            </p>

            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Keep birthdays, deadlines, holidays, trips, and other
              day-long commitments visible without assigning them an
              artificial time.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-6">
              <Example
                icon={<Clock3 className="h-5 w-5" />}
                title="Dentist appointment"
                description="Needs a specific time"
                type="Timed event"
              />

              <div className="h-px bg-border" />

              <Example
                icon={<Sun className="h-5 w-5" />}
                title="Dentist appointment deadline"
                description="Needs to happen today, but no specific time"
                type="All Day event"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Why All Day?
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Give the day meaning without filling it.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<CalendarDays className="h-5 w-5" />}
            title="Belongs to a day"
            description="Attach something to a specific date when the date itself is what matters."
          />

          <Feature
            icon={<Clock3 className="h-5 w-5" />}
            title="No time required"
            description="Don't invent a time for something that can happen anytime during the day."
          />

          <Feature
            icon={<MapPin className="h-5 w-5" />}
            title="Stay visible"
            description="Keep important day-level information where you'll see it alongside your schedule."
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
              Things that belong to the day.
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              If the date matters but the exact time doesn't, make it an All
              Day event.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Birthday",
              "Project deadline",
              "Holiday",
              "Vacation",
              "Anniversary",
              "Conference",
              "Day off",
              "Bill due",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border bg-card p-4"
              >
                <Sun className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Todo vs All Day */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            All Day vs Todo
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            They may look similar. They mean different things.
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Use the one that matches what you're trying to remember.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          <ComparisonCard
            title="All Day"
            icon={<Sun className="h-5 w-5" />}
            description="Something is happening or matters on a particular day."
            examples={[
              "Dad's birthday",
              "Project deadline",
              "Vacation",
            ]}
          />

          <ComparisonCard
            title="Todo"
            icon={<CheckCircle2 className="h-5 w-5" />}
            description="Something needs to get done, but doesn't belong to a particular time."
            examples={[
              "Send an email",
              "Buy groceries",
              "Review a document",
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Let the day be the schedule.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Keep important dates visible without forcing them into a time slot.
        </p>

        <button className="mt-8 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Create an All Day event
        </button>
      </section>
    </main>
  );
}

function DayEvent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-3">
      <div className="h-2 w-2 shrink-0 rounded-full bg-foreground" />

      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
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

function ComparisonCard({
  title,
  icon,
  description,
  examples,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  examples: string[];
}) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>

        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 space-y-2">
        {examples.map((example) => (
          <div
            key={example}
            className="flex items-center gap-2 text-sm"
          >
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            {example}
          </div>
        ))}
      </div>
    </div>
  );
}