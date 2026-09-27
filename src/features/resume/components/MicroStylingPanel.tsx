"use client";

import { Button } from "@/components/ui/button";
import { FONT_PRESETS, THEME_PRESETS } from "@/lib/theme-presets";
import type {
  FontType,
  PageDensity,
  PaperSize,
  ThemeColor,
  ThemeConfig,
} from "@/types/resume";
import {
  Check,
  Maximize2,
  Palette,
  RotateCcw,
  Sliders,
  Type,
  X,
} from "lucide-react";
import React from "react";

interface MicroStylingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  font: FontType;
  theme: ThemeColor;
  paperSize: PaperSize;
  density: PageDensity;
  themeConfig?: ThemeConfig;
  onFontChange: (f: FontType) => void;
  onThemeChange: (t: ThemeColor) => void;
  onPaperSizeChange: (p: PaperSize) => void;
  onDensityChange: (d: PageDensity) => void;
  onThemeConfigChange: (tc: ThemeConfig) => void;
  onResetStyling: () => void;
}

export const MicroStylingPanel: React.FC<MicroStylingPanelProps> = ({
  isOpen,
  onClose,
  font,
  theme,
  paperSize,
  density,
  themeConfig = {},
  onFontChange,
  onThemeChange,
  onPaperSizeChange,
  onDensityChange,
  onThemeConfigChange,
  onResetStyling,
}) => {
  if (!isOpen) return null;

  const currentPreset =
    THEME_PRESETS.find((t) => t.id === theme) || THEME_PRESETS[0];

  const primaryColor = themeConfig.primaryColor || currentPreset.primary;
  const secondaryColor = themeConfig.secondaryColor || currentPreset.secondary;
  const accentColor = themeConfig.accentColor || currentPreset.accent;

  const sectionSpacing = themeConfig.sectionSpacing ?? 8; // px
  const lineHeight = themeConfig.lineHeight ?? 1.34;
  const fontSize = themeConfig.fontSize ?? 9.3; // pt
  const pageMargin = themeConfig.pageMargin ?? 12; // mm

  const handleUpdateConfig = (field: keyof ThemeConfig, val: any) => {
    onThemeConfigChange({
      ...themeConfig,
      [field]: val,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-slate-900/40 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Micro-Styling & Layout Controls
              </h3>
              <p className="text-[11px] text-slate-500">
                Live typography, custom colors, density & spacing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={onResetStyling}
              className="h-7 text-xs text-slate-500 hover:text-red-600 gap-1 cursor-pointer">
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Color Themes & Custom Palette Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span>Color Palettes & Accents</span>
              </div>
              <span className="text-[10.5px] font-bold text-slate-400">
                {theme.toUpperCase()}
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2">
              {THEME_PRESETS.map((p) => {
                const isActive = theme === p.id && !themeConfig.primaryColor;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onThemeChange(p.id);
                      onThemeConfigChange({
                        ...themeConfig,
                        primaryColor: undefined,
                        secondaryColor: undefined,
                        accentColor: undefined,
                      });
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: p.primary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: p.accent }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 truncate">
                        {p.name.split(" ")[0]}
                      </span>
                    </div>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hex Custom Color Pickers */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-800 block">
                Custom Hex Color Overrides
              </span>

              <div className="grid grid-cols-3 gap-2">
                {/* Primary Headings */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Headings
                  </label>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) =>
                        handleUpdateConfig("primaryColor", e.target.value)
                      }
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-700 uppercase">
                      {primaryColor.slice(0, 7)}
                    </span>
                  </div>
                </div>

                {/* Subtitles & Meta */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Subtitles
                  </label>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) =>
                        handleUpdateConfig("secondaryColor", e.target.value)
                      }
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-700 uppercase">
                      {secondaryColor.slice(0, 7)}
                    </span>
                  </div>
                </div>

                {/* Accent & Links */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">
                    Links & Badges
                  </label>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) =>
                        handleUpdateConfig("accentColor", e.target.value)
                      }
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-700 uppercase">
                      {accentColor.slice(0, 7)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Typography & Font Pairings */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              <span>Typography & Font Pairings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FONT_PRESETS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onFontChange(f.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    font === f.id
                      ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {f.name}
                    </span>
                    {font === f.id && (
                      <Check className="w-3.5 h-3.5 text-slate-900" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {f.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Spacing, Margins & Density Sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Micro-Spacing & Scale Sliders</span>
            </div>

            {/* Section Spacing Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Section Vertical Spacing</span>
                <span className="font-mono text-indigo-600">
                  {sectionSpacing}px
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="1"
                value={sectionSpacing}
                onChange={(e) =>
                  handleUpdateConfig("sectionSpacing", Number(e.target.value))
                }
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>4px (Ultra Compact)</span>
                <span>24px (Relaxed)</span>
              </div>
            </div>

            {/* Font Size Scaling Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Base Font Size</span>
                <span className="font-mono text-indigo-600">{fontSize}pt</span>
              </div>
              <input
                type="range"
                min="8.5"
                max="11.5"
                step="0.1"
                value={fontSize}
                onChange={(e) =>
                  handleUpdateConfig("fontSize", Number(e.target.value))
                }
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8.5pt</span>
                <span>9.3pt (Default)</span>
                <span>11.5pt</span>
              </div>
            </div>

            {/* Line Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Line Height / Leading</span>
                <span className="font-mono text-indigo-600">{lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.15"
                max="1.6"
                step="0.02"
                value={lineHeight}
                onChange={(e) =>
                  handleUpdateConfig("lineHeight", Number(e.target.value))
                }
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.15 (Tight)</span>
                <span>1.34 (Standard)</span>
                <span>1.60 (Spacious)</span>
              </div>
            </div>

            {/* Page Margin Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Page Margins (Padding)</span>
                <span className="font-mono text-indigo-600">
                  {pageMargin}mm
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="22"
                step="1"
                value={pageMargin}
                onChange={(e) =>
                  handleUpdateConfig("pageMargin", Number(e.target.value))
                }
                className="w-full accent-slate-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8mm (Dense)</span>
                <span>12mm (Standard)</span>
                <span>22mm (Generous)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Page Flow Mode & Paper Format */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Page Flow & Layout Mode
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onDensityChange("normal")}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                    density === "normal"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}>
                  Auto Balanced
                </button>
                <button
                  type="button"
                  onClick={() => onDensityChange("compact")}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                    density === "compact"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}>
                  Dense 1-Page
                </button>
                <button
                  type="button"
                  onClick={() => onDensityChange("spacious")}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                    density === "spacious"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}>
                  Spacious Multi
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Paper Format
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onPaperSizeChange("A4")}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    paperSize === "A4"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}>
                  A4 (210 × 297 mm)
                </button>
                <button
                  type="button"
                  onClick={() => onPaperSizeChange("Letter")}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    paperSize === "Letter"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}>
                  US Letter (8.5 × 11 in)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <Button
            size="sm"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-5">
            Apply & Done
          </Button>
        </div>
      </div>
    </div>
  );
};
