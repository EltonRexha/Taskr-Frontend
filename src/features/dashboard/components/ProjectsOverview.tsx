import Link from "next/link";
import { Users, AlertTriangle } from "lucide-react";

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

export const projects = [
  {
    id: "kanban-1",
    name: "Marketing Site",
    key: "MKT",
    description: "Company marketing website redesign and maintenance",
    type: "kanban",
    color: "#f97316",
    icon: "🎨",
    lead: users[0],
    members: [users[0], users[2], users[3]],
    createdAt: "2025-10-15",
  },
  {
    id: "scrum-1",
    name: "Mobile App",
    key: "MOB",
    description:
      "Native mobile application development using Scrum methodology",
    type: "scrum",
    color: "#22c55e",
    icon: "📱",
    lead: users[1],
    members: [users[1], users[3], users[4]],
    createdAt: "2025-09-01",
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

export function getTasksByProject(projectId: string) {
  return tasks.filter((t) => t.projectId === projectId);
}

export function ProjectsOverview() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Projects</h3>
      </div>

      <div className="p-4 space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No projects yet</p>
            <p className="text-muted-foreground text-xs mt-1">
              Create your first project to get started
            </p>
          </div>
        ) : (
          projects.map((project) => {
            const projectTasks = getTasksByProject(project.id);
            const completedTasks = projectTasks.filter(
              (t) => t.status === "done",
            ).length;
            const inProgressTasks = projectTasks.filter(
              (t) => t.status === "in-progress",
            ).length;
            const overdueTasks = projectTasks.filter((t) => {
              if (!t.dueDate) return false;
              return new Date(t.dueDate) < new Date() && t.status !== "done";
            }).length;

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{project.members.length}</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                    {project.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-medium text-foreground">
                      {projectTasks.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground">Done:</span>
                    <span className="font-medium text-foreground">
                      {completedTasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-muted-foreground">In Progress:</span>
                    <span className="font-medium text-foreground">
                      {inProgressTasks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-muted-foreground">Overdue:</span>
                    <span className="font-medium text-foreground">
                      {overdueTasks}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
