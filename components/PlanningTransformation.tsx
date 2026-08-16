import Link from "next/link";
import {
  ArrowRight,
  Focus,
  Heart,
  Move3d,
} from "lucide-react";

const pillars = [
  {
    from: "Performative",
    title: "Intentional",
    description:
      "Plan around what actually matters to you—not what simply looks productive.",
    href: "/intentional",
    icon: Heart,
  },
  {
    from: "Pressure",
    title: "Focused",
    description:
      "Give your attention to what matters now without feeling like everything needs to get done.",
    href: "/focused",
    icon: Focus,
  },
  {
    from: "Rigidity",
    title: "Flexible",
    description:
      "Give your day structure while leaving room for plans to change.",
    href: "/flexible",
    icon: Move3d,
  },
];

export function PlanningTransformation() {
  return (
    <section className="w-full px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            A different approach
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Planning that works with you
          </h2>

          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Less pressure to optimize every moment. More clarity about how you
            want to spend your time.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group rounded-3xl border bg-background p-7 transition-colors hover:bg-muted/40"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                  <Icon className="size-5" />
                </div>

                <div className="mt-8">
                  <p className="text-sm text-muted-foreground line-through">
                    {pillar.from}
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 leading-7 text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-medium">
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}