"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Columns3, Plus, RefreshCcw, Trash2, Users } from "lucide-react";
import Logo from "@/components/Logo";
import {
  useMutateProjects,
  useProjects,
} from "@/features/projects/hooks/useProjects";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useDebounce } from "@uidotdev/usehooks";

type ProjectType = "SCRUM" | "KANBAN";
type ProjectMemberRole = "ADMIN" | "MEMBER" | "VIEWER";

type InviteMember = {
  email: string;
  role: ProjectMemberRole;
};

type NewProjectFormState = {
  name: string | null;
  type: ProjectType | null;
  invites: InviteMember[];
};

type WizardStep<TState> = {
  id: string;
  title: string;
  description?: string;
  isValid: (state: TState) => boolean;
  render: (args: {
    state: TState;
    setState: React.Dispatch<React.SetStateAction<TState>>;
  }) => React.ReactNode;
};

const PROJECT_MEMBER_ROLE_OPTIONS: Array<{
  value: ProjectMemberRole;
  label: string;
  helper?: string;
}> = [
  { value: "VIEWER", label: "Guest", helper: "Can view project content." },
  {
    value: "MEMBER",
    label: "Member",
    helper: "Can collaborate on tasks and sprints.",
  },
  {
    value: "ADMIN",
    label: "Admin",
    helper: "Full access to manage the project.",
  },
];

function isValidEmail(value: string) {
  const v = value.trim();
  if (!v) return false;
  // pragmatic email validation for UI; backend should validate strictly
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function NewProjectPage() {
  const router = useRouter();
  const user = useUser();
  const mutateProjects = useMutateProjects();
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<NewProjectFormState>({
    name: null,
    type: null,
    invites: [],
  });

  const debouncedProjectName = useDebounce(state.name?.trim() || null, 500);

  const { data: projectsData } = useProjects({
    project_name: debouncedProjectName ?? undefined,
  });

  const projectExists: boolean = debouncedProjectName
    ? (projectsData?.projects?.length ?? 0) > 0
    : false;

  const steps = useMemo<Array<WizardStep<NewProjectFormState>>>(
    () => [
      {
        id: "basics",
        title: "Project basics",
        description: "Name your project and preview the workspace.",
        isValid: (s) => Boolean(s.name?.trim()) && !projectExists,
        render: ({ state: s, setState: setS }) => (
          <ProjectBasicsStep
            name={s.name}
            setName={(name) => setS((prev) => ({ ...prev, name }))}
            type={s.type}
            projectExists={projectExists}
          />
        ),
      },
      {
        id: "type",
        title: "Project type",
        description: "Choose the workflow for your project.",
        isValid: (s) => Boolean(s.type),
        render: ({ state: s, setState: setS }) => (
          <ProjectTypeStep
            type={s.type}
            setType={(type) => setS((prev) => ({ ...prev, type }))}
          />
        ),
      },
      {
        id: "invites",
        title: "Invite members",
        description: "Add members and set their permissions.",
        isValid: () => true, // optional step (you can skip invites)
        render: ({ state: s, setState: setS }) => (
          <InviteMembersStep
            invites={s.invites}
            userEmails={
              user.user?.emailAddresses?.map((ea) => ea.emailAddress) || []
            }
            setInvites={(invites) => setS((prev) => ({ ...prev, invites }))}
          />
        ),
      },
    ],
    [user, projectExists],
  );

  const activeStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const canProceed = activeStep?.isValid(state) ?? false;

  const next = () => {
    if (!canProceed) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const back = () => {
    if (stepIndex === 0) {
      return router.back();
    }
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const finish = async () => {
    try {
      if (!canProceed || !state.name) return;
      await mutateProjects.mutateAsync({
        name: state.name,
        type: state.type!,
        invites: state.invites.map((i) => ({
          email: i.email,
          role: i.role,
        })),
      });
      router.push("/dashboard");
    } catch {
      toast.error("Failed to create project. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-10 lg:p-16 pb-24 sm:pb-28 flex flex-col">
      <div className="grow">
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6 border-b-2 pb-5">
            <div>
              <h1 className="text-2xl sm:text-4xl font-semibold">
                Create new project
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeStep?.description ?? ""}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline">
                Step {Math.min(stepIndex + 1, steps.length)} / {steps.length}
              </Badge>
              <Badge variant="secondary">{activeStep?.title ?? ""}</Badge>
            </div>
          </div>

          <div className="min-h-105">
            {activeStep?.render({ state, setState })}
          </div>
        </div>
      </div>

      {/* footer buttons - mobile-friendly sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-0 py-3 flex items-center gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={back}
            className="h-9 px-6 flex-1 sm:flex-none"
          >
            Back
          </Button>
          <Button
            onClick={isLastStep ? finish : next}
            disabled={!canProceed}
            className="h-9 px-6 flex-1 sm:flex-none"
          >
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectBasicsStep({
  name,
  setName,
  type,
  projectExists,
}: {
  name: string | null;
  setName: (value: string) => void;
  type: ProjectType | null;
  projectExists: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 sm:gap-4">
      <div className="flex-1 w-full flex flex-col">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="project-name"
              className="text-lg sm:text-2xl mb-2 sm:mb-3"
            >
              Project name
            </Label>
            <Input
              id="project-name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome project"
              className={cn(
                "text-base sm:text-lg h-11 sm:h-12",
                projectExists && name?.trim() && "border-red-500",
              )}
            />
            <p
              className={`text-sm text-red-500 ${projectExists && name?.trim() && "visible"} invisible`}
            >
              You have already created a project with the same name name.
            </p>
          </div>
        </div>
      </div>

      <ProjectPreview name={name ?? ""} type={type} />
    </div>
  );
}

function ProjectTypeStep({
  type,
  setType,
}: {
  type: ProjectType | null;
  setType: (value: ProjectType) => void;
}) {
  return (
    <div className="max-w-lg">
      <p className="mb-6 text-lg font-medium">Choose a project type</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card
          className={cn(
            "cursor-pointer p-4 sm:p-6",
            type === "SCRUM" && "ring-4 ring-primary",
          )}
          onClick={() => setType("SCRUM")}
        >
          <CardContent className="flex flex-col items-center gap-3">
            <RefreshCcw className="h-8 w-8" />
            <CardTitle className="text-lg">Scrum</CardTitle>
            <CardDescription className="text-center">
              Full scrum workflow with backlogs, sprints and more.
            </CardDescription>
          </CardContent>
        </Card>

        <Card
          className="opacity-50 cursor-not-allowed p-4 sm:p-6"
          onClick={() => {
            /* disabled for now */
          }}
        >
          <CardContent className="flex flex-col items-center gap-3">
            <Columns3 className="h-8 w-8" />
            <CardTitle className="text-lg">Kanban</CardTitle>
            <CardDescription className="text-center">
              Coming soon
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InviteMembersStep({
  invites,
  setInvites,
  userEmails,
}: {
  invites: InviteMember[];
  setInvites: (invites: InviteMember[]) => void;
  userEmails: string[];
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ProjectMemberRole>("VIEWER");
  const normalized = email.trim().toLowerCase();
  const canAdd = isValidEmail(normalized);
  const isDuplicate = invites.some((i) => i.email.toLowerCase() === normalized);
  const isCurrentUser = userEmails.some(
    (ue) => ue.toLowerCase() === normalized,
  );

  const add = () => {
    if (!canAdd || isDuplicate || isCurrentUser) return;
    setInvites([...invites, { email: normalized, role }]);
    setEmail("");
    setRole("VIEWER");
  };

  const remove = (emailToRemove: string) => {
    setInvites(invites.filter((i) => i.email !== emailToRemove));
  };

  const updateRole = (targetEmail: string, nextRole: ProjectMemberRole) => {
    setInvites(
      invites.map((i) =>
        i.email === targetEmail ? { ...i, role: nextRole } : i,
      ),
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl flex items-center justify-center sm:justify-start gap-2 mb-6">
        <Users className="h-5 w-5 text-muted-foreground" />
        <p className="text-lg font-medium">Invite members (optional)</p>
      </div>

      <div className="w-full max-w-3xl rounded-xl border border-border bg-card/50 p-4 sm:p-5 backdrop-blur">
        <div className="grid grid-cols-1 sm:grid-cols-12 items-end gap-3">
          <div className="sm:col-span-7">
            <Label htmlFor="invite-email" className="text-sm">
              Email
            </Label>
            <Input
              id="invite-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="members@company.com"
              className="h-10 w-full"
            />
          </div>

          <div className="sm:col-span-3">
            <Label className="text-sm">Permission</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as ProjectMemberRole)}
            >
              <SelectTrigger className="w-full h-10 data-[size=default]:h-10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_MEMBER_ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label className="text-sm opacity-0 select-none">Add</Label>
            <Button
              type="button"
              onClick={add}
              disabled={!canAdd || isDuplicate || isCurrentUser}
              className="h-10 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {email.trim().length === 0
            ? "Add one email at a time. You can invite more later."
            : !canAdd
              ? "Enter a valid email address."
              : isDuplicate
                ? "That email is already in the list."
                : isCurrentUser
                  ? "You can't invite yourself."
                  : "Looks good."}
        </div>

        <div className="mt-6">
          {invites.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No invites added yet.
            </div>
          ) : (
            <div className="space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.email}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {inv.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {PROJECT_MEMBER_ROLE_OPTIONS.find(
                        (o) => o.value === inv.role,
                      )?.helper ?? ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={inv.role}
                      onValueChange={(v) =>
                        updateRole(inv.email, v as ProjectMemberRole)
                      }
                    >
                      <SelectTrigger className="w-40 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_MEMBER_ROLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(inv.email)}
                      className="h-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectPreview({
  name,
  type,
}: {
  name: string;
  type: ProjectType | null;
}) {
  return (
    <div className="flex-1 w-full flex">
      {/* preview box responsive */}
      <div className="w-full">
        <div className="rounded-xl border border-border bg-card/50 p-3 sm:p-4 shadow-2xl backdrop-blur">
          {/* Window chrome */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 border-b border-border">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div className="flex-1 flex justify-center" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-muted" />
            </div>
          </div>

          {/* App layout preview */}
          <div className="flex gap-0">
            {/* Mini sidebar */}
            <div className="hidden md:flex flex-col w-48 border-r border-border pr-3 mr-3 gap-2">
              <div className="flex items-center gap-2 mb-2 ml-2">
                <Logo height={25} width={50} />
              </div>
              {[
                "Dashboard",
                "My Tasks",
                "Board",
                "Projects",
                "Team",
                "Calendar",
              ].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                    i === 3
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div className="h-3 w-3 rounded bg-current opacity-40" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Projects
                </span>
                <div className="mt-2 space-y-1">
                  {[
                    { name: "Marketing Site", color: "bg-blue-500" },
                    { name: "Mobile App", color: "bg-purple-500" },
                  ].map((project) => (
                    <div
                      key={project.name}
                      className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${project.color}`}
                      />
                      <span className="truncate">{project.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main board content */}
            <div className="flex-1 min-w-0">
              {/* Board header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {name || "Project Name"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {type ? type.toLowerCase() : "kanban"} board
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full bg-muted border-2 border-background"
                      />
                    ))}
                  </div>
                  <div className="h-7 w-20 rounded bg-primary/20 hidden sm:block" />
                </div>
              </div>

              {/* Board columns */}
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-1 px-1">
                {[
                  {
                    name: "To Do",
                    color: "bg-blue-500",
                    tasks: [
                      {
                        title: "Update landing page copy",
                        priority: "Medium",
                        assignee: true,
                      },
                      {
                        title: "Create social media assets",
                        priority: "Low",
                        assignee: true,
                      },
                    ],
                  },
                  {
                    name: "In Progress",
                    color: "bg-yellow-500",
                    tasks: [
                      {
                        title: "Implement dark mode",
                        priority: "High",
                        assignee: true,
                      },
                      {
                        title: "Fix mobile navigation",
                        priority: "Urgent",
                        assignee: true,
                      },
                    ],
                  },
                  {
                    name: "Review",
                    color: "bg-purple-500",
                    tasks: [
                      {
                        title: "API documentation",
                        priority: "Medium",
                        assignee: true,
                      },
                    ],
                  },
                  {
                    name: "Done",
                    color: "bg-green-500",
                    tasks: [
                      {
                        title: "Setup CI/CD pipeline",
                        priority: "High",
                        assignee: true,
                      },
                      {
                        title: "Database schema design",
                        priority: "High",
                        assignee: true,
                      },
                    ],
                  },
                ].map((column) => (
                  <div
                    key={column.name}
                    className="min-w-40 sm:min-w-45 flex-1"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${column.color}`}
                        />
                        <span className="text-xs font-medium text-foreground">
                          {column.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
                        {column.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {column.tasks.map((task, j) => (
                        <div
                          key={j}
                          className="rounded-lg border border-border bg-background p-2.5 hover:border-primary/50 transition-colors cursor-pointer"
                        >
                          <p className="text-xs font-medium text-foreground mb-2 line-clamp-2">
                            {task.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                task.priority === "Urgent"
                                  ? "bg-red-500/20 text-red-400"
                                  : task.priority === "High"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : task.priority === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <div className="h-5 w-5 rounded-full bg-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
