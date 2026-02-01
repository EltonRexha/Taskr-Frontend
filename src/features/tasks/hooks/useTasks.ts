import { useInfiniteQuery } from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from "@/lib/constants";
import { paths } from "@/api/types";
import { getNextPageParam } from "@/lib/queryUtils";

type TaskQueryParams = paths["/tasks"]["get"]["parameters"]["query"];

const tasksQueryKeys = {
  all: ["tasks"] as const,
  list: (stringifiedQuery: string) => ["tasks", stringifiedQuery] as const,
};

export const useTasks = (query: TaskQueryParams) => {
  const limit = query?.limit || DEFAULT_PAGE_SIZE;
  const page = query?.page || DEFAULT_PAGE;
  return useInfiniteQuery({
    queryKey: tasksQueryKeys.list(
      JSON.stringify({
        ...query,
        limit,
        page,
      }),
    ),
    queryFn: ({ pageParam }) =>
      taskApi.getTasks({
        ...query,
        limit,
        page: pageParam,
      }),
    getNextPageParam,
    initialPageParam: page,
    select: (data) => ({
      ...data,
      tasks: data.pages.flatMap((page) => page.tasks),
    }),
  });
};
