import api from "@/lib/axios";
import { Project } from "../types/projects.types";

const projectApi = {
  getProjects: async (projectName?: string) => {
    const response = await api.get<{ projects: Project[] }>("/projects", {
      params: {
        project_name: projectName,
      },
    });
    return response.data.projects;
  },
};

export default projectApi;
