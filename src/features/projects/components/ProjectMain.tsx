"use client";

import { useQueryProjectById } from "../hooks/useProjects";
import { ProjectHeader } from "./ProjectHeader";
import { ScrumBoard } from "./ScrumBoard";

function ProjectMain({ projectId }: { projectId: string }) {
  const { data: project, isLoading, error } = useQueryProjectById(projectId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen">
      <ProjectHeader project={project.data} />
      {project.data.projectType === "KANBAN" ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">
            Kanban board not implemented yet
          </p>
        </div>
      ) : (
        <ScrumBoard projectId={projectId} />
      )}
    </div>
  );
}

export default ProjectMain;
