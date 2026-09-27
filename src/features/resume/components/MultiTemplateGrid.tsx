import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Printer, Sparkles } from "lucide-react";
import React from "react";
import type { ResumeData, TemplateType } from "../types";
import { ResumePreview } from "./ResumePreview";

interface MultiTemplateGridProps {
  data: ResumeData;
  selectedTemplate: TemplateType;
  onSelectTemplate: (t: TemplateType) => void;
  onExportTemplate: (t: TemplateType) => void;
}

interface TemplateMeta {
  id: TemplateType;
  title: string;
  badge: string;
  description: string;
}

const templatesMeta: TemplateMeta[] = [
  {
    id: "modern-tech",
    title: "✨ Modern Tech",
    badge: "Most Popular",
    description: "Single-column clean layout with crisp dividers & tech badges",
  },
  {
    id: "classic-latex",
    title: "📝 Classic LaTeX",
    badge: "Academic",
    description:
      "100% authentic Computer Modern / Academic publication formatting",
  },
  {
    id: "two-column",
    title: "📊 Two-Column Executive",
    badge: "Modern Split",
    description:
      "Dedicated left sidebar for contacts, skills, education, and languages",
  },
  {
    id: "compact-minimal",
    title: "⚡ Compact Minimal",
    badge: "Silicon Valley",
    description: "High-density developer layout optimized for quick scanning",
  },
];

export const MultiTemplateGrid: React.FC<MultiTemplateGridProps> = ({
  data,
  selectedTemplate,
  onSelectTemplate,
  onExportTemplate,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-heading">
          Multi-Template Live Comparison
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl mx-auto">
          Preview your resume rendered across all 4 templates simultaneously.
          Select any template to edit in full view or export immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {templatesMeta.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;

          return (
            <div
              key={tpl.id}
              className={`flex flex-col bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                isSelected
                  ? "border-slate-900 ring-2 ring-slate-900/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}>
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {tpl.title}
                    </h3>
                    <Badge
                      variant={isSelected ? "default" : "secondary"}
                      className="text-[10px] px-2 py-0.5">
                      {tpl.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onSelectTemplate(tpl.id)}
                    className="h-8 text-xs gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {isSelected ? "Active View" : "Select"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onExportTemplate(tpl.id)}
                    className="h-8 text-xs gap-1"
                    title="Export this template as PDF">
                    <Printer className="w-3.5 h-3.5" />
                    PDF
                  </Button>
                </div>
              </div>

              {/* Scaled A4 Preview Box */}
              <div
                className="p-4 bg-slate-100/70 flex justify-center items-center overflow-hidden cursor-pointer group relative min-h-[480px]"
                onClick={() => onSelectTemplate(tpl.id)}>
                <div className="transform scale-[0.44] origin-top sm:scale-[0.52] lg:scale-[0.56] pointer-events-none transition-transform duration-200 group-hover:scale-[0.58]">
                  <ResumePreview
                    data={data}
                    template={tpl.id}
                    className="shadow-2xl border border-slate-300"
                  />
                </div>

                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-opacity flex items-center gap-1.5 pointer-events-none">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Click
                    to Edit & Full View
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
