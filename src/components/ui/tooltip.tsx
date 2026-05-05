"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = rect.top;
      let left = rect.left + rect.width / 2;

      switch (side) {
        case "top":
          top = rect.top - 8;
          break;
        case "bottom":
          top = rect.bottom + 8;
          break;
        case "left":
          left = rect.left - 8;
          top = rect.top + rect.height / 2;
          break;
        case "right":
          left = rect.right + 8;
          top = rect.top + rect.height / 2;
          break;
      }

      setPosition({ top, left });
    }
  }, [isVisible, side]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className={cn(
              "fixed z-50 px-2 py-1 text-sm bg-popover text-popover-foreground rounded-md shadow-md border border-border whitespace-nowrap pointer-events-none",
              side === "top" && "-translate-x-1/2 -translate-y-full",
              side === "bottom" && "-translate-x-1/2",
              side === "left" && "-translate-x-full -translate-y-1/2",
              side === "right" && "-translate-y-1/2",
              className,
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
