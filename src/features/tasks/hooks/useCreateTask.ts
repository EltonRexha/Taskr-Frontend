"use client";

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { taskApi } from "../api/tasks.api";
import { TaskDto, CreateTaskRequest, TaskStatus } from "../types/tasks.types";
import { toast } from "sonner";

interface TasksResponse {
  tasks: TaskDto[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const tasksQueryKeys = {
  all: ["tasks"] as const,
  list: (stringifiedQuery: string) => ["tasks", stringifiedQuery] as const,
};

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskApi.createTask(data),
    onMutate: async (newTaskData) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKeys.all });

      const previousQueries = new Map();
      const matchingQueries: Array<readonly unknown[]> = [];

      queryClient
        .getQueriesData<InfiniteData<TasksResponse>>({
          queryKey: tasksQueryKeys.all,
        })
        .forEach(([queryKey, data]) => {
          previousQueries.set(queryKey, data);
          const queryStr = JSON.stringify(queryKey);
          if (queryStr.includes(projectId)) {
            matchingQueries.push(queryKey);
          }
        });

      const optimisticTask: TaskDto = {
        id: `temp-${Date.now()}`,
        title: newTaskData.title,
        description: newTaskData.description,
        label: newTaskData.label,
        priority: newTaskData.priority,
        project: { id: projectId, name: "" },
        startDate: newTaskData.startDate,
        dueDate: newTaskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: [],
        metaData: {
          id: `temp-meta-${Date.now()}`,
          status: (newTaskData.status as TaskStatus) || "TODO",
          type: "SCRUM",
        },
      };

      matchingQueries.forEach((queryKey) => {
        queryClient.setQueryData<InfiniteData<TasksResponse>>(
          queryKey,
          (old) => {
            if (!old) return old;
            const firstPage = old.pages[0];
            if (!firstPage) return old;

            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  tasks: [optimisticTask, ...firstPage.tasks],
                  metadata: {
                    ...firstPage.metadata,
                    total: firstPage.metadata.total + 1,
                  },
                },
                ...old.pages.slice(1),
              ],
            };
          },
        );
      });

      return { previousQueries, optimisticTaskId: optimisticTask.id };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to create task. Please try again.");
    },
    onSuccess: (newTask, _variables, context) => {
      queryClient.setQueriesData<InfiniteData<TasksResponse>>(
        { queryKey: tasksQueryKeys.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              tasks: page.tasks.map((task) =>
                task.id === context?.optimisticTaskId ? newTask : task,
              ),
            })),
          };
        },
      );
      toast.success("Task created successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKeys.all });
    },
  });
}
