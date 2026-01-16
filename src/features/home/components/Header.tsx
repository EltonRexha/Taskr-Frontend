"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUser } from "@clerk/nextjs";
import Logo from "@/components/Logo";

const links: { name: string; id: string }[] = [
  {
    name: "Home",
    id: "Home",
  },
  {
    name: "Features",
    id: "features",
  },
  {
    name: "Open Source",
    id: "open-source",
  },
  {
    name: "Deploy",
    id: "deploy",
  },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo height={45} width={100} />

        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ name, id }) => {
            return (
              <Link
                href={`#${id}`}
                key={id}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {name}
              </Link>
            );
          })}
        </nav>

        {isSignedIn ? (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8">
                Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground h-8"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-8">
                Get Started
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-10 w-10" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:w-80 bg-background border-border p-0"
          >
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Logo height={45} width={100} />
              </div>
              <nav className="flex-1 p-4 space-y-1 text-xl">
                {links.map(({ name, id }) => {
                  return (
                    <Link
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      key={id}
                      className="flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
                    >
                      {name}
                    </Link>
                  );
                })}
              </nav>
              {isSignedIn ? (
                <div className="p-4 space-y-3 border-t border-border flex flex-col gap">
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground h-12">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-3 border-t border-border flex flex-col gap">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent h-12"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground h-12">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
