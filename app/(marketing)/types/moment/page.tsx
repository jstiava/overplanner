import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Zap,
  Timer,
  CalendarClock,
} from "lucide-react";

export default function MomentEventPage() {
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
            <Zap className="h-4 w-4" />
            Moment
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Some things happen
            <br />
            <span className="text-muted-foreground">
              in a moment.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Moments are events that happen over a very short period of time.
            Capture the things that need a precise place on your timeline,
            without giving them more space than they need.
          </p>
        </div>

        {/* Timeline preview */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-medium">Today</p>
                <p className="text-sm text-muted-foreground">
                  Wednesday, August 19
                </p>
              </div>

              <Clock3 className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-[76px] right-0 top-1/2 h-px bg-border" />

              <div className="relative grid grid-cols-[60px_1fr] gap-4">
                <div className="text-right text-xs text-muted-foreground">
                  10:42
                </div>

                <div className="relative h-16">
                  {/* Moment */}
                  <div className="absolute left-[35%] top-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full border-2 border-background bg-foreground" />

                      <div className="absolute left-1/2 top-5 w-32 -translate-x-1/2 rounded-lg border bg-background px-3 py-2 shadow-sm">
                        <p className="text-xs font-medium">
                          Coffee spilled
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          10:42:18 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 grid grid-cols-[60px_1fr] gap-4">
                <div className="text-right text-xs text-muted-foreground">
                  11:00
                </div>

                <div className="text-xs text-muted-foreground">
                  A normal scheduled event continues here...
                </div>
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
              Precision without clutter
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Give small events the space they deserve.
            </h2>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Not every event needs a 30-minute block on your calendar.
              Sometimes something happens in seconds or a few minutes.
            </p>

            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Moments let you place those events exactly where they happened
              without making your schedule look busier than it really was.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-6">
              <Example
                icon={<CalendarClock className="h-5 w-5" />}
                title="Team meeting"
                description="A scheduled event with meaningful duration"
                type="Single Time"
              />

              <div className="h-px bg-border" />

              <Example
                icon={<Zap className="h-5 w-5" />}
                title="Received an important call"
                description="A brief event that happened at 2:14 PM"
                type="Moment"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Why Moments?
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Precise events without oversized blocks.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Zap className="h-5 w-5" />}
            title="Very short"
            description="Designed for events that happen in an instant or over only a few minutes."
          />

          <Feature
            icon={<Clock3 className="h-5 w-5" />}
            title="Precisely placed"
            description="A Moment belongs exactly where it happened on your timeline."
          />

          <Feature
            icon={<Timer className="h-5 w-5" />}
            title="No wasted space"
            description="Don't give a five-second event a thirty-minute block on your calendar."
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
              Events that happen quickly.
            </h2>

            <p className="mt-4 text-lg text-muted-foreground">
              If it happened at a particular moment and didn't last very
              long, a Moment is probably the right type.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Phone call",
              "Quick conversation",
              "Taking a photo",
              "Receiving a message",
              "Making a purchase",
              "Checking in",
              "A quick interaction",
              "A brief interruption",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border bg-card p-4"
              >
                <Zap className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moment vs Single Time */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Moment vs Single Time
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How long does it need to be?
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            Choose based on how much time the event actually occupies.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border bg-card">
          <div className="grid grid-cols-2 border-b bg-muted/30">
            <div className="p-5">
              <p className="font-semibold">Moment</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Very short
              </p>
            </div>

            <div className="border-l p-5">
              <p className="font-semibold">Single Time</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Meaningful duration
              </p>
            </div>
          </div>

          {[
            ["Quick phone call", "Doctor's appointment"],
            ["Received a message", "Lunch with a friend"],
            ["Checked in", "Team meeting"],
            ["Took a photo", "Watching a movie"],
          ].map(([moment, event]) => (
            <div
              key={moment}
              className="grid grid-cols-2 border-b last:border-0"
            >
              <div className="p-5 text-sm">{moment}</div>
              <div className="border-l p-5 text-sm">{event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Every moment has a place.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Capture short events precisely, without letting them take over your
          calendar.
        </p>

        <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Create a Moment
          <Zap className="h-4 w-4" />
        </button>
      </section>
    </main>
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
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {type}
        </p>
      </div>
    </div>
  );
}