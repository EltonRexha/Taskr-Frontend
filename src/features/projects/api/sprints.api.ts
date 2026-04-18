import api from "@/lib/axios";

export interface Sprint {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  sprintStatus: string;
}

export interface SprintsResponse {
  sprints: Sprint[];
}

export const sprintsApi = {
  getActiveSprints: async (projectId: string): Promise<SprintsResponse> => {
    const response = await api.get<SprintsResponse>(
      `/projects/${projectId}/sprints`,
    );
    return response.data;
  },
};
