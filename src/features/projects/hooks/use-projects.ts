import { useQuery } from "@tanstack/react-query";
import projectApi from "../api/projects.api";
import { paths } from "@/api/types";

type ProjectQueryParams = paths["/projects"]["get"]["parameters"]["query"];

export const projectQueryKeys = {
  all: ["projects"] as const,
  list: (stringifiedQuery: string) =>
    [...projectQueryKeys.all, "list", stringifiedQuery] as const,
};

export function useProjects(query: ProjectQueryParams) {
  return useQuery({
    queryKey: projectQueryKeys.list(JSON.stringify(query)),
    queryFn: () => projectApi.getProjects(query),
  });
}
