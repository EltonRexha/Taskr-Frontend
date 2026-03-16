import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import projectApi from "../api/projects.api";
import { paths } from "@/api/types";
import { CreateProjectRequest } from "../types/projects.types";
import { getNextPageParam } from "@/lib/queryUtils";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

type ProjectQueryParams = paths["/projects"]["get"]["parameters"]["query"];

export const projectQueryKeys = {
  all: ["projects"] as const,
  list: (stringifiedQuery: string) =>
    [...projectQueryKeys.all, "list", stringifiedQuery] as const,
  create: () => [...projectQueryKeys.all, "create"] as const,
};

export function useProjects(query: ProjectQueryParams) {
  const limit = query?.limit || DEFAULT_PAGE_SIZE;
  const page = query?.page || DEFAULT_PAGE;
  return useInfiniteQuery({
    queryKey: projectQueryKeys.list(JSON.stringify(query)),
    queryFn: ({ pageParam }) =>
      projectApi.getProjects({ ...query, limit, page: pageParam }),
    getNextPageParam,
    initialPageParam: page,
    select: (data) => ({
      ...data,
      metadata: data.pages[0].metadata,
      projects: data.pages.flatMap((page) => page.projects),
    }),
  });
}

export function useMutateProjects() {
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectApi.createProject(data),
    mutationKey: projectQueryKeys.create(),
  });
}
