import api from "@/lib/axios";
import { ProjectsResponse } from "../types/projects.types";

const projectApi = {
  getProjects: async ({ projectName }: { projectName?: string }) => {
    const response = await api.get<ProjectsResponse>("/projects", {
      params: {
        project_name: projectName,
      },
    });
    return response.data;
  },
};

export default projectApi;
