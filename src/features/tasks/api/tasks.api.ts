import api from "@/lib/axios";
import { formatDateOnly } from "@/lib/date";
import { TaskQueryParams, TasksResponse } from "../types/tasks.types";

export const taskApi = {
  getTasks: async (query: TaskQueryParams) => {
    const utcStartDate = query?.start_date
      ? formatDateOnly(query.start_date)
      : undefined;
    const utcStartDateGte = query?.start_date_gte
      ? formatDateOnly(query.start_date_gte)
      : undefined;
    const utcDueDate = query?.due_date
      ? formatDateOnly(query.due_date)
      : undefined;
    const utcDueDateLte = query?.due_date_lte
      ? formatDateOnly(query.due_date_lte)
      : undefined;

    const response = await api.get<TasksResponse>("/tasks", {
      params: {
        ...query,
        start_date: utcStartDate,
        start_date_gte: utcStartDateGte,
        due_date: utcDueDate,
        due_date_lte: utcDueDateLte,
      },
    });

    return response.data;
  },
};
