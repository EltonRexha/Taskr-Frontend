import api from "@/lib/axios";
import { formatDateOnly } from "@/lib/date";
import { TaskQueryParams, TasksResponse } from "../types/tasks.types";


export const taskApi = {
  getTasks: async (query: TaskQueryParams) => {
    const utcStartDate = query?.startDate
      ? formatDateOnly(query.startDate)
      : undefined;
    const utcStartDateGte = query?.startDateGte
      ? formatDateOnly(query.startDateGte)
      : undefined;
    const utcDueDate = query?.dueDate
      ? formatDateOnly(query.dueDate)
      : undefined;
    const utcDueDateLte = query?.dueDateLte
      ? formatDateOnly(query.dueDateLte)
      : undefined;

    const response = await api.get<TasksResponse>("/tasks", {
      params: {
        ...query,
        startDate: utcStartDate,
        startDateGte: utcStartDateGte,
        dueDate: utcDueDate,
        dueDateLte: utcDueDateLte,
      },
    });

    return response.data;
  },
};
