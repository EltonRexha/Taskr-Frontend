"use client"

import Link from "next/link"
import { User, Settings, HelpCircle, LogOut, Moon, Bell, Shield, CreditCard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useCurrentTheme } from "@/hooks/useCurrentTheme"
import { useUser } from "@clerk/nextjs"

export function UserDropdown() {
  const {theme, setTheme} = useCurrentTheme();
  const {user} = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 w-full justify-start gap-3 hover:bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
            <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-left hidden sm:block">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.fullName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress || "user@example.com"}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-64 bg-card border-border mb-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
              <AvatarFallback>{user?.fullName?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress || "user@example.com"}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card border-border">
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light" className="cursor-pointer">
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="cursor-pointer">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/settings/notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notification Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/settings/security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/billing" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </div>
            <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">
              Pro
            </Badge>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
