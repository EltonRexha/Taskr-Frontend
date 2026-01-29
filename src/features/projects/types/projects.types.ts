import { paths } from "@/api/types";

export interface ProjectDto {
  id: string;
  name: string;
  projectType: string;
  createdAt: string;
  updatedAt: string;
}

export type GetProjectsQuery = paths["/projects"]["get"]["parameters"]["query"];
export type GetProjectsResponse =
  paths["/projects"]["get"]["responses"]["200"]["content"]["application/json"];
