"use client";

import { cn } from "@/lib/utils";
import type {
  FontType,
  PageDensity,
  PaperSize,
  ResumeDocument,
  TemplateType,
  ThemeColor,
  ThemeConfig,
} from "@/types/resume";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit3,
  Hand,
  Printer,
  Sliders,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useState } from "react";

interface StudioBottomBarProps {
  template: TemplateType;
  font: FontType;
  theme: ThemeColor;
  paperSize: PaperSize;
  density: PageDensity;
  themeConfig?: ThemeConfig;
  zoom: number;
  isPanToolActive: boolean;
  totalPages: number;
  activePage: number;
  isOverflowing?: boolean;
  resumeData: ResumeDocument;
  onTemplateChange: (t: TemplateType) => void;
  onFontChange?: (f: FontType) => void;
  onThemeChange?: (th: ThemeColor) => void;
  onPaperSizeChange?: (ps: PaperSize) => void;
  onDensityChange?: (d: PageDensity) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitPage: () => void;
  onTogglePanTool: () => void;
  onSelectPage: (pageNum: number) => void;
  onOpenEditor: () => void;
  onOpenStyling?: () => void;
  onReset?: () => void;
  onImportData?: (data: ResumeDocument) => void;
  onExportPdf: () => void;
}

export const StudioBottomBar: React.FC<StudioBottomBarProps> = ({
  template,
  zoom,
  isPanToolActive,
  totalPages,
  activePage,
  isOverflowing = false,
  onTemplateChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onTogglePanTool,
  onSelectPage,
  onOpenEditor,
  onOpenStyling,
  onExportPdf,
}) => {
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState<boolean>(false);

  const templates: { id: TemplateType; label: string; desc: string }[] = [
    {
      id: "modern-tech",
      label: "Modern Tech",
      desc: "Single-column clean & modern",
    },
    {
      id: "classic-latex",
      label: "Classic LaTeX",
      desc: "Academic format with serif",
    },
    { id: "two-column", label: "Two-Column", desc: "Modern split sidebar" },
    {
      id: "compact-minimal",
      label: "Compact Minimal",
      desc: "High density A4 fitting",
    },
  ];

  const percentage = Math.round(zoom * 100);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] md:max-w-fit px-2 print:hidden">
      {/* Template Quick Popover */}
      {isTemplateMenuOpen && (
        <div className="mb-2.5 bg-popover/95 backdrop-blur-2xl border border-border shadow-2xl rounded-2xl p-3 animate-in fade-in slide-in-from-bottom-2 text-popover-foreground max-w-xs sm:max-w-sm mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              Select Template
            </span>
            <button
              onClick={() => setIsTemplateMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onTemplateChange(t.id);
                  setIsTemplateMenuOpen(false);
                }}
                className={cn(
                  "p-2.5 rounded-xl text-left border transition-all cursor-pointer whitespace-nowrap flex items-center justify-between",
                  template === t.id
                    ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                    : "border-border bg-card hover:bg-accent text-card-foreground",
                )}>
                <div>
                  <div className="font-bold text-xs whitespace-nowrap">
                    {t.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {t.desc}
                  </div>
                </div>
                {template === t.id && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Floating Bottom Island Dock */}
      <div className="bg-card/92 backdrop-blur-2xl border border-border/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl p-1.5 flex items-center flex-nowrap gap-1.5 text-card-foreground overflow-x-auto no-scrollbar max-w-full">
        {/* Template Selector Button */}
        <button
          onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0",
            isTemplateMenuOpen
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border/80 bg-secondary/80 hover:bg-secondary text-secondary-foreground",
          )}>
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-bold capitalize whitespace-nowrap">
            {template.replace("-", " ")}
          </span>
          <ChevronUp className="w-3 h-3 text-muted-foreground ml-0.5 shrink-0" />
        </button>

        {/* Edit Resume Button */}
        <button
          onClick={onOpenEditor}
          className="px-3 py-1 text-xs font-bold rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/80 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs">
          <Edit3 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="whitespace-nowrap">Edit</span>
        </button>

        {/* Styling & Micro-Controls Button */}
        {onOpenStyling && (
          <button
            onClick={onOpenStyling}
            className="px-3 py-1 text-xs font-bold rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/80 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
            title="Adjust colors, font pairings, section spacing & page margins">
            <Sliders className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="whitespace-nowrap">Styling</span>
          </button>
        )}

        {/* Desktop Zoom Toolset */}
        <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-0.5 rounded-xl border border-border/60 shrink-0">
          <button
            onClick={onTogglePanTool}
            className={cn(
              "p-1 rounded-lg transition-colors cursor-pointer shrink-0",
              isPanToolActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
            )}
            title="Hand Pan (Space + Drag)">
            <Hand className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.3}
            className="p-1 hover:bg-muted disabled:opacity-30 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetZoom}
            className="px-1.5 text-[11px] font-mono font-bold text-foreground hover:bg-muted rounded cursor-pointer whitespace-nowrap shrink-0"
            title="Reset 100%">
            {percentage}%
          </button>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 5.0}
            className="p-1 hover:bg-muted disabled:opacity-30 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Multi-Page Quick Stepper & Overflow Indicator */}
        {totalPages > 1 ? (
          <div className="hidden md:flex items-center gap-0.5 text-xs font-mono font-bold bg-muted/80 px-2 py-1 rounded-xl border border-border/60 shrink-0 text-foreground">
            <button
              onClick={() => onSelectPage(Math.max(activePage - 1, 1))}
              disabled={activePage <= 1}
              className="p-0.5 hover:bg-background disabled:opacity-30 rounded cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="whitespace-nowrap">
              {activePage}/{totalPages}
            </span>
            <button
              onClick={() => onSelectPage(Math.min(activePage + 1, totalPages))}
              disabled={activePage >= totalPages}
              className="p-0.5 hover:bg-background disabled:opacity-30 rounded cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : isOverflowing ? (
          <div
            className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0"
            title="Content might overflow standard 1-page A4. Consider reducing section spacing or font size in Styling.">
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>2 Pages (Overflow)</span>
          </div>
        ) : null}

        {/* Primary Export PDF Button */}
        <button
          onClick={onExportPdf}
          className="px-3.5 py-1 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0">
          <Printer className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Export PDF</span>
        </button>
      </div>
    </div>
  );
};
