"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StaggeredCards } from "@/components/StaggeredCards";
import { useUser } from "@clerk/nextjs";
import Logo from "@/components/Logo";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const { isSignedIn } = useUser();

  const copyCommand = () => {
    navigator.clipboard.writeText("npx create-taskr-app@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 overflow-hidden"
      id="Home"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <StaggeredCards className="mx-auto max-w-6xl" duration={0.2}>
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-primary">
            <Github className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>100% Open Source</span>
            <span className="hidden sm:inline text-primary/60">|</span>
            <span className="hidden sm:inline">MIT Licensed</span>
          </div>
        </div>

        {/* Heading */}
        <StaggeredCards className="text-center" duration={0.1}>
          <h1 className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            Open source project
            <br />
            <span className="text-primary">management for teams</span>
          </h1>

          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Taskr is a free, self-hostable alternative to Jira. Full Kanban and
            Scrum support with powerful features your team will actually love.
            Own your data, forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
            {isSignedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 h-12 text-base"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 h-12 text-base"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}

            <a
              href="https://github.com/taskr/taskr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary px-6 sm:px-8 bg-transparent h-12 text-base"
              >
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Button>
            </a>
          </div>

          <div className="flex justify-center mb-8 sm:mb-12 px-4">
            <div
              onClick={copyCommand}
              className="inline-flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2.5 cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <code className="text-sm text-foreground font-mono">
                npx create-taskr-app@latest
              </code>
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </div>
          </div>
        </StaggeredCards>

        <motion.div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-border bg-card/50 p-3 sm:p-4 shadow-2xl backdrop-blur">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 border-b border-border">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="flex-1 flex justify-center"></div>
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
                    <h3 className="text-sm font-semibold text-foreground">
                      Marketing Site
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Kanban Board
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
        </motion.div>
      </StaggeredCards>
    </section>
  );
}
