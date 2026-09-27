"use client";

import type { DynamicSection } from "@/types/resume";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Layers,
  List,
  Split,
  Table,
} from "lucide-react";
import React from "react";

interface SortableSectionItemProps {
  section: DynamicSection;
  index: number;
  totalSections: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onTogglePageBreak?: () => void;
}

export const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  index,
  totalSections,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onTogglePageBreak,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case "key_value":
        return <Table className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case "items":
        return <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case "list":
        return <List className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group p-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
        isSelected
          ? "border-slate-900 bg-white shadow-xs ring-1 ring-slate-900"
          : "border-slate-200/80 bg-white/70 hover:bg-slate-100 text-slate-700"
      }`}>
      <div className="flex items-center gap-1.5 truncate pr-1">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="p-1 -ml-1 text-slate-400 hover:text-slate-800 cursor-grab active:cursor-grabbing rounded hover:bg-slate-200/60"
          title="Drag to reorder">
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        {getSectionIcon(section.type)}

        <span className="truncate font-semibold text-slate-900 text-[11px]">
          {section.title}
        </span>

        {section.pageBreakBefore && (
          <span
            className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800 shrink-0"
            title="Page break inserted before this section">
            Page 2
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
        {/* Reorder Up */}
        <button
          type="button"
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="p-1 hover:text-slate-950 disabled:opacity-20 text-slate-400 cursor-pointer"
          title="Move Up">
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Reorder Down */}
        <button
          type="button"
          disabled={index === totalSections - 1}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="p-1 hover:text-slate-950 disabled:opacity-20 text-slate-400 cursor-pointer"
          title="Move Down">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Page Break */}
        {onTogglePageBreak && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePageBreak();
            }}
            className={`p-1 hover:text-slate-950 cursor-pointer ${
              section.pageBreakBefore
                ? "text-amber-600 font-bold"
                : "text-slate-400"
            }`}
            title="Toggle Page Break before section">
            <Split className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Visibility Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-1 hover:text-slate-950 text-slate-400 cursor-pointer"
          title="Toggle Visibility">
          {section.enabled !== false ? (
            <Eye className="w-3.5 h-3.5 text-slate-600" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-slate-300" />
          )}
        </button>
      </div>
    </div>
  );
};
