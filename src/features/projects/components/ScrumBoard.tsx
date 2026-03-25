"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { TaskDto, TaskStatus } from "@/features/tasks/types/tasks.types";

interface ScrumBoardProps {
  projectId: string;
}

// Fetch all tasks in one go — pagination handled by the infinite query internally
const TASK_LIMIT = 1000;

// API status values are uppercase
const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "TODO", label: "To Do", color: "bg-blue-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-yellow-500" },
  { id: "IN_REVIEW", label: "In Review", color: "bg-purple-500" },
  { id: "DONE", label: "Done", color: "bg-green-500" },
];

const ALL_ZONE_IDS: TaskStatus[] = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTaskStatus(task: TaskDto): TaskStatus | null {
  return task.metaData?.status ?? null;
}

// Pull the first assigned user's display name and avatar
function getAssignee(task: TaskDto) {
  const first = task.assignedTo?.[0]?.user;
  if (!first) return null;
  const name = [first.firstName, first.lastName].filter(Boolean).join(" ");
  return { name, avatar: first.profileImage };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ─── SortableTaskItem ─────────────────────────────────────────────────────────

interface SortableTaskProps {
  task: TaskDto;
  isDragging: boolean;
  compact?: boolean;
}

function SortableTaskItem({
  task,
  isDragging,
  compact = false,
}: SortableTaskProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: task.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const assignee = getAssignee(task);

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
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[80%]">
            {task.label || task.id.slice(0, 8)}
          </span>
          <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        <h4 className="text-xs font-medium text-foreground line-clamp-2 mb-2">
          {task.title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground capitalize">
            {task.priority?.toLowerCase()}
          </span>
          {assignee && (
            <Avatar className="h-5 w-5">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback className="text-xs">
                {getInitials(assignee.name)}
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
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[75%]">
          {task.label || task.id.slice(0, 8)}
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
        <span className="text-xs text-muted-foreground capitalize">
          {task.priority?.toLowerCase()}
        </span>
        {assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback className="text-xs">
              {getInitials(assignee.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

// ─── DroppableColumn ──────────────────────────────────────────────────────────

interface DroppableColumnProps {
  id: TaskStatus;
  label: string;
  color: string;
  tasks: TaskDto[];
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
          "space-y-3 min-h-64 rounded-lg bg-secondary/30 p-2 transition-colors",
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

// ─── BacklogSection ───────────────────────────────────────────────────────────

interface BacklogSectionProps {
  tasks: TaskDto[];
  isDraggingOver: boolean;
  activeId: string | null;
}

function BacklogSection({
  tasks,
  isDraggingOver,
  activeId,
}: BacklogSectionProps) {
  const { setNodeRef } = useDroppable({ id: "BACKLOG" });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-8 border-t border-border pt-6">
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
        </button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

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

// ─── TaskDragOverlay ──────────────────────────────────────────────────────────

function TaskDragOverlay({ task }: { task: TaskDto | null }) {
  if (!task) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg opacity-90 pointer-events-none max-w-xs">
      <span className="text-xs text-muted-foreground font-mono block mb-2">
        {task.label || task.id.slice(0, 8)}
      </span>
      <h4 className="text-sm font-medium text-foreground line-clamp-2">
        {task.title}
      </h4>
    </div>
  );
}

// ─── ScrumBoard (root) ────────────────────────────────────────────────────────

function emptyBoard(): Record<TaskStatus, TaskDto[]> {
  return { BACKLOG: [], TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] };
}

export function ScrumBoard({ projectId }: ScrumBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [tasksByStatus, setTasksByStatus] =
    useState<Record<TaskStatus, TaskDto[]>>(emptyBoard);

  const { data, isLoading, isError } = useTasks({
    project_id: projectId,
    limit: TASK_LIMIT,
  });

  // Sync server data into local drag-and-drop state whenever the query result changes.
  // Local moves are reflected immediately; this effect re-syncs if the server data refreshes.
  useEffect(() => {
    if (!data?.tasks) return;
    const grouped = emptyBoard();
    data.tasks.forEach((task) => {
      const status = getTaskStatus(task);
      if (status) grouped[status].push(task);
    });
    setTasksByStatus(grouped);
  }, [data?.tasks]);

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

    const overZone = ALL_ZONE_IDS.find((id) => id === over.id);
    if (overZone) {
      setDragOverColumn(overZone);
      return;
    }

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
    if (!sourceStatus || sourceIndex === -1) return;

    // Find target
    let targetStatus: TaskStatus | null = null;
    let targetIndex = -1;
    const overZone = ALL_ZONE_IDS.find((id) => id === over.id);
    if (overZone) {
      targetStatus = overZone;
      targetIndex = tasksByStatus[targetStatus]?.length ?? 0;
    } else {
      for (const [status, tasks] of Object.entries(tasksByStatus)) {
        const index = tasks.findIndex((t) => t.id === over.id);
        if (index !== -1) {
          targetStatus = status as TaskStatus;
          targetIndex = index;
          break;
        }
      }
    }
    if (!targetStatus || targetIndex === -1) return;

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
          // status lives inside metaData — update it there
          const updatedMoved: TaskDto = {
            ...moved,
            metaData: moved.metaData
              ? { ...moved.metaData, status: targetStatus! }
              : undefined,
          };
          tgtArr.splice(targetIndex, 0, updatedMoved);
        }
        next[sourceStatus!] = srcArr;
        next[targetStatus!] = tgtArr;
      }
      return next;
    });

    // TODO: call your PATCH /tasks/:id endpoint here to persist the status change
    // e.g. taskApi.updateTask(active.id as string, { status: targetStatus })
  };

  // Find the task currently being dragged from live state
  let activeDraggedTask: TaskDto | undefined;
  if (activeId) {
    for (const tasks of Object.values(tasksByStatus)) {
      const found = tasks.find((t) => t.id === activeId);
      if (found) {
        activeDraggedTask = found;
        break;
      }
    }
  }

  const allDraggableIds = [
    ...Object.values(tasksByStatus)
      .flat()
      .map((t) => t.id),
    ...ALL_ZONE_IDS,
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading board…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-destructive">
          Failed to load tasks. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
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

          {/* Backlog strip */}
          <BacklogSection
            tasks={tasksByStatus.BACKLOG ?? []}
            isDraggingOver={dragOverColumn === "BACKLOG"}
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
