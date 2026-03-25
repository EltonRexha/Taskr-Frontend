import { ProjectHeader } from "@/features/projects/components/ProjectHeader";
import ProjectMain from "@/features/projects/components/ProjectMain";
import { ScrumBoard } from "@/features/projects/components/ScrumBoard";
import { useQueryProjectById } from "@/features/projects/hooks/useProjects";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectMain projectId={projectId} />;
}
