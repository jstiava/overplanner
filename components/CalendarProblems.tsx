import { BriefcaseBusiness, Layers3, PencilLine } from "lucide-react";

const problems = [
  {
    icon: BriefcaseBusiness,
    title: "Built for the workplace, not life",
    description:
      "Most calendars are designed around meetings, coworkers, and work accounts—not your life.",
  },
  {
    icon: Layers3,
    title: "Too much to look at",
    description:
      "Multiple calendars, colors, controls, and notifications make it harder to see what actually matters.",
  },
  {
    icon: PencilLine,
    title: "Too much to put in",
    description:
      "Creating and managing every event can feel like work in itself.",
  },
];

export function CalendarProblems() {
  return (
    <section className="w-full px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            The problem
          </p>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Calendars weren't designed around you
          </h2>

          <p className="mt-4 text-lg text-muted-foreground">
            The tools we use to manage our time often create more work than
            they remove.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <div
                key={problem.title}
                className="rounded-2xl border bg-background p-8"
              >
                <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-muted">
                  <Icon className="size-5" />
                </div>

                <h3 className="text-xl font-semibold tracking-tight">
                  {problem.title}
                </h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}