"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FindOneProjectResponse } from "../types/projects.types";
import { getProjectColorByType } from "../libs/getProjectColorByType";

interface ProjectHeaderProps {
  project: FindOneProjectResponse;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const pathname = usePathname();

  const basePath = `/dashboard/projects/${project.id}`;

  const tabs =
    project.projectType === "KANBAN"
      ? [
          { value: "board", label: "Board", href: basePath },
          { value: "backlog", label: "Backlog", href: `${basePath}/backlog` },
          {
            value: "timeline",
            label: "Timeline",
            href: `${basePath}/timeline`,
          },
          { value: "reports", label: "Reports", href: `${basePath}/reports` },
          {
            value: "settings",
            label: "Settings",
            href: `${basePath}/settings`,
          },
        ]
      : [
          { value: "board", label: "Board", href: basePath },
          { value: "backlog", label: "Backlog", href: `${basePath}/backlog` },
          { value: "sprints", label: "Sprints", href: `${basePath}/sprints` },
          {
            value: "timeline",
            label: "Timeline",
            href: `${basePath}/timeline`,
          },
          { value: "reports", label: "Reports", href: `${basePath}/reports` },
          {
            value: "settings",
            label: "Settings",
            href: `${basePath}/settings`,
          },
        ];

  const getCurrentTab = () => {
    if (pathname === basePath) return "board";
    const segment = pathname.split("/").pop();
    return segment || "board";
  };

  return (
    <div className="border-b border-border bg-background">
      {/* Top section */}
      <div className="px-8 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{
                backgroundColor: `${getProjectColorByType(project.projectType)}20`,
              }}
            ></div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {project.name}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {project.projectType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {/* {project.members.slice(0, 4).map((member) => (
                <Avatar
                  key={member.id}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                  />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))} */}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-transparent"
            >
              <Users className="mr-2 h-4 w-4" />
              Invite
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs and filters */}
      <div className="px-8 flex items-center justify-between">
        <Tabs value={getCurrentTab()}>
          <TabsList className="bg-transparent border-none h-auto p-0 gap-0">
            {tabs.map((tab) => (
              <Link key={tab.value} href={tab.href}>
                <TabsTrigger
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                >
                  {tab.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-48 bg-secondary border-border pl-9 h-8 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-border h-8 bg-transparent"
          >
            <Filter className="mr-2 h-3 w-3" />
            Filter
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground h-8">
            <Plus className="mr-2 h-3 w-3" />
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}
