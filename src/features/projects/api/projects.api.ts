import api from "@/lib/axios";
import { Project } from "../types/projects.types";

const projectApi = {
  getProjects: async () => {
    const response = await api.get<{ projects: Project[] }>("/projects");
    return response.data.projects;
  },
};

export default projectApi;
