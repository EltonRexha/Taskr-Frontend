import api from "@/lib/axios";
import {
  GetProjectsQuery,
  GetProjectsResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  FindOneProjectResponse,
} from "../types/projects.types";

const projectApi = {
  getProjects: async (query: GetProjectsQuery) => {
    const response = await api.get<GetProjectsResponse>("/projects", {
      params: query,
    });
    return response.data;
  },
  createProject: async (data: CreateProjectRequest) => {
    const response = await api.post<CreateProjectResponse>("/projects", data);
    return response.data;
  },
  findOne: async (id: string) => {
    const response = await api.get<FindOneProjectResponse>(`/projects/${id}`);
    return response;
  },
};

export default projectApi;
