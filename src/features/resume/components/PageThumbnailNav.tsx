"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import React from "react";

interface PageThumbnailNavProps {
  totalPages: number;
  activePage: number;
  onSelectPage: (pageNum: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const PageThumbnailNav: React.FC<PageThumbnailNavProps> = ({
  totalPages,
  activePage,
  onSelectPage,
  isOpen,
  onToggleOpen,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "absolute left-4 top-4 z-30 flex flex-col bg-card/95 backdrop-blur-xl border border-border/80 shadow-xl rounded-2xl transition-all duration-200 print:hidden text-card-foreground",
        isOpen ? "w-36 p-3" : "w-10 p-1.5 items-center",
      )}>
      {/* Header Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60 w-full">
        {isOpen && (
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-primary" /> Pages ({totalPages})
          </span>
        )}
        <button
          onClick={onToggleOpen}
          className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title={
            isOpen ? "Collapse Page Thumbnails" : "Expand Page Thumbnails"
          }>
          {isOpen ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Thumbnails List */}
      <div className="flex flex-col gap-2 pt-2 overflow-y-auto max-h-[60vh] no-scrollbar w-full">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = activePage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => onSelectPage(pageNum)}
              className={cn(
                "group relative flex flex-col items-center rounded-xl transition-all cursor-pointer",
                isOpen ? "p-2 border" : "p-1.5",
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                  : "border-border/60 hover:border-border hover:bg-muted/60",
              )}>
              {/* Miniature Page Box */}
              <div
                className={cn(
                  "w-12 h-16 bg-background border rounded-xs shadow-2xs flex flex-col justify-between p-1 transition-transform group-hover:scale-105",
                  isActive
                    ? "border-primary ring-1 ring-primary/40"
                    : "border-border",
                )}>
                <div className="space-y-0.5">
                  <div className="h-1 w-full bg-muted-foreground/30 rounded-full" />
                  <div className="h-0.5 w-3/4 bg-muted-foreground/20 rounded-full" />
                  <div className="h-0.5 w-1/2 bg-muted-foreground/20 rounded-full" />
                </div>
                <span className="text-[7pt] font-mono text-center text-muted-foreground font-bold">
                  P.{pageNum}
                </span>
              </div>

              {isOpen && (
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1.5",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}>
                  Page {pageNum}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
