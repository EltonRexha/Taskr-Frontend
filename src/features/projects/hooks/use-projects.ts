import { useQuery } from "@tanstack/react-query";
import projectApi from "../api/projects.api";

export const projectQueryKeys = {
  all: ["projects"] as const,
  list: (projectName?: string) =>
    [...projectQueryKeys.all, "list", projectName] as const,
};

export function useProjects(projectName?: string) {
  return useQuery({
    queryKey: projectQueryKeys.list(projectName),
    queryFn: () => projectApi.getProjects(projectName),
  });
}
