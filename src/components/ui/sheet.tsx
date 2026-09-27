"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop with Click-to-Close */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export function SheetContent({
  side = "left",
  className,
  children,
  onClose,
}: {
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative z-50 flex flex-col h-full bg-white shadow-2xl transition-transform ease-out duration-300",
        side === "left" && "w-80 max-w-[85vw] animate-in slide-in-from-left",
        side === "right" &&
          "w-full sm:w-[460px] animate-in slide-in-from-right ml-auto",
        className,
      )}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
          aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  );
}
