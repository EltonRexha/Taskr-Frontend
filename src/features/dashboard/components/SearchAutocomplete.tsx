"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const priorityColors = {
  low: "bg-gray-500/10 text-gray-400",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

//Mock data
const projects = [
  {
    name: "Project 1",
    key: "project-1",
    type: "Software",
    color: "#FF0000",
    icon: "🚀",
    id: "project-1",
  },
];

const tasks = [
  {
    title: "Task 1",
    key: "task-1",
    projectName: "Project 1",
    labels: ["Label 1", "Label 2"],
    priority: "high",
    dueDate: "2022-01-01",
    id: "task-1",
  },
];

const recentSearches = ["authentication", "mobile app", "navigation", "sprint"];
const popularSearches = ["homepage", "API", "dashboard", "settings"];

export function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTasks =
    query.length > 0
      ? tasks
          .filter(
            (task) =>
              task.title.toLowerCase().includes(query.toLowerCase()) ||
              task.key.toLowerCase().includes(query.toLowerCase()) ||
              task.labels.some((label) =>
                label.toLowerCase().includes(query.toLowerCase()),
              ),
          )
          .slice(0, 5)
      : [];

  const filteredProjects =
    query.length > 0
      ? projects
          .filter(
            (project) =>
              project.name.toLowerCase().includes(query.toLowerCase()) ||
              project.key.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 2)
      : [];

  const totalResults = filteredTasks.length + filteredProjects.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        placeholder="Search tasks, projects..."
        className="w-48 md:w-64 lg:w-80 bg-secondary border-border pl-10 pr-4 h-10"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden"
        >
          {query.length === 0 ? (
            <div className="p-3">
              <div className="mb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setQuery(search);
                        setIsOpen(true);
                      }}
                      className="px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <TrendingUp className="h-3 w-3" />
                  Popular
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setQuery(search);
                        setIsOpen(true);
                      }}
                      className="px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for {query}
            </div>
          ) : (
            <>
              {filteredProjects.length > 0 && (
                <div className="p-2 border-b border-border">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    Projects
                  </div>
                  {filteredProjects.map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 transition-colors",
                        selectedIndex === index && "bg-secondary/50",
                      )}
                    >
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: project.color + "20",
                          color: project.color,
                        }}
                      >
                        {project.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {project.type} Project
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
              {filteredTasks.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                    Tasks
                  </div>
                  {filteredTasks.map((task, index) => (
                    <Link
                      key={task.id}
                      href={`/dashboard/tasks?task=${task.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 transition-colors",
                        selectedIndex === filteredProjects.length + index &&
                          "bg-secondary/50",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            {task.key}
                          </span>
                          <p className="text-sm font-medium text-foreground truncate">
                            {task.title}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {task.projectName}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          priorityColors[
                            task.priority as keyof typeof priorityColors
                          ],
                        )}
                      >
                        {task.priority}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
              <div className="border-t border-border p-2">
                <Link
                  href={`/dashboard/tasks?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center justify-center gap-2 px-2 py-2 text-sm text-primary hover:underline"
                >
                  See all results for {query}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
