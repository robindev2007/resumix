"use client";

import { Textarea } from "@/components/ui/textarea";
import { analyzeBulletImpact } from "@/lib/action-verbs";
import {
  Bold,
  CheckCircle2,
  Code,
  Italic,
  Link as LinkIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { ActionVerbPicker } from "./ActionVerbPicker";

interface RichTextMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  showBulletScorer?: boolean;
  className?: string;
}

export const RichTextMarkdownEditor: React.FC<RichTextMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write content or achievement bullet...",
  rows = 2,
  showBulletScorer = true,
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isVerbPickerOpen, setIsVerbPickerOpen] = useState(false);

  // Analyze impact if bullet scorer is enabled
  const impact = showBulletScorer ? analyzeBulletImpact(value) : null;

  // Insert formatting around selected text or at cursor
  const handleInsertFormat = (
    prefix: string,
    suffix: string,
    defaultText: string = "",
  ) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = selected || defaultText;
    const newText =
      value.substring(0, start) +
      prefix +
      replacement +
      suffix +
      value.substring(end);

    onChange(newText);

    setTimeout(() => {
      el.focus();
      const newCursorPos = start + prefix.length + replacement.length;
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleInsertVerb = (verb: string) => {
    const el = textareaRef.current;
    const current = value.trim();

    if (!current) {
      onChange(`${verb} `);
    } else {
      // Check if text already starts with a word, optionally replace first word
      const words = current.split(" ");
      words[0] = verb;
      onChange(words.join(" "));
    }

    if (el) {
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }, 10);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Markdown Quick Toolbar */}
      <div className="flex items-center justify-between gap-1 flex-wrap text-xs bg-slate-100/70 p-1 rounded-lg border border-slate-200/70">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => handleInsertFormat("**", "**", "bold text")}
            className="p-1 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition-colors"
            title="Bold (**text**)">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertFormat("*", "*", "italic text")}
            className="p-1 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition-colors"
            title="Italic (*text*)">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              handleInsertFormat("[", "](https://example.com)", "Link Title")
            }
            className="p-1 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition-colors"
            title="Link ([Label](url))">
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertFormat("`", "`", "code")}
            className="p-1 hover:bg-slate-200 rounded text-slate-700 hover:text-slate-900 transition-colors"
            title="Code (`code`)">
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertFormat("**+", "%**", "40")}
            className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-[11px] font-bold text-emerald-700 transition-colors flex items-center gap-0.5"
            title="Metric Highlight (**+40%**)">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>+Metric</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Action Verb Assistant Button */}
          <button
            type="button"
            onClick={() => setIsVerbPickerOpen(true)}
            className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Power Verb</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <Textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-xs leading-relaxed resize-y bg-white border-slate-200 focus-visible:ring-slate-900"
      />

      {/* ATS Impact Scorer Footer (for bullet points) */}
      {showBulletScorer && impact && value.trim().length > 0 && (
        <div className="flex items-center justify-between gap-2 text-[10.5px] px-2 py-1 rounded-md bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 font-semibold ${
                impact.hasActionVerb ? "text-emerald-700" : "text-slate-500"
              }`}>
              {impact.hasActionVerb ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              )}
              {impact.detectedVerb ? (
                <span>
                  Verb: <em>{impact.detectedVerb}</em>
                </span>
              ) : (
                <span>Action Verb</span>
              )}
            </span>

            <span className="text-slate-300">•</span>

            <span
              className={`flex items-center gap-1 font-semibold ${
                impact.hasMetric ? "text-emerald-700" : "text-slate-500"
              }`}>
              {impact.hasMetric ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              )}
              {impact.detectedMetric ? (
                <span>
                  Metric: <em>{impact.detectedMetric}</em>
                </span>
              ) : (
                <span>Quantifiable Metric</span>
              )}
            </span>
          </div>

          <div className="shrink-0">
            {impact.score === "high" && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                🚀 High Impact
              </span>
            )}
            {impact.score === "medium" && (
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                ⚡ Medium Impact
              </span>
            )}
            {impact.score === "low" && (
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[10px]">
                Tip: Add verb + metric
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Verb Picker Modal */}
      <ActionVerbPicker
        isOpen={isVerbPickerOpen}
        onClose={() => setIsVerbPickerOpen(false)}
        onSelectVerb={handleInsertVerb}
      />
    </div>
  );
};
