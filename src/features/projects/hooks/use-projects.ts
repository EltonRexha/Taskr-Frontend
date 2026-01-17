import { useQuery } from "@tanstack/react-query";
import projectApi from "../api/projects.api";

export const projectQueryKeys = {
  all: ["projects"] as const,
  list: () => [...projectQueryKeys.all, "list"] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.list(),
    queryFn: () => projectApi.getProjects(),
  });
}
