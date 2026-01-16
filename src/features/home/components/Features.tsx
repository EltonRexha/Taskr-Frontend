import { StaggeredCards } from "@/components/StaggeredCards";
import {
  BarChart3,
  Clock,
  Kanban,
  Shield,
  Users,
  Zap,
  Calendar,
  Target,
  Layers,
  Github,
} from "lucide-react";

const features = [
  {
    icon: Github,
    title: "Open Source",
    description:
      "Contribute and view the code, completely free without any subscriptions added!",
  },
  {
    icon: Kanban,
    title: "Kanban Boards",
    description:
      "Visualize your workflow with drag-and-drop boards that adapt to your process.",
  },
  {
    icon: Target,
    title: "Scrum & Sprints",
    description:
      "Full Scrum support with sprint planning, backlog grooming, and retrospectives.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time updates, comments, and mentions keep everyone in sync.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track velocity, burndown, and team performance with powerful insights.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Built-in time tracking helps you understand where time goes.",
  },
  {
    icon: Zap,
    title: "Automations",
    description: "Automate repetitive tasks and focus on what matters most.",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description: "See deadlines and sprints in a calendar for better planning.",
  },
  {
    icon: Layers,
    title: "Custom Fields",
    description: "Add custom fields to track exactly what your team needs.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Authentication completely secure from clerk",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 px-4 border-t border-border"
    >
      <div className="mx-auto max-w-6xl">
        <StaggeredCards className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything you need to ship faster
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Powerful features designed for modern teams. From startups to
            enterprises.
          </p>
        </StaggeredCards>

        <StaggeredCards className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.slice(0, 5).map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-4 sm:p-6 hover:border-primary/50 transition-colors h-full"
            >
              <div className="mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </StaggeredCards>
        <StaggeredCards className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-4 sm:mt-6 h-full">
          {features.slice(5).map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-4 sm:p-6 hover:border-primary/50 transition-colors"
            >
              <div className="mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </StaggeredCards>
      </div>
    </section>
  );
}
