import React from "react";
import { Columns3, RefreshCcw } from "lucide-react";

function ProjectIcon({ type }: { type: string }) {
  if (type.toLocaleLowerCase() === "kanban") return <Columns3 />;
  if (type.toLocaleLowerCase() === "scrum") return <RefreshCcw />;

  return <Columns3 />;
}

export default ProjectIcon;
