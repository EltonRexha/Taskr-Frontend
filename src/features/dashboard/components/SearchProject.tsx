"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Clock,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useProjects } from "@/features/projects/hooks/useProjects";
import ProjectIcon from "@/features/projects/components/ProjectIcon";
import { getProjectColorByType } from "@/features/projects/libs/getProjectColorByType";
import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import { RecentSearches } from "@/types/RecentSearches";
import { useSearchParams, useRouter } from "next/navigation"; // ← add

const popularSearches = ["homepage", "API", "dashboard", "settings"];

export function SearchProject() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectNameParam = searchParams.get("projectName") ?? "";

  const [query, setQuery] = useState(projectNameParam); // ← init from URL
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const [recentSearches, saveRecentSearches] = useLocalStorage<
    RecentSearches[]
  >("recentSearches", []);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input if the URL param changes (e.g. back/forward navigation)
  useEffect(() => {
    setQuery(projectNameParam);
  }, [projectNameParam]);

  const { data: projectsData, isLoading } = useProjects({
    project_name_like: debouncedQuery,
  });

  const projects = projectsData?.projects;
  const totalResults = projects?.length || 0;

  useEffect(() => {
    if (!projectsData?.projects?.length) return;
    saveRecentSearches(
      projectsData.projects.map(
        (project) =>
          ({ query: project.name, type: "project" }) as RecentSearches,
      ),
    );
  }, [projectsData, saveRecentSearches]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
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
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedIndex(-1);
    // Strip projectName from URL, keep all other params intact
    const params = new URLSearchParams(searchParams.toString());
    params.delete("projectName");
    const newUrl =
      params.size > 0 ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative px-3 py-3 shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          placeholder="Search projects..."
          className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-9 pr-7 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-border"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query.length > 0 && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-3 right-3 top-full mt-1 rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden">
          {debouncedQuery.length === 0 ? (
            <div className="p-3 space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    Recent
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((search) => {
                      if (search.type !== "project") return null;
                      return (
                        <button
                          key={search.query}
                          onClick={() => {
                            setQuery(search.query);
                            setIsOpen(true);
                          }}
                          className="px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {search.query}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
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
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Searching...
            </div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </div>
          ) : (
            <div className="p-1.5">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Projects
              </p>
              {projects?.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/dashboard?projectName=${encodeURIComponent(project.name)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-secondary/50 transition-colors",
                    selectedIndex === index && "bg-secondary/50",
                  )}
                >
                  <div
                    className="h-6 w-6 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: getProjectColorByType(
                        project.projectType,
                      ),
                    }}
                  >
                    <ProjectIcon type={project.projectType} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {project.projectType}
                    </p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
