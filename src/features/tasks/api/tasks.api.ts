import api from "@/lib/axios";
import { TasksResponse } from "../types/tasks.types";
import { toUtcDate } from "@/lib/to-utc-date";

export const taskApi = {
  getTasks: async ({
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
    const utcStartDate = startDate ? toUtcDate(startDate) : undefined;
    const utcStartDateGte = startDateGte ? toUtcDate(startDateGte) : undefined;

    const response = await api.get<TasksResponse>("/tasks", {
      params: {
        projectName,
        projectId,
        description,
        startDate: utcStartDate,
        startDateGte: utcStartDateGte,
      },
    });

    return response.data;
  },
};
