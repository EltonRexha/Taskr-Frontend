import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from "@/lib/constants";
import { paths } from "@/api/types";

type TaskQueryParams = paths["/tasks"]["get"]["parameters"]["query"];

const tasksQueryKeys = {
  all: ["tasks"] as const,
  list: (stringifiedQuery: string) => ["tasks", stringifiedQuery] as const,
};

export const useTasks = (query: TaskQueryParams) => {
  const limit = query?.limit || DEFAULT_PAGE_SIZE;
  const page = query?.page || DEFAULT_PAGE;
  return useQuery({
    queryKey: tasksQueryKeys.list(
      JSON.stringify({
        ...query,
        limit,
        page,
      }),
    ),
    queryFn: () =>
      taskApi.getTasks({
        ...query,
        limit,
        page,
      }),
  });
};
