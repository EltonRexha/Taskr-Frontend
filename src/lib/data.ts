// Boilerplate data and types for the project management system

export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";
export type ProjectType = "kanban" | "scrum";

export interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: TaskStatus;
  sprintId?: string;
  storyPoints?: number;
  assignee?: Member;
  projectId: string;
  order?: number;
}

export interface TaskOrderUpdate {
  taskId: string;
  status: TaskStatus;
  order: number;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  projectId: string;
  isActive?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  type: ProjectType;
  members: Member[];
  createdAt: string;
}

// Boilerplate Members
const MOCK_MEMBERS: Member[] = [
  {
    id: "member-1",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "member-2",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: "member-3",
    name: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: "member-4",
    name: "Sarah Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
];

// Boilerplate Projects
const MOCK_PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Mobile App Redesign",
    description: "Redesigning the mobile application for better UX",
    color: "#3b82f6",
    icon: "📱",
    type: "scrum",
    members: MOCK_MEMBERS,
    createdAt: new Date().toISOString(),
  },
  {
    id: "project-2",
    name: "Website Optimization",
    description: "Optimizing website performance and SEO",
    color: "#ef4444",
    icon: "🚀",
    type: "kanban",
    members: MOCK_MEMBERS.slice(0, 3),
    createdAt: new Date().toISOString(),
  },
];

export function getBacklogTasks(projectId: string): Task[] {
  return MOCK_TASKS.filter((t) => t.projectId === projectId && !t.sprintId);
}

// Boilerplate Sprints
const MOCK_SPRINTS: Sprint[] = [
  {
    id: "sprint-1",
    name: "Sprint 1",
    goal: "Complete authentication flow",
    startDate: new Date(2026, 2, 1).toISOString(),
    endDate: new Date(2026, 2, 15).toISOString(),
    projectId: "project-1",
    isActive: true,
  },
  {
    id: "sprint-2",
    name: "Sprint 2",
    goal: "Implement dashboard features",
    startDate: new Date(2026, 2, 16).toISOString(),
    endDate: new Date(2026, 2, 30).toISOString(),
    projectId: "project-1",
    isActive: false,
  },
];

// Boilerplate Tasks
const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    key: "TASK-1",
    title: "Set up user authentication",
    description: "Implement login and signup flow",
    status: "done",
    storyPoints: 8,
    assignee: MOCK_MEMBERS[0],
    projectId: "project-1",
  },
  {
    id: "task-2",
    key: "TASK-2",
    title: "Create user profile page",
    description: "Build the user profile management page",
    status: "in-progress",
    sprintId: "sprint-1",
    storyPoints: 5,
    assignee: MOCK_MEMBERS[1],
    projectId: "project-1",
  },
  {
    id: "task-3",
    key: "TASK-3",
    title: "Add password reset functionality",
    description: "Implement password reset via email",
    status: "review",
    sprintId: "sprint-1",
    storyPoints: 3,
    assignee: MOCK_MEMBERS[2],
    projectId: "project-1",
  },
  {
    id: "task-4",
    key: "TASK-4",
    title: "Implement two-factor authentication",
    description: "Add 2FA support using TOTP",
    status: "todo",
    sprintId: "sprint-1",
    storyPoints: 8,
    assignee: MOCK_MEMBERS[3],
    projectId: "project-1",
  },
  {
    id: "task-5",
    key: "TASK-5",
    title: "Update documentation",
    description: "Update API docs for new endpoints",
    status: "backlog",
    projectId: "project-1",
    storyPoints: 2,
  },
  {
    id: "task-6",
    key: "WEB-1",
    title: "Optimize images",
    description: "Compress and optimize all images",
    status: "todo",
    projectId: "project-2",
    storyPoints: 3,
    assignee: MOCK_MEMBERS[0],
  },
  {
    id: "task-7",
    key: "WEB-2",
    title: "Implement lazy loading",
    description: "Add lazy loading for images and components",
    status: "in-progress",
    projectId: "project-2",
    storyPoints: 5,
    assignee: MOCK_MEMBERS[1],
  },
];

// Data retrieval functions
export function getProjectById(projectId: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.id === projectId);
}

export function getAllProjects(): Project[] {
  return MOCK_PROJECTS;
}

export function getTasksByProject(projectId: string): Task[] {
  return MOCK_TASKS.filter((t) => t.projectId === projectId);
}

export function getTasksBySprint(sprintId: string): Task[] {
  return MOCK_TASKS.filter((t) => t.sprintId === sprintId);
}

export function getActiveSprint(projectId: string): Sprint | undefined {
  return MOCK_SPRINTS.find(
    (s: Sprint) => s.projectId === projectId && s.isActive === true,
  );
}

export function getSprintsByProject(projectId: string): Sprint[] {
  return MOCK_SPRINTS.filter((s) => s.projectId === projectId);
}

export function getMemberById(memberId: string): Member | undefined {
  return MOCK_MEMBERS.find((m) => m.id === memberId);
}

export function getAllMembers(): Member[] {
  return MOCK_MEMBERS;
}

// Task order persistence (in a real app, this would be an API call)
export async function saveTaskOrder(updates: TaskOrderUpdate[]): Promise<void> {
  // TODO: Replace with actual API call
  // await fetch('/api/tasks/reorder', { method: 'POST', body: JSON.stringify(updates) })
  // biome-ignore lint/suspicious/noUnusedVariables: Updates parameter used for future API implementation
  return Promise.resolve();
}
