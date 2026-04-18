import { paths, components } from "@/api/types";

export type ProjectDto = components["schemas"]["ProjectDto"];

export type GetProjectsQuery = paths["/projects"]["get"]["parameters"]["query"];
export type GetProjectsResponse =
  paths["/projects"]["get"]["responses"]["200"]["content"]["application/json"];

export type CreateProjectRequest =
  paths["/projects"]["post"]["requestBody"]["content"]["application/json"];

export type CreateProjectResponse =
  paths["/projects"]["post"]["responses"]["201"]["content"]["application/json"];

export type FindOneProjectResponse =
  paths["/projects/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
