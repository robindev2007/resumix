"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialIcon } from "@/lib/social-icons";
import type { ItemEntry } from "@/types/resume";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import React from "react";
import { RichTextMarkdownEditor } from "./RichTextMarkdownEditor";

interface SortableEntryItemProps {
  entry: ItemEntry;
  entryIndex: number;
  totalEntries: number;
  onUpdate: (field: keyof ItemEntry, value: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddHighlight: () => void;
  onUpdateHighlight: (hIndex: number, text: string) => void;
  onDeleteHighlight: (hIndex: number) => void;
}

export const SortableEntryItem: React.FC<SortableEntryItemProps> = ({
  entry,
  entryIndex,
  totalEntries,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddHighlight,
  onUpdateHighlight,
  onDeleteHighlight,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id || `entry-${entryIndex}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-3.5 shadow-2xs hover:border-slate-300 transition-colors">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 -ml-1 text-slate-400 hover:text-slate-800 cursor-grab active:cursor-grabbing rounded hover:bg-slate-200/60"
            title="Drag to reorder entry">
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800">
            Entry #{entryIndex + 1}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={entryIndex === 0}
            onClick={onMoveUp}
            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
            title="Move Up">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={entryIndex === totalEntries - 1}
            onClick={onMoveDown}
            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
            title="Move Down">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
            title="Duplicate entry">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
            title="Remove entry">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Title / Role & Company
          </label>
          <Input
            value={entry.title}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer | Stripe"
            className="text-xs font-semibold bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Date / Period
          </label>
          <Input
            value={entry.period || ""}
            onChange={(e) => onUpdate("period", e.target.value)}
            placeholder="e.g. Oct 2024 – Present"
            className="text-xs bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Subtitle / Degree / Role Details
          </label>
          <Input
            value={entry.subtitle || ""}
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            placeholder="e.g. B.S. in Computer Science or Tech Lead"
            className="text-xs bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Location
          </label>
          <Input
            value={entry.location || ""}
            onChange={(e) => onUpdate("location", e.target.value)}
            placeholder="e.g. San Francisco, CA or Remote"
            className="text-xs bg-white"
          />
        </div>
      </div>

      {/* Optional Project / External Link */}
      <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
          <ExternalLink className="w-3 h-3 text-slate-500" />
          <span>Attachment Link (Demo, Play Store, GitHub, Live URL)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 rounded-md border border-slate-200">
            <SocialIcon
              url={entry.link?.url || ""}
              label={entry.link?.label || ""}
              className="w-3.5 h-3.5 text-slate-500"
              showColor
            />
            <input
              type="text"
              value={entry.link?.url || ""}
              onChange={(e) =>
                onUpdate("link", {
                  url: e.target.value,
                  label: entry.link?.label || "Live Demo",
                })
              }
              placeholder="https://..."
              className="w-full text-xs py-1 bg-transparent outline-none"
            />
          </div>
          <Input
            value={entry.link?.label || ""}
            onChange={(e) =>
              onUpdate("link", {
                url: entry.link?.url || "",
                label: e.target.value,
              })
            }
            placeholder="Label (e.g. Play store, Live Demo)"
            className="text-xs bg-white"
          />
        </div>
      </div>

      {/* Bullet Points / Highlights with Action Verb Assistant */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Achievement Bullets ({entry.highlights?.length || 0})
            </span>
            <span className="text-[10.5px] text-slate-500">
              Format with **bold**, [links](url), and power action verbs.
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddHighlight}
            className="h-7 text-xs gap-1 bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-200 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Bullet
          </Button>
        </div>

        <div className="space-y-2.5">
          {entry.highlights?.map((h, hIdx) => (
            <div key={hIdx} className="flex items-start gap-2 group">
              <div className="flex-1">
                <RichTextMarkdownEditor
                  value={h}
                  onChange={(val) => onUpdateHighlight(hIdx, val)}
                  placeholder="e.g. Spearheaded migration to microservices, boosting throughput by **+40%** and saving **$120K** annually."
                  rows={2}
                  showBulletScorer
                />
              </div>
              <button
                type="button"
                onClick={() => onDeleteHighlight(hIdx)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors mt-8 cursor-pointer"
                title="Delete bullet">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
