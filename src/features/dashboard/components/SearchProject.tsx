"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";

export function SearchProject() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectNameParam = searchParams.get("projectName") ?? "";

  const [query, setQuery] = useState(projectNameParam);
  const debouncedQuery = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(projectNameParam);
  }, [projectNameParam]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentParam = params.get("projectName") ?? "";

    if (debouncedQuery !== currentParam) {
      if (debouncedQuery) {
        params.set("projectName", debouncedQuery);
      } else {
        params.delete("projectName");
      }
      const newUrl =
        params.size > 0 ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl);
    }
  }, [debouncedQuery, router, searchParams]);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative px-3 py-3 shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          placeholder="Search projects..."
          className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-9 pr-7 text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-border"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
    </div>
  );
}
