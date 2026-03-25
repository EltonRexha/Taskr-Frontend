"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  rectIntersection,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import {
  type Task,
  type TaskStatus,
  type TaskOrderUpdate,
  getTasksBySprint,
  getActiveSprint,
  saveTaskOrder,
  getBacklogTasks,
} from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  GripVertical,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrumBoardProps {
  projectId: string;
}

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-blue-500" },
  { id: "in-progress", label: "In Progress", color: "bg-yellow-500" },
  { id: "review", label: "In Review", color: "bg-purple-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
];

// Every valid drop zone — columns + backlog
const ALL_ZONE_IDS: TaskStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "done",
];

// ─── SortableTaskItem ─────────────────────────────────────────────────────────

interface SortableTaskProps {
  task: Task;
  isDragging: boolean;
  compact?: boolean; // compact = smaller horizontal card used in the backlog strip
}

function SortableTaskItem({
  task,
  isDragging,
  compact = false,
}: SortableTaskProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "group shrink-0 w-52 rounded-lg border border-border bg-card p-3 cursor-grab active:cursor-grabbing",
          "hover:border-primary/50 transition-all hover:shadow-md",
          isDragging && "opacity-50 shadow-lg",
        )}
      >
        <div className="flex items-start justify-between mb-1.5">
          <span className="text-xs text-muted-foreground font-mono">
            {task.key}
          </span>
          <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h4 className="text-xs font-medium text-foreground line-clamp-2 mb-2">
          {task.title}
        </h4>
        <div className="flex items-center justify-between">
          {task.storyPoints && (
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary text-xs h-4 px-1.5"
            >
              {task.storyPoints} SP
            </Badge>
          )}
          {task.assignee && (
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={task.assignee.avatar || "/placeholder.svg"}
                alt={task.assignee.name}
              />
              <AvatarFallback className="text-xs">
                {task.assignee.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group rounded-lg border border-border bg-card p-3 cursor-grab active:cursor-grabbing",
        "hover:border-primary/50 transition-all hover:shadow-md",
        isDragging && "opacity-50 shadow-lg",
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-muted-foreground font-mono">
          {task.key}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <h4 className="text-sm font-medium text-foreground mb-3 line-clamp-2">
        {task.title}
      </h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.storyPoints && (
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary text-xs"
            >
              {task.storyPoints} SP
            </Badge>
          )}
        </div>
        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={task.assignee.avatar || "/placeholder.svg"}
              alt={task.assignee.name}
            />
            <AvatarFallback className="text-xs">
              {task.assignee.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  id: TaskStatus;
  label: string;
  color: string;
  tasks: Task[];
  isDraggingOver: boolean;
  activeId: string | null;
}

function DroppableColumn({
  id,
  label,
  color,
  tasks,
  isDraggingOver,
  activeId,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="shrink-0 w-72">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground rounded-full bg-secondary px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "space-y-3 min-h-50 rounded-lg bg-secondary/30 p-2 transition-colors",
          isDraggingOver && "bg-primary/10",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              isDragging={activeId === task.id}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface BacklogSectionProps {
  tasks: Task[];
  isDraggingOver: boolean;
  activeId: string | null;
}

function BacklogSection({
  tasks,
  isDraggingOver,
  activeId,
}: BacklogSectionProps) {
  const { setNodeRef } = useDroppable({ id: "backlog" });
  const [collapsed, setCollapsed] = useState(false);

  const backlogPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);

  return (
    <div className="mt-8 border-t border-border pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-semibold text-foreground">Backlog</span>
          <span className="text-xs text-muted-foreground rounded-full bg-secondary px-2 py-0.5">
            {tasks.length}
          </span>
          {backlogPoints > 0 && (
            <span className="text-xs text-muted-foreground">
              · {backlogPoints} pts
            </span>
          )}
        </button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/*
        Drop zone is only rendered when expanded. The ref is attached here so
        dropping onto the empty-state placeholder or the card strip both register
        as a drop on the "backlog" zone.
      */}
      {!collapsed && (
        <div
          ref={setNodeRef}
          className={cn(
            "rounded-lg border-2 border-dashed border-border p-3 transition-colors min-h-24",
            isDraggingOver
              ? "border-primary/50 bg-primary/5"
              : tasks.length > 0
                ? "border-transparent bg-secondary/30"
                : "bg-secondary/10",
          )}
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-16">
              <p className="text-sm text-muted-foreground">
                Drag tasks here to send them back to the backlog
              </p>
            </div>
          ) : (
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {/* Horizontally scrollable strip of compact cards */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {tasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    isDragging={activeId === task.id}
                    compact
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

function TaskDragOverlay({ task }: { task: Task | null }) {
  if (!task) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg opacity-90 pointer-events-none max-w-xs">
      <span className="text-xs text-muted-foreground font-mono block mb-2">
        {task.key}
      </span>
      <h4 className="text-sm font-medium text-foreground line-clamp-2">
        {task.title}
      </h4>
    </div>
  );
}

export function ScrumBoard({ projectId }: ScrumBoardProps) {
  const activeSprint = getActiveSprint(projectId);
  // sprintTasks = flat mocked Task[]. All tasks start with status: "backlog".
  const sprintTasks = activeSprint ? getTasksBySprint(activeSprint.id) : [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const backlogTasks = getBacklogTasks(projectId);

  const [tasksByStatus, setTasksByStatus] = useState<
    Record<TaskStatus, Task[]>
  >(() => {
    // Start every bucket empty, then distribute by each task's actual status.
    // With mocked data where all tasks are status:"backlog", they all land here.
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: backlogTasks,
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    sprintTasks.forEach((task: Task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setDragOverColumn(null);
      return;
    }
    // Cursor directly over a zone (column or backlog)?
    const overZone = ALL_ZONE_IDS.find((id) => id === over.id);
    if (overZone) {
      setDragOverColumn(overZone);
      return;
    }
    // Cursor over a task — find which zone owns it
    for (const [status, tasks] of Object.entries(tasksByStatus)) {
      if (tasks.some((t) => t.id === over.id)) {
        setDragOverColumn(status as TaskStatus);
        return;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverColumn(null);

    if (!over || active.id === over.id) return;

    // Find source
    let sourceStatus: TaskStatus | null = null;
    let sourceIndex = -1;
    for (const [status, tasks] of Object.entries(tasksByStatus)) {
      const index = tasks.findIndex((t) => t.id === active.id);
      if (index !== -1) {
        sourceStatus = status as TaskStatus;
        sourceIndex = index;
        break;
      }
    }
    if (sourceStatus === null || sourceIndex === -1) return;

    // Find target
    let targetStatus: TaskStatus | null = null;
    let targetIndex = -1;
    const overZone = ALL_ZONE_IDS.find((id) => id === over.id);
    if (overZone) {
      // Dropped onto empty zone space → append
      targetStatus = overZone;
      targetIndex = tasksByStatus[targetStatus]?.length ?? 0;
    } else {
      // Dropped onto another task → insert at that position
      for (const [status, tasks] of Object.entries(tasksByStatus)) {
        const index = tasks.findIndex((t) => t.id === over.id);
        if (index !== -1) {
          targetStatus = status as TaskStatus;
          targetIndex = index;
          break;
        }
      }
    }
    if (targetStatus === null || targetIndex === -1) return;

    setTasksByStatus((prev) => {
      const next = { ...prev };
      if (sourceStatus === targetStatus) {
        next[sourceStatus] = arrayMove(
          next[sourceStatus],
          sourceIndex,
          targetIndex,
        );
      } else {
        const srcArr = [...next[sourceStatus!]];
        const tgtArr = [...next[targetStatus!]];
        const [moved] = srcArr.splice(sourceIndex, 1);
        if (moved) {
          moved.status = targetStatus!;
          tgtArr.splice(targetIndex, 0, moved);
        }
        next[sourceStatus!] = srcArr;
        next[targetStatus!] = tgtArr;
      }
      return next;
    });

    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const updates: TaskOrderUpdate[] = [];
      Object.entries(tasksByStatus).forEach(([status, tasks]) => {
        tasks.forEach((task, index) => {
          updates.push({
            taskId: task.id,
            status: status as TaskStatus,
            order: index,
          });
        });
      });
      await saveTaskOrder(updates);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const totalPoints = [
    ...tasksByStatus.todo,
    ...tasksByStatus["in-progress"],
    ...tasksByStatus.review,
    ...tasksByStatus.done,
  ].reduce((sum, t) => sum + (t.storyPoints || 0), 0);

  const completedPoints = tasksByStatus.done.reduce(
    (sum, t) => sum + (t.storyPoints || 0),
    0,
  );

  // Look up the dragged task from live state
  let activeDraggedTask: Task | undefined;
  if (activeId) {
    for (const tasks of Object.values(tasksByStatus)) {
      const found = tasks.find((t) => t.id === activeId);
      if (found) {
        activeDraggedTask = found;
        break;
      }
    }
  }

  if (!activeSprint) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No active sprint</p>
          <Button className="bg-primary text-primary-foreground">
            Start Sprint
          </Button>
        </div>
      </div>
    );
  }

  const allDraggableIds = [
    ...sprintTasks.map((t) => t.id),
    ...(tasksByStatus.backlog ?? []).map((t) => t.id),
    ...ALL_ZONE_IDS,
  ];

  return (
    <div className="p-6">
      {/* Sprint Info Bar */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-secondary/50 p-4">
        <div>
          <h3 className="font-semibold text-foreground">{activeSprint.name}</h3>
          <p className="text-sm text-muted-foreground">{activeSprint.goal}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {completedPoints}/{totalPoints}
            </p>
            <p className="text-xs text-muted-foreground">Story Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {tasksByStatus.done.length}
            </p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          <div className="h-8 w-32">
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPoints > 0
                ? Math.round((completedPoints / totalPoints) * 100)
                : 0}
              % complete
            </p>
          </div>
          {hasChanges && (
            <Button
              onClick={handleSaveOrder}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Order"}
            </Button>
          )}
        </div>
      </div>

      {/*
        One DndContext wraps BOTH the board columns and the backlog so
        dragging across the boundary works seamlessly.
      */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allDraggableIds}
          strategy={verticalListSortingStrategy}
        >
          {/* Board columns */}
          <div className="flex gap-4 overflow-x-auto min-h-64">
            {columns.map((column) => (
              <DroppableColumn
                key={column.id}
                id={column.id}
                label={column.label}
                color={column.color}
                tasks={tasksByStatus[column.id] ?? []}
                isDraggingOver={dragOverColumn === column.id}
                activeId={activeId}
              />
            ))}
          </div>

          <BacklogSection
            tasks={tasksByStatus.backlog ?? []}
            isDraggingOver={dragOverColumn === "backlog"}
            activeId={activeId}
          />
        </SortableContext>

        <DragOverlay>
          <TaskDragOverlay task={activeDraggedTask ?? null} />
        </DragOverlay>
      </DndContext>
    </div>
  );
}
