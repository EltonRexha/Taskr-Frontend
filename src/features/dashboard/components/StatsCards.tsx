import { useTasks } from "@/features/tasks/hooks/useTasks";
import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskDto } from "@/features/tasks/types/tasks.types";
import { getWeekRange } from "@/lib/date";
import { format } from "date-fns";

const TASK_LIMIT = 50;

function getTaskStatus(task: TaskDto): string | null {
  return task.metaData.status;
}

function isTaskCompleted(task: TaskDto): boolean {
  const status = getTaskStatus(task);
  return status === "DONE";
}

function isTaskInProgress(task: TaskDto): boolean {
  const status = getTaskStatus(task);
  return status === "IN_PROGRESS";
}

function useTaskStats(tasks: TaskDto[]) {
  const completed = tasks.filter(isTaskCompleted).length;
  const inProgress = tasks.filter(isTaskInProgress).length;

  return {
    completed,
    inProgress,
  };
}

function useDashboardStats() {
  const { endDate: lastWeekEnd, startDate: lastWeekStart } = getWeekRange(1);
  const { startDate: thisWeekStart } = getWeekRange();
  const lastWeekTasks = useTasks({
    dueDateLte: lastWeekEnd,
    startDateGte: lastWeekStart,
    limit: TASK_LIMIT,
  });
  const thisWeekTasks = useTasks({
    startDateGte: thisWeekStart,
    limit: TASK_LIMIT,
  });

  const thisWeekData = thisWeekTasks.data?.tasks || [];
  const lastWeekData = lastWeekTasks.data?.tasks || [];

  console.log({ thisWeekData, lastWeekData });

  const total = thisWeekData.length;
  const taskStats = useTaskStats(thisWeekData);

  const lastWeekTotal = lastWeekData.length;
  const lastWeekTaskStats = useTaskStats(lastWeekData);

  const totalChange = Number(
    lastWeekTotal > 0
      ? (((total - lastWeekTotal) / lastWeekTotal) * 100).toFixed(0)
      : 0,
  );
  const completedChange = Number(
    lastWeekTaskStats.completed > 0
      ? (
          ((taskStats.completed - lastWeekTaskStats.completed) /
            lastWeekTaskStats.completed) *
          100
        ).toFixed(0)
      : taskStats.completed > 0
        ? 100
        : 0,
  );
  const inProgressChange = Number(
    lastWeekTaskStats.inProgress > 0
      ? (
          ((taskStats.inProgress - lastWeekTaskStats.inProgress) /
            lastWeekTaskStats.inProgress) *
          100
        ).toFixed(0)
      : taskStats.inProgress > 0
        ? 100
        : 0,
  );

  const overDueTasks = useTasks({
    dueDateLte: format(new Date(), "yyyy-MM-dd"),
  });

  return {
    total,
    inProgress: taskStats.inProgress,
    completed: taskStats.completed,
    totalChange: totalChange >= 0 ? `+${totalChange}%` : `${totalChange}%`,
    completedChange:
      completedChange >= 0 ? `+${completedChange}%` : `${completedChange}%`,
    inProgressChange:
      inProgressChange >= 0 ? `+${inProgressChange}%` : `${inProgressChange}%`,
    isLoading: thisWeekTasks.isLoading || lastWeekTasks.isLoading,
    totalOverdue: overDueTasks.data?.tasks.length || 0,
  };
}

export function StatsCards() {
  const stats = useDashboardStats();
  const cards = [
    {
      label: "Total Tasks This Week",
      value: stats.total,
      change: `${stats.totalChange} from last week`,
      changeType: (Number(stats.totalChange.replace(/[+%]/g, "")) >= 0
        ? "positive"
        : "negative") as "positive" | "negative",
      icon: Circle,
    },
    {
      label: "In Progress This Week",
      value: stats.inProgress,
      change: `${stats.inProgressChange} from last week`,
      changeType: (Number(stats.inProgressChange.replace(/[+%]/g, "")) >= 0
        ? "positive"
        : "negative") as "positive" | "negative",
      icon: Clock,
    },
    {
      label: "Completed This Week",
      value: stats.completed,
      change: `${stats.completedChange} from last week`,
      changeType: (Number(stats.completedChange.replace(/[+%]/g, "")) >= 0
        ? "positive"
        : "negative") as "positive" | "negative",
      icon: CheckCircle2,
    },
    {
      label: "Total Overdue",
      value: stats.totalOverdue,
      change: `Total of ${stats.totalOverdue === 0 ? "No" : stats.totalOverdue} overdue tasks`,
      changeType: stats.totalOverdue === 0 ? "positive" : "negative",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {stats.isLoading
        ? // Loading skeleton cards
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-xl border border-border bg-card p-4 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-20 sm:w-24" />
                  <Skeleton className="h-8 w-12 sm:w-16" />
                  <Skeleton className="h-3 w-16 sm:w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ))
        : cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-border bg-card p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p
                    className={`mt-1 text-[10px] sm:text-xs ${card.changeType === "positive" ? "text-primary" : "text-destructive"}`}
                  >
                    {card.change}
                  </p>
                </div>
                <div
                  className={`rounded-full p-1.5 sm:p-2 ${card.changeType === "positive" ? "text-primary" : "text-destructive"}`}
                >
                  <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}
