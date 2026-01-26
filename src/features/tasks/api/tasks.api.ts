import api from "@/lib/axios";
import { TaskQueryParams, TasksResponse } from "../types/tasks.types";
import { formatDateOnly } from "@/lib/date";

export const taskApi = {
  getTasks: async ({
    projectName,
    projectId,
    description,
    startDate,
    startDateGte,
    dueDate,
    dueDateLte,
    status,
    type,
    limit,
    page,
  }: TaskQueryParams) => {
    const utcStartDate = startDate ? formatDateOnly(startDate) : undefined;
    const utcStartDateGte = startDateGte
      ? formatDateOnly(startDateGte)
      : undefined;
    const utcDueDate = dueDate ? formatDateOnly(dueDate) : undefined;
    const utcDueDateLte = dueDateLte ? formatDateOnly(dueDateLte) : undefined;

    const response = await api.get<TasksResponse>("/tasks", {
      params: {
        projectName,
        projectId,
        description,
        startDate: utcStartDate,
        startDateGte: utcStartDateGte,
        dueDate: utcDueDate,
        dueDateLte: utcDueDateLte,
        status,
        type,
        limit,
        page,
      },
    });

    return response.data;
  },
};
