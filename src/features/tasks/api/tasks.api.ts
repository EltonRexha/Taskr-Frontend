import api from "@/lib/axios";
import { TasksResponse } from "../types/tasks.types";

export const taskApi = {
  getTasks: async ({
    projectName,
    projectId,
    description,
  }: {
    projectName?: string;
    projectId?: string;
    description?: string;
  }) => {
    const response = await api.get<TasksResponse>("/tasks", {
      params: {
        projectName,
        projectId,
        description,
      },
    });

    return response.data;
  },
};
