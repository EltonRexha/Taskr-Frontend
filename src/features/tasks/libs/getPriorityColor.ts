const priorityColors = {
  low: "bg-gray-500/10 text-gray-400",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

export function getPriorityColor(priority: string): string {
  return (
    priorityColors[priority as keyof typeof priorityColors] ??
    priorityColors.medium
  );
}
