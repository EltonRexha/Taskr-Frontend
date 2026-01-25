import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";

const tasksQueryKeys = {
  all: ["tasks"] as const,
  list: ({
    projectName,
    projectId,
    description,
    startDate,
    startDateGte,
  }: {
    projectName?: string;
    projectId?: string;
    description?: string;
    startDate?: string;
    startDateGte?: string;
  }) =>
    [
      tasksQueryKeys.all,
      "list",
      projectName,
      projectId,
      description,
      startDate,
      ] as const,
};

export const useTasks = ({
  projectName,
  projectId,
  description,
  startDate,
  startDateGte,
}: {
  projectName?: string;
  projectId?: string;
  description?: string;
  startDate?: string;
  startDateGte?: string;
}) => {
  return useQuery({
    queryKey: tasksQueryKeys.list({ projectName, projectId, description, startDate, startDateGte }),
    queryFn: () => taskApi.getTasks({ projectName, projectId, description, startDate, startDateGte }),
  });
};
