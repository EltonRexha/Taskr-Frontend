"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { components } from "@/api/types";

type CreateTaskDto = components["schemas"]["CreateTaskDto"];
type CreateTaskFormData = CreateTaskDto & { sprintId: string };

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

  const { data: sprintsData, isLoading: isLoadingSprints } =
    useActiveSprints(projectId);
  const sprints = sprintsData?.sprints ?? [];
  const hasSprints = sprints.length > 0;
  const sprintInitialized = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      label: "TASK",
      priority: "MEDIUM",
      status: defaultStatus,
      startDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(), "yyyy-MM-dd"),
      sprintId: "",
      projectId,
    },
  });

  useEffect(() => {
    if (sprints.length > 0 && !sprintInitialized.current) {
      sprintInitialized.current = true;
      setValue("sprintId", sprints[0].id);
    }
  }, [sprints, setValue]);

  // Update status when modal opens with new defaultStatus
  useEffect(() => {
    if (isOpen) {
      setValue("status", defaultStatus);
    }
  }, [isOpen, defaultStatus, setValue]);

  const onSubmit = async (data: CreateTaskFormData) => {
    await createTask.mutateAsync(data);
    onClose();
    reset({
      title: "",
      description: "",
      label: "TASK",
      priority: "MEDIUM",
      status: defaultStatus,
      startDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(), "yyyy-MM-dd"),
      sprintId: sprints[0]?.id ?? "",
      projectId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    You need to create a sprint first before you can add tasks
                    to this project.
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
                {...register("title", { required: "Title is required" })}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Enter task description"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Controller
                  name="label"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="label">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_LABELS.map((label) => (
                          <SelectItem key={label.value} value={label.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${label.color}`}
                              />
                              {label.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                          >
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
                  )}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sprint">Sprint *</Label>
              <Controller
                name="sprintId"
                control={control}
                rules={{ required: "Please select a sprint" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!hasSprints || isLoadingSprints}
                  >
                    <SelectTrigger id="sprint">
                      <SelectValue
                        placeholder={
                          isLoadingSprints
                            ? "Loading sprints..."
                            : "Select a sprint"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sprintId && (
                <p className="text-red-500 text-sm">
                  {errors.sprintId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate", { required: true })}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate", { required: true })}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm">Required</p>
                )}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
