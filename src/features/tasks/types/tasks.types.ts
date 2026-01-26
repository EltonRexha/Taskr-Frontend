import { PaginationMeta, PaginationQuery } from "@/types/PaginationMeta";

export interface TaskDto {
  id: string;
  description: string;
  label: string;
  priority: string;
  project: {
    id: string;
    name: string;
  };
  metaData: {
    id: string;
    status: string;
    type: string;
  };
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: TaskDto[];
  meta: PaginationMeta;
}

export type TaskQueryParams = {
  projectName?: string;
  projectId?: string;
  description?: string;
  startDate?: string;
  startDateGte?: string;
  status?: string;
  type?: string;
  dueDate?: string;
  dueDateLte?: string;
} & PaginationQuery;
