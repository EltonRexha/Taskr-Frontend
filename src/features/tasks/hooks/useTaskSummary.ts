import { useQueries } from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";
import type {
  TaskSummaryQueryParams,
  TaskSummaryResponse,
} from "../types/tasks.types";

const taskSummaryQueryKeys = {
  all: ["tasks", "summary"] as const,
  byProject: (projectId: string) =>
    [...taskSummaryQueryKeys.all, projectId] as const,
};

export function useTasksSummary(projectIds: string[]) {
  const enabled = projectIds.length > 0;

  const queries = useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: taskSummaryQueryKeys.byProject(projectId),
      queryFn: () =>
        taskApi.getTasksSummary({ projectId } as TaskSummaryQueryParams),
      enabled,
    })),
  });

  const summariesByProjectId = projectIds.reduce<
    Record<string, TaskSummaryResponse | undefined>
  >((acc, projectId, index) => {
    acc[projectId] = queries[index]?.data;
    return acc;
  }, {});

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return {
    summariesByProjectId,
    queries,
    isLoading,
    isError,
  };
}
