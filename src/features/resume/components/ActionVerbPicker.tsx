"use client";

import { Input } from "@/components/ui/input";
import { ACTION_VERB_CATEGORIES, ALL_ACTION_VERBS } from "@/lib/action-verbs";
import { Search, Sparkles, X } from "lucide-react";
import React, { useState } from "react";

interface ActionVerbPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerb: (verb: string) => void;
}

export const ActionVerbPicker: React.FC<ActionVerbPickerProps> = ({
  isOpen,
  onClose,
  onSelectVerb,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const filteredVerbs = ALL_ACTION_VERBS.filter((verb) => {
    const matchesSearch = verb.toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === "All") return matchesSearch;
    const cat = ACTION_VERB_CATEGORIES.find((c) => c.name === selectedCategory);
    return matchesSearch && cat?.verbs.includes(verb);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Action-Verb Impact Assistant
              </h3>
              <p className="text-[11px] text-slate-500">
                Choose a power verb to begin your achievement bullet point.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="p-4 border-b border-slate-100 space-y-2.5 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search power verbs (e.g., Architected, Optimized)..."
              className="pl-9 text-xs h-9"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              All Verbs ({ALL_ACTION_VERBS.length})
            </button>
            {ACTION_VERB_CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c.name
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {c.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Verbs Grid */}
        <div className="p-4 flex-1 overflow-y-auto max-h-72">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredVerbs.map((verb) => (
              <button
                key={verb}
                onClick={() => {
                  onSelectVerb(verb);
                  onClose();
                }}
                className="group px-3 py-2 rounded-xl text-left border border-slate-200/80 hover:border-indigo-500 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition-all flex items-center justify-between cursor-pointer">
                <span>{verb}</span>
                <span className="text-[10px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  + Insert
                </span>
              </button>
            ))}
          </div>

          {filteredVerbs.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching action verbs found for &quot;{search}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
