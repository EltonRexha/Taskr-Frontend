import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";

const tasksQueryKeys = {
  all: ["tasks"] as const,
  list: ({
    projectName,
    projectId,
    description,
  }: {
    projectName?: string;
    projectId?: string;
    description?: string;
  }) =>
    [tasksQueryKeys.all, "list", projectName, projectId, description] as const,
};

export const useTasks = ({
  projectName,
  projectId,
  description,
}: {
  projectName?: string;
  projectId?: string;
  description?: string;
}) => {
  return useQuery({
    queryKey: tasksQueryKeys.list({ projectName, projectId, description }),
    queryFn: () => taskApi.getTasks({ projectName, projectId, description }),
  });
};
