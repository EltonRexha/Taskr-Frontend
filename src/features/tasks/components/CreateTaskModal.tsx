"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "../hooks/useCreateTask";
import { TaskStatus } from "../types/tasks.types";
import { format } from "date-fns";
import { useActiveSprints } from "@/features/projects/hooks/useSprints";
import { AlertCircle } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultStatus?: TaskStatus;
}

const TASK_LABELS = [
  { value: "BUG", label: "Bug", color: "bg-red-500" },
  { value: "FEATURE", label: "Feature", color: "bg-blue-500" },
  { value: "TASK", label: "Task", color: "bg-gray-500" },
  { value: "REFACTOR", label: "Refactor", color: "bg-purple-500" },
  { value: "CHORE", label: "Chore", color: "bg-orange-500" },
  { value: "SPIKE", label: "Spike", color: "bg-pink-500" },
  { value: "TECH_DEBT", label: "Tech Debt", color: "bg-yellow-500" },
] as const;

const TASK_PRIORITIES = [
  { value: "LOW", label: "Low", color: "bg-green-500" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-500" },
  { value: "HIGH", label: "High", color: "bg-orange-500" },
  { value: "URGENT", label: "Urgent", color: "bg-red-500" },
] as const;

const TASK_STATUSES = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "DONE", label: "Done" },
] as const;

export function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  defaultStatus = "TODO",
}: CreateTaskModalProps) {
  const createTask = useCreateTask(projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: sprintsData, isLoading: isLoadingSprints } = useActiveSprints(projectId);
  const sprints = sprintsData?.sprints ?? [];
  const hasSprints = sprints.length > 0;
  const sprintInitialized = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    label: "TASK" as const,
    priority: "MEDIUM" as const,
    status: defaultStatus,
    startDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    sprintId: "",
  });

  useEffect(() => {
    if (sprints.length > 0 && !sprintInitialized.current) {
      sprintInitialized.current = true;
      setFormData((prev) => ({ ...prev, sprintId: sprints[0].id }));
    }
  }, [sprints]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.sprintId) return;

    setIsSubmitting(true);
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        label: formData.label,
        priority: formData.priority,
        projectId,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        status: formData.status,
        sprintId: formData.sprintId,
      });
      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        label: "TASK",
        priority: "MEDIUM",
        status: defaultStatus,
        startDate: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        sprintId: sprints[0]?.id ?? "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your project. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          {!hasSprints && !isLoadingSprints && (
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">No active sprints found</p>
                  <p className="text-xs mt-1">
                    You need to create a sprint first before you can add tasks to this project.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter task description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Select
                  value={formData.label}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      label: value as typeof prev.label,
                    }))
                  }
                >
                  <SelectTrigger id="label">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_LABELS.map((label) => (
                      <SelectItem key={label.value} value={label.value}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${label.color}`} />
                          {label.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as typeof prev.priority,
                    }))
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${priority.color}`}
                          />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as TaskStatus,
                  }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sprint">Sprint *</Label>
              <Select
                value={formData.sprintId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, sprintId: value }))
                }
                disabled={!hasSprints || isLoadingSprints}
              >
                <SelectTrigger id="sprint">
                  <SelectValue placeholder={isLoadingSprints ? "Loading sprints..." : "Select a sprint"} />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim() || !formData.sprintId}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
