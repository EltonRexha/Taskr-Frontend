import { paths, operations } from "@/api/types";

export type TaskQueryParams = paths["/tasks"]["get"]["parameters"]["query"];
export type TasksResponse =
  paths["/tasks"]["get"]["responses"]["200"]["content"]["application/json"];

export type TaskDto = TasksResponse["tasks"][number];

export type TaskSummaryQueryParams =
  operations["TasksController_getTasksSummary"]["parameters"]["query"];

export type TaskSummaryResponse =
  operations["TasksController_getTasksSummary"]["responses"]["200"]["content"]["application/json"];
