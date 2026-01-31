import { paths } from "@/api/types";

export type TaskQueryParams = paths["/tasks"]["get"]["parameters"]["query"];
export type TasksResponse =
  paths["/tasks"]["get"]["responses"]["200"]["content"]["application/json"];

export type TaskDto = TasksResponse["tasks"][number];
