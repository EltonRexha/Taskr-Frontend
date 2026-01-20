"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, Terminal, Cloud, Container } from "lucide-react";
import { StaggeredCards } from "@/components/StaggeredCards";

const deployOptions = [
  {
    name: "Vercel",
    description: "One-click deploy with automatic CI/CD",
    icon: Cloud,
    command: null,
    url: "https://vercel.com/new/clone?repository-url=https://github.com/taskr/taskr",
    recommended: true,
  },
  {
    name: "Docker",
    description: "Self-host anywhere with Docker Compose",
    icon: Container,
    command: "docker compose up -d",
    url: null,
    recommended: false,
  },
];

const quickStartSteps = [
  {
    step: 1,
    command: "git clone https://github.com/taskr/taskr.git",
    label: "Clone the repository",
  },
  {
    step: 2,
    command: "cd taskr && npm install",
    label: "Install dependencies",
  },
  {
    step: 3,
    command: "cp .env.example .env.local",
    label: "Configure environment",
  },
  { step: 4, command: "npm run dev", label: "Start development server" },
];

export function Deploy() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <section id="deploy" className="py-16 sm:py-20 px-4 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <StaggeredCards className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Deploy in minutes, not hours
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Get Taskr running on your preferred platform with just a few clicks
            or commands.
          </p>
        </StaggeredCards>

        {/* Deploy options */}
        <StaggeredCards className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-12 lg:mx-46">
          {deployOptions.map((option) => (
            <Card
              key={option.name}
              className={`bg-card border-border hover:border-primary/30 transition-colors relative ${
                option.recommended ? "ring-1 ring-primary" : ""
              }`}
            >
              {option.recommended && (
                <div className="absolute left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}
              <CardContent className="p-4 sm:p-6 pt-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {option.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>
                {option.url ? (
                  <a
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Deploy to {option.name}
                    </Button>
                  </a>
                ) : (
                  <div
                    onClick={() => copyToClipboard(option.command!)}
                    className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
                    <code className="text-sm text-foreground font-mono flex-1 truncate">
                      {option.command}
                    </code>
                    {copiedCommand === option.command ? (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </StaggeredCards>

        {/* Quick start guide */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 lg:mx-46">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Quick Start Guide
          </h3>
          <div className="space-y-4">
            {quickStartSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.label}
                  </p>
                  <div
                    onClick={() => copyToClipboard(step.command)}
                    className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 cursor-pointer hover:bg-secondary transition-colors group"
                  >
                    <code className="text-sm text-foreground font-mono flex-1 truncate">
                      {step.command}
                    </code>
                    {copiedCommand === step.command ? (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
