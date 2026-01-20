export function getProjectColorByType(type: string): string {
  if (type.toLocaleLowerCase() === "kanban") return "#FF0000";
  if (type.toLocaleLowerCase() === "scrum") return "#00FF00";

  return "#00FF00";
}
