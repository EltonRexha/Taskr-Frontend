import { ProjectHeader } from "@/features/projects/components/ProjectHeader";
import { ScrumBoard } from "@/features/projects/components/ScrumBoard";
import { getProjectById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ProjectHeader project={project} />
      {project.type === "kanban" ? (
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
