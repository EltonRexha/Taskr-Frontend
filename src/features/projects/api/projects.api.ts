import api from "@/lib/axios";
import { GetProjectsQuery, GetProjectsResponse } from "../types/projects.types";

const projectApi = {
  getProjects: async (query: GetProjectsQuery) => {
    const response = await api.get<GetProjectsResponse>("/projects", {
      params: query,
    });
    return response.data;
  },
};

export default projectApi;
