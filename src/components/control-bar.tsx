import React from "react";
import type { TemplateType, FontType, ThemeColor } from "@/types/resume";
import { Button } from "./ui/button";
import {
  FileText,
  Type,
  Palette,
  Edit3,
  RotateCcw,
  Printer,
  Sparkles,
} from "lucide-react";

interface ControlBarProps {
  template: TemplateType;
  font: FontType;
  theme: ThemeColor;
  onTemplateChange: (t: TemplateType) => void;
  onFontChange: (f: FontType) => void;
  onThemeChange: (th: ThemeColor) => void;
  onOpenEditor: () => void;
  onReset: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  template,
  font,
  theme,
  onTemplateChange,
  onFontChange,
  onThemeChange,
  onOpenEditor,
  onReset,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6 shadow-sm print:hidden">
      {/* Brand */}
      <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
        <div className="bg-slate-900 text-white p-1.5 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </div>
        <span>Next.js Resume Builder</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Template */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-slate-500" />
          <span>Template:</span>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value as TemplateType)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer font-medium"
          >
            <option value="modern-tech">✨ Modern Tech</option>
            <option value="classic-latex">📝 Classic LaTeX</option>
            <option value="two-column">📊 Two-Column Executive</option>
            <option value="compact-minimal">⚡ Compact Minimal</option>
          </select>
        </div>

        {/* Font */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Type className="w-3.5 h-3.5 text-slate-500" />
          <span>Font:</span>
          <select
            value={font}
            onChange={(e) => onFontChange(e.target.value as FontType)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer font-medium"
          >
            <option value="modern-sans">Plus Jakarta Sans</option>
            <option value="geist">Geist (Vercel)</option>
            <option value="inter">Inter</option>
            <option value="editorial-serif">Newsreader (Serif)</option>
          </select>
        </div>

        {/* Accent Theme */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <span>Accent:</span>
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as ThemeColor)}
            className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer font-medium"
          >
            <option value="slate">Slate / Black</option>
            <option value="navy">Navy Blue</option>
            <option value="emerald">Emerald Green</option>
            <option value="indigo">Deep Indigo</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-2">
          <Button variant="outline" size="sm" onClick={onOpenEditor} className="gap-1.5">
            <Edit3 className="w-3.5 h-3.5" />
            Edit Data
          </Button>

          <Button variant="destructive" size="sm" onClick={onReset} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Printer className="w-3.5 h-3.5" />
            Export PDF
          </Button>
        </div>
      </div>
    </header>
  );
};
