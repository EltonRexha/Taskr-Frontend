"use client";

import { useQuery } from "@tanstack/react-query";
import { sprintsApi } from "../api/sprints.api";

const sprintsQueryKeys = {
  all: ["sprints"] as const,
  list: (projectId: string) => ["sprints", projectId] as const,
};

export function useActiveSprints(projectId: string) {
  return useQuery({
    queryKey: sprintsQueryKeys.list(projectId),
    queryFn: () => sprintsApi.getActiveSprints(projectId),
    enabled: !!projectId,
  });
}
