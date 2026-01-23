import { PaginationMeta } from "@/types/PaginationMeta";

export interface ProjectDto {
  id: string;
  name: string;
  projectType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: ProjectDto[];
  meta: PaginationMeta;
}
