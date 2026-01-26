import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from "@/lib/constants";
import { TaskQueryParams, TasksResponse } from "../types/tasks.types";

const tasksQueryKeys = {
  all: ["tasks"] as const,
  list: ({
    projectName,
    projectId,
    description,
    limit,
    page,
    startDate,
    startDateGte,
    dueDate,
    dueDateLte,
    status,
    type,
  }: TaskQueryParams) =>
    [
      tasksQueryKeys.all,
      "list",
      projectName,
      projectId,
      description,
      limit,
      page,
      startDate,
      startDateGte,
      dueDate,
      dueDateLte,
      status,
      type,
    ] as const,
};

export const useTasks = ({
  projectName,
  projectId,
  description,
  limit = DEFAULT_PAGE_SIZE,
  page = DEFAULT_PAGE,
  status,
  type,
  startDate,
  startDateGte,
  dueDate,
  dueDateLte,
}: TaskQueryParams): UseQueryResult<TasksResponse, Error> => {
  return useQuery({
    queryKey: tasksQueryKeys.list({
      projectName,
      projectId,
      description,
      limit,
      page,
      startDate,
      startDateGte,
      dueDate,
      dueDateLte,
      status,
      type,
    }),
    queryFn: () =>
      taskApi.getTasks({
        projectName,
        projectId,
        description,
        startDate,
        startDateGte,
        dueDate,
        dueDateLte,
        limit,
        page,
        status,
        type,
      }),
  });
};
