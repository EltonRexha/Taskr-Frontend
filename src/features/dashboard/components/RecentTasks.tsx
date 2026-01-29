import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Circle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export const users = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@taskr.io",
    avatar: "/professional-asian-man.png",
    role: "Product Manager",
  },
  {
    id: "2",
    name: "Sarah Kim",
    email: "sarah@taskr.io",
    avatar: "/professional-woman-glasses.png",
    role: "Senior Developer",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@taskr.io",
    avatar: "/professional-man-beard.png",
    role: "UX Designer",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@taskr.io",
    avatar: "/professional-blonde-woman.png",
    role: "Frontend Developer",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james@taskr.io",
    avatar: "/professional-african-american-man.png",
    role: "Backend Developer",
  },
];

export const tasks = [
  // Kanban project tasks
  {
    id: "task-1",
    key: "MKT-1",
    title: "Redesign homepage hero section",
    description: "Update the hero section with new branding and messaging",
    status: "done",
    priority: "high",
    assignee: users[2],
    reporter: users[0],
    projectId: "kanban-1",
    projectName: "Marketing Site",
    dueDate: "2026-01-10",
    createdAt: "2025-12-20",
    updatedAt: "2026-01-08",
    labels: ["design", "urgent"],
    comments: [],
    subtasks: [
      { id: "st-1", title: "Create wireframes", completed: true },
      { id: "st-2", title: "Design mockups", completed: true },
      { id: "st-3", title: "Get stakeholder approval", completed: true },
    ],
    timeTracked: 480,
    timeEstimate: 360,
  },
  {
    id: "task-2",
    key: "MKT-2",
    title: "Implement new navigation menu",
    description: "Build responsive navigation with mega menu support",
    status: "in-progress",
    priority: "medium",
    assignee: users[3],
    reporter: users[0],
    projectId: "kanban-1",
    projectName: "Marketing Site",
    dueDate: "2026-01-15",
    createdAt: "2025-12-22",
    updatedAt: "2026-01-12",
    labels: ["frontend", "navigation"],
    comments: [
      {
        id: "c-1",
        author: users[0],
        content: "Make sure to test on mobile devices",
        createdAt: "2026-01-10T10:30:00Z",
      },
    ],
    subtasks: [
      { id: "st-4", title: "Desktop navigation", completed: true },
      { id: "st-5", title: "Mobile menu", completed: false },
      { id: "st-6", title: "Mega menu dropdowns", completed: false },
    ],
    timeTracked: 240,
    timeEstimate: 480,
  },
  {
    id: "task-3",
    key: "MKT-3",
    title: "SEO optimization audit",
    description: "Conduct full SEO audit and implement improvements",
    status: "todo",
    priority: "medium",
    assignee: null,
    reporter: users[0],
    projectId: "kanban-1",
    projectName: "Marketing Site",
    dueDate: "2026-01-20",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
    labels: ["seo", "marketing"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 600,
  },
  {
    id: "task-4",
    key: "MKT-4",
    title: "Create blog post template",
    description: "Design and implement reusable blog post template",
    status: "review",
    priority: "low",
    assignee: users[2],
    reporter: users[0],
    projectId: "kanban-1",
    projectName: "Marketing Site",
    dueDate: "2026-01-18",
    createdAt: "2026-01-02",
    updatedAt: "2026-01-11",
    labels: ["design", "content"],
    comments: [],
    subtasks: [],
    timeTracked: 180,
    timeEstimate: 240,
  },
  {
    id: "task-5",
    key: "MKT-5",
    title: "Performance optimization",
    description: "Improve page load times and Core Web Vitals",
    status: "backlog",
    priority: "high",
    assignee: null,
    reporter: users[0],
    projectId: "kanban-1",
    projectName: "Marketing Site",
    labels: ["performance", "technical"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 720,
    createdAt: "2026-01-08",
    updatedAt: "2026-01-08",
  },
  {
    id: "task-6",
    key: "MKT-6",
    title: "Update footer links",
    description: "Add new product pages to footer navigation",
    status: "todo",
    priority: "low",
    assignee: users[3],
    reporter: users[0],
    projectId: "kanban-1",
    projectName: "Marketing Site",
    dueDate: "2026-01-16",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    labels: ["frontend"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 60,
  },
  // Scrum project tasks
  {
    id: "task-7",
    key: "MOB-1",
    title: "Set up React Native project",
    description:
      "Initialize project with TypeScript and essential dependencies",
    status: "done",
    priority: "high",
    assignee: users[1],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-1",
    storyPoints: 3,
    createdAt: "2025-11-28",
    updatedAt: "2025-12-05",
    labels: ["setup", "infrastructure"],
    comments: [],
    subtasks: [],
    timeTracked: 240,
    timeEstimate: 240,
  },
  {
    id: "task-8",
    key: "MOB-2",
    title: "Implement user authentication",
    description: "Build login, registration, and password reset flows",
    status: "done",
    priority: "high",
    assignee: users[4],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-1",
    storyPoints: 8,
    createdAt: "2025-11-28",
    updatedAt: "2025-12-12",
    labels: ["auth", "security"],
    comments: [],
    subtasks: [
      { id: "st-7", title: "Login screen UI", completed: true },
      { id: "st-8", title: "Registration flow", completed: true },
      { id: "st-9", title: "Password reset", completed: true },
      { id: "st-10", title: "Biometric auth", completed: true },
    ],
    timeTracked: 960,
    timeEstimate: 960,
  },
  {
    id: "task-9",
    key: "MOB-3",
    title: "Design app navigation structure",
    description: "Create bottom tab navigation and stack navigators",
    status: "done",
    priority: "medium",
    assignee: users[3],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-2",
    storyPoints: 5,
    createdAt: "2025-12-14",
    updatedAt: "2025-12-22",
    labels: ["navigation", "ux"],
    comments: [],
    subtasks: [],
    timeTracked: 480,
    timeEstimate: 480,
  },
  {
    id: "task-10",
    key: "MOB-4",
    title: "Build home screen dashboard",
    description: "Create dashboard with key metrics and quick actions",
    status: "done",
    priority: "high",
    assignee: users[3],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-2",
    storyPoints: 8,
    createdAt: "2025-12-14",
    updatedAt: "2025-12-26",
    labels: ["ui", "dashboard"],
    comments: [],
    subtasks: [],
    timeTracked: 720,
    timeEstimate: 720,
  },
  {
    id: "task-11",
    key: "MOB-5",
    title: "Implement user profile screen",
    description: "Build profile view and edit functionality",
    status: "in-progress",
    priority: "high",
    assignee: users[3],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-3",
    storyPoints: 5,
    createdAt: "2025-12-30",
    updatedAt: "2026-01-10",
    labels: ["ui", "profile"],
    comments: [],
    subtasks: [
      { id: "st-11", title: "Profile view screen", completed: true },
      { id: "st-12", title: "Edit profile form", completed: false },
      { id: "st-13", title: "Avatar upload", completed: false },
    ],
    timeTracked: 360,
    timeEstimate: 480,
  },
  {
    id: "task-12",
    key: "MOB-6",
    title: "Create settings screen",
    description:
      "Build app settings with notifications, privacy, and preferences",
    status: "todo",
    priority: "medium",
    assignee: users[4],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-3",
    storyPoints: 5,
    createdAt: "2025-12-30",
    updatedAt: "2025-12-30",
    labels: ["settings", "preferences"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 480,
  },
  {
    id: "task-13",
    key: "MOB-7",
    title: "Implement dark mode",
    description: "Add theme switching with system preference detection",
    status: "review",
    priority: "medium",
    assignee: users[3],
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    sprintId: "sprint-3",
    storyPoints: 3,
    createdAt: "2025-12-30",
    updatedAt: "2026-01-12",
    labels: ["ui", "theme"],
    comments: [],
    subtasks: [],
    timeTracked: 300,
    timeEstimate: 240,
  },
  // Backlog items (not in any sprint)
  {
    id: "task-14",
    key: "MOB-8",
    title: "Push notification system",
    description: "Implement push notifications with Firebase Cloud Messaging",
    status: "backlog",
    priority: "high",
    assignee: null,
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    storyPoints: 8,
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
    labels: ["notifications", "firebase"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 960,
  },
  {
    id: "task-15",
    key: "MOB-9",
    title: "Offline mode support",
    description: "Enable app functionality without internet connection",
    status: "backlog",
    priority: "medium",
    assignee: null,
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    storyPoints: 13,
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
    labels: ["offline", "sync"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 1200,
  },
  {
    id: "task-16",
    key: "MOB-10",
    title: "Analytics integration",
    description: "Add event tracking and user analytics",
    status: "backlog",
    priority: "low",
    assignee: null,
    reporter: users[1],
    projectId: "scrum-1",
    projectName: "Mobile App",
    storyPoints: 5,
    createdAt: "2026-01-08",
    updatedAt: "2026-01-08",
    labels: ["analytics"],
    comments: [],
    subtasks: [],
    timeTracked: 0,
    timeEstimate: 480,
  },
];

const priorityColors = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-yellow-500/20 text-yellow-500",
  high: "bg-destructive/20 text-destructive",
  urgent: "bg-red-500/20 text-red-500",
};

const statusIcons = {
  backlog: Circle,
  todo: Circle,
  "in-progress": AlertTriangle,
  review: CheckCircle2,
  done: CheckCircle2,
};

export function RecentTasks() {
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-3 sm:p-4">
        <h3 className="font-semibold text-foreground text-sm sm:text-base">
          Recent Tasks
        </h3>
        <Link
          href="/dashboard/tasks"
          className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-border">
        {recentTasks.map((task) => {
          const StatusIcon =
            statusIcons[task.status as keyof typeof statusIcons];

          return (
            <div
              key={task.id}
              className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-secondary/50 transition-colors"
            >
              <StatusIcon
                className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${
                  task.status === "done"
                    ? "text-primary"
                    : task.status === "in-progress"
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                }`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:inline">
                    {task.key}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                  <div
                    className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        task.projectId === "kanban-1" ? "#f97316" : "#22c55e",
                    }}
                  />
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {task.projectName}
                  </span>
                </div>
              </div>

              <Badge
                className={`${priorityColors[task.priority as keyof typeof priorityColors]} text-[10px] sm:text-xs hidden sm:flex`}
                variant="secondary"
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>

              {task.assignee && (
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                  <AvatarImage
                    src={task.assignee.avatar || "/placeholder.svg"}
                    alt={task.assignee.name}
                  />
                  <AvatarFallback className="text-[10px] sm:text-xs">
                    {task.assignee.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8 hidden sm:flex"
              >
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
