import Link from "next/link";
import { Users, AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useTasksSummary } from "@/features/tasks/hooks/useTaskSummary";
import type { ProjectDto } from "@/features/projects/types/projects.types";

const PROJECT_LIMIT = 6;

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Skeleton placeholder component used when data is loading
export function ProjectsOverviewSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card animate-pulse">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">
          <Skeleton className="h-4 w-24" />
        </h3>
      </div>
      <div className="p-4 space-y-4 lg:max-h-131 overflow-y-auto">
        {Array.from({ length: PROJECT_LIMIT }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            {/* first row: name + members + type badge */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-12" />
            </div>
            {/* second row: stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsOverview() {
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProjects({ limit: PROJECT_LIMIT });

  const projects: ProjectDto[] = projectsData?.projects ?? [];

  const projectIds = projects.map((p) => p.id);
  const { summariesByProjectId, isLoading: summariesLoading } =
    useTasksSummary(projectIds);

  // Basic initial/empty guards similar to RecentTasks
  if (projectsError && projects.length === 0) {
    return null;
  }

  if ((projectsLoading || summariesLoading) && projects.length === 0) {
    // show skeleton when first page is loading and there are no projects yet
    return <ProjectsOverviewSkeleton />;
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Projects</h3>
      </div>

      <div className="p-4 space-y-4 lg:max-h-124 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No projects yet</p>
            <p className="text-muted-foreground text-xs mt-1">
              Create your first project to get started
            </p>
          </div>
        ) : (
          projects.map((project) => {
            const summary = summariesByProjectId[project.id];
            const completedTasks = summary?.DONE ?? 0;
            const inProgressTasks = summary?.IN_PROGRESS ?? 0;
            const overdueTasks = summary?.overdueTasks ?? 0;

            const totalTasks = completedTasks + inProgressTasks + overdueTasks;
            const memberCount = summary?.memberCount ?? 0;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{memberCount}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground capitalize">
                    {project.projectType} Project
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-medium text-foreground">
                      {totalTasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground">Done:</span>
                    <span className="font-medium text-foreground">
                      {completedTasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-muted-foreground">In Progress:</span>
                    <span className="font-medium text-foreground">
                      {inProgressTasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-muted-foreground">Overdue:</span>
                    <span className="font-medium text-foreground">
                      {overdueTasks}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
      {hasNextPage && (
        <div className="border-t border-border">
          <Button
            onClick={() => fetchNextPage()}
            variant="ghost"
            className="w-full justify-center text-muted-foreground hover:text-foreground"
            disabled={projectsLoading || !hasNextPage}
          >
            {isFetchingNextPage ? (
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
