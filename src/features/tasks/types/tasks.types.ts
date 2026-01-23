import { PaginationMeta } from "@/types/PaginationMeta";

export interface TaskDto {
  id: string;
  description: string;
  label: string;
  priority: string;
  project: {
    id: string;
    name: string;
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
