"use client";

import { useState } from "react";
import {
  Bell,
  MessageSquare,
  UserPlus,
  CheckCircle2,
  Clock,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const notificationIcons = {
  mention: AtSign,
  assignment: UserPlus,
  comment: MessageSquare,
  status: CheckCircle2,
  deadline: Clock,
};

// Notifications
export interface Notification {
  id: string;
  type: "mention" | "assignment" | "comment" | "status" | "deadline";
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

//Mocked notifications as of now
export const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "mention",
    title: "Sarah Kim mentioned you",
    description: "in a comment on 'Implement user authentication flow'",
    read: false,
    createdAt: "2026-01-13T09:30:00Z",
    link: "/dashboard/tasks",
  },
  {
    id: "notif-2",
    type: "assignment",
    title: "New task assigned",
    description: "You've been assigned to 'SEO optimization audit'",
    read: false,
    createdAt: "2026-01-13T08:15:00Z",
    link: "/dashboard/tasks",
  },
  {
    id: "notif-3",
    type: "comment",
    title: "New comment",
    description: "Mike Johnson commented on 'Homepage hero section'",
    read: false,
    createdAt: "2026-01-12T16:45:00Z",
    link: "/dashboard/tasks",
  },
  {
    id: "notif-4",
    type: "status",
    title: "Task completed",
    description: "'Redesign homepage hero section' has been marked as done",
    read: true,
    createdAt: "2026-01-12T14:20:00Z",
    link: "/dashboard/tasks",
  },
  {
    id: "notif-5",
    type: "deadline",
    title: "Deadline approaching",
    description: "'Implement new navigation menu' is due tomorrow",
    read: true,
    createdAt: "2026-01-12T10:00:00Z",
    link: "/dashboard/tasks",
  },
  {
    id: "notif-6",
    type: "assignment",
    title: "Sprint started",
    description: "Sprint 3 has started with 4 tasks assigned to you",
    read: true,
    createdAt: "2026-01-01T08:00:00Z",
    link: "/dashboard/projects/scrum-1/sprints",
  },
];

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}

export function NotificationsDropdown() {
  const [notifs, setNotifs] = useState<Notification[]>(notifications);
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground h-10 w-10"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-card border-border">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifs.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifs.map((notification) => {
              const Icon = notificationIcons[notification.type];
              return (
                <DropdownMenuItem
                  key={notification.id}
                  asChild
                  className="cursor-pointer p-0"
                >
                  <Link
                    href={notification.link || "#"}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "flex w-full items-start gap-3 p-3 hover:bg-secondary/50",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        notification.type === "mention" &&
                          "bg-blue-500/10 text-blue-500",
                        notification.type === "assignment" &&
                          "bg-green-500/10 text-green-500",
                        notification.type === "comment" &&
                          "bg-purple-500/10 text-purple-500",
                        notification.type === "status" &&
                          "bg-primary/10 text-primary",
                        notification.type === "deadline" &&
                          "bg-orange-500/10 text-orange-500",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </Link>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer justify-center">
          <Link
            href="/dashboard/notifications"
            className="text-sm text-primary"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
