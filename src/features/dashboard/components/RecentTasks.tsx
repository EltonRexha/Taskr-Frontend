import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectColorByType } from "@/features/projects/libs/getProjectColorByType";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { getPriorityColor } from "@/features/tasks/libs/getPriorityColor";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Eye,
  Loader2,
} from "lucide-react";

const statusIcons = {
  overdue: AlertTriangle,
  in_review: Eye,
  in_progress: Loader2,
  todo: AlertTriangle,
  done: CheckCircle2,
};

function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className="fixed px-3 py-2 bg-popover border border-border rounded-md text-xs text-popover-foreground whitespace-nowrap z-9999 pointer-events-none"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            {content}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 -mt-1"
              style={{
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "4px solid hsl(var(--popover))",
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}

export function RecentTasks() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const recentTasks = useTasks({
    start_date_lte: todayStr,
    sort_by: ["start_date:asc"],
  });

  const tasks = recentTasks.data?.tasks || [];

  // Only show nothing if there's an error and no tasks loaded yet
  if (recentTasks.error && tasks.length === 0) {
    return null;
  }

  // Show loading state only on first load
  if (!recentTasks.data && tasks.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-3 sm:p-4">
        <h3 className="font-semibold text-foreground text-sm sm:text-base">
          Recently Started Tasks
        </h3>
      </div>

      <div className="lg:max-h-124 overflow-y-auto">
        <div className="divide-y divide-border">
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const isOverdue = task.dueDate
                ? new Date(task.dueDate) < new Date()
                : false;

              const StatusIcon =
                statusIcons[
                  isOverdue
                    ? "overdue"
                    : (task.metaData?.status.toLowerCase() as keyof typeof statusIcons)
                ];

              //Hide its not assigned to anyone right now
              if (task.assignedTo.length === 0) {
                return null;
              }

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-secondary/50 transition-colors"
                >
                  {isOverdue ? (
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-red-500" />
                  ) : (
                    <StatusIcon
                      className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${
                        task.metaData?.status.toLocaleLowerCase() === "done"
                          ? "text-primary"
                          : task.metaData?.status.toLocaleLowerCase() ===
                              "in-progress"
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                      <div
                        className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: getProjectColorByType(
                            task.metaData?.type as string,
                          ),
                        }}
                      />
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {task.project.name}
                      </span>
                    </div>
                  </div>

                  <Badge
                    className={`${getPriorityColor(
                      task.priority.toLowerCase(),
                    )} text-[10px] sm:text-xs hidden sm:flex`}
                    variant="secondary"
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </Badge>

                  {task.assignedTo && task.assignedTo.length > 0 && (
                    <div className="flex -space-x-4">
                      {task.assignedTo.slice(0, 3).map((assignee, index) => {
                        const initials =
                          assignee.user.firstName.slice(0, 1).toUpperCase() +
                          (assignee.user.lastName as string | null)
                            ?.slice(0, 1)
                            .toUpperCase();
                        const fullName = `${assignee.user.firstName} ${
                          assignee.user.lastName || ""
                        }`.trim();

                        return (
                          <Tooltip
                            key={`${assignee.user.email}-${index}`}
                            content={
                              <>
                                <div className="font-medium">{fullName}</div>
                                <div className="text-muted-foreground text-xs">
                                  {assignee.user.email}
                                </div>
                              </>
                            }
                          >
                            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 border-2 border-background transition-all duration-200 hover:scale-110 hover:z-10 hover:shadow-md hover:border-primary bg-card">
                              <AvatarImage
                                src={
                                  assignee.user.profileImage ||
                                  "/placeholder.svg"
                                }
                                alt={fullName}
                              />
                              <AvatarFallback className="text-[10px] sm:text-xs bg-card">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          </Tooltip>
                        );
                      })}
                      {task.assignedTo.length > 3 && (
                        <Tooltip
                          content={
                            <div className="font-medium">
                              {task.assignedTo.length - 3} more assignee
                              {task.assignedTo.length - 3 > 1 ? "s" : ""}
                            </div>
                          }
                        >
                          <div className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 rounded-full bg-muted border-2 border-background flex items-center justify-center transition-all duration-200 hover:scale-110 hover:z-10 hover:shadow-md hover:border-primary">
                            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                              +{task.assignedTo.length - 3}
                            </span>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8 hidden sm:flex"
                  >
                    <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center">
              <span className="text-sm text-muted-foreground">
                No recently started tasks.
              </span>
            </div>
          )}
        </div>
      </div>

      {recentTasks.hasNextPage && (
        <div className="border-t border-border">
          <Button
            onClick={() => recentTasks.fetchNextPage()}
            variant="ghost"
            className="w-full justify-center text-muted-foreground hover:text-foreground"
            disabled={recentTasks.isLoading || !recentTasks.hasNextPage}
          >
            {recentTasks.isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                View More
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
