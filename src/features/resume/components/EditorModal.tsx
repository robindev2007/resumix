"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialIcon } from "@/lib/social-icons";
import type {
  DynamicSection,
  ItemEntry,
  ResumeDocument,
  SectionType,
  SocialLink,
} from "@/types/resume";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Copy,
  FileText,
  Layers,
  List as ListIcon,
  Plus,
  RotateCcw,
  Save,
  Table,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { RichTextMarkdownEditor } from "./RichTextMarkdownEditor";
import { SortableEntryItem } from "./SortableEntryItem";
import { SortableSectionItem } from "./SortableSectionItem";

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeDocument;
  onSave: (updated: ResumeDocument) => void;
  onReset: () => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<ResumeDocument>(data);
  const [activeTab, setActiveTab] = useState<"personal" | "sections">(
    "personal",
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(data)));
    if (data.sections && data.sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(data.sections[0].id);
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  // Personal Info change handler
  const handlePersonalChange = (field: string, value: string) => {
    setFormData((prev) => {
      const p = { ...prev.personal };
      if (field === "linkedin") {
        p.linkedin = {
          url: value,
          label: value.replace(/^https?:\/\/(www\.)?/, ""),
        };
      } else if (field === "github") {
        p.github = {
          url: value,
          label: value.replace(/^https?:\/\/(www\.)?/, ""),
        };
      } else {
        (p as Record<string, any>)[field] = value;
      }
      return { ...prev, personal: p };
    });
  };

  // Social Links Handlers
  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      label: "Portfolio",
      url: "https://",
    };
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: [...(prev.personal.links || []), newLink],
      },
    }));
  };

  const handleUpdateSocialLink = (
    idx: number,
    field: keyof SocialLink,
    val: string,
  ) => {
    setFormData((prev) => {
      const links = [...(prev.personal.links || [])];
      links[idx] = { ...links[idx], [field]: val };
      return {
        ...prev,
        personal: { ...prev.personal, links },
      };
    });
  };

  const handleDeleteSocialLink = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        links: (prev.personal.links || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // Section Drag & Drop Reordering
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
        const newIndex = prev.sections.findIndex((s) => s.id === over.id);
        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex),
        };
      });
    }
  };

  // Move Section Up/Down Buttons
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formData.sections.length) return;

    setFormData((prev) => ({
      ...prev,
      sections: arrayMove(prev.sections, index, targetIdx),
    }));
  };

  const handleToggleSection = (secId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === secId ? { ...s, enabled: s.enabled === false } : s,
      ),
    }));
  };

  const handleTogglePageBreak = (secId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === secId ? { ...s, pageBreakBefore: !s.pageBreakBefore } : s,
      ),
    }));
  };

  const handleUpdateSectionTitle = (secId: string, title: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === secId ? { ...s, title } : s,
      ),
    }));
  };

  // Section Creation & Duplication
  const handleAddNewSection = (type: SectionType) => {
    const id = `sec-${Date.now()}`;
    let newSec: DynamicSection;

    if (type === "text") {
      newSec = {
        id,
        title: "NEW TEXT SECTION",
        type: "text",
        enabled: true,
        content: "Enter your summary or description here...",
      };
    } else if (type === "key_value") {
      newSec = {
        id,
        title: "SKILLS & CATEGORIES",
        type: "key_value",
        enabled: true,
        items: [{ key: "Category", value: "Skill 1, Skill 2, Skill 3" }],
      };
    } else if (type === "items") {
      newSec = {
        id,
        title: "EXPERIENCES / PROJECTS",
        type: "items",
        enabled: true,
        entries: [
          {
            id: `entry-${Date.now()}`,
            title: "Position or Project Title",
            subtitle: "Company / Subtitle",
            period: "2025 – Present",
            highlights: [
              "**Spearheaded** key development milestones, accelerating delivery by **+30%**.",
            ],
          },
        ],
      };
    } else {
      newSec = {
        id,
        title: "CERTIFICATIONS / AWARDS",
        type: "list",
        enabled: true,
        items: [
          "**Award / Credential** — Recognized for exceptional technical contributions",
        ],
      };
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSec],
    }));
    setSelectedSectionId(id);
    setActiveTab("sections");
  };

  const handleDuplicateSection = (secId: string) => {
    const target = formData.sections.find((s) => s.id === secId);
    if (!target) return;

    const newId = `sec-${Date.now()}`;
    const duplicated: DynamicSection = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      title: `${target.title} (Copy)`,
    };

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, duplicated],
    }));
    setSelectedSectionId(newId);
  };

  const handleDeleteSection = (secId: string) => {
    if (confirm("Are you sure you want to remove this section?")) {
      setFormData((prev) => {
        const remaining = prev.sections.filter((s) => s.id !== secId);
        if (selectedSectionId === secId && remaining.length > 0) {
          setSelectedSectionId(remaining[0].id);
        }
        return { ...prev, sections: remaining };
      });
    }
  };

  // Content Update Handlers for Selected Section
  const currentSection = formData.sections.find(
    (s) => s.id === selectedSectionId,
  );

  // Text Section
  const handleUpdateTextContent = (content: string) => {
    if (!currentSection || currentSection.type !== "text") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === currentSection.id && s.type === "text" ? { ...s, content } : s,
      ),
    }));
  };

  // Key-Value Section
  const handleAddKeyValueItem = () => {
    if (!currentSection || currentSection.type !== "key_value") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "key_value") {
          return { ...s, items: [...s.items, { key: "", value: "" }] };
        }
        return s;
      }),
    }));
  };

  const handleUpdateKeyValueItem = (
    idx: number,
    field: "key" | "value",
    val: string,
  ) => {
    if (!currentSection || currentSection.type !== "key_value") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "key_value") {
          const items = [...s.items];
          items[idx] = { ...items[idx], [field]: val };
          return { ...s, items };
        }
        return s;
      }),
    }));
  };

  const handleDeleteKeyValueItem = (idx: number) => {
    if (!currentSection || currentSection.type !== "key_value") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "key_value") {
          return { ...s, items: s.items.filter((_, i) => i !== idx) };
        }
        return s;
      }),
    }));
  };

  // List Section
  const handleAddListItem = () => {
    if (!currentSection || currentSection.type !== "list") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "list") {
          return { ...s, items: [...s.items, ""] };
        }
        return s;
      }),
    }));
  };

  const handleUpdateListItem = (idx: number, val: string) => {
    if (!currentSection || currentSection.type !== "list") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "list") {
          const items = [...s.items];
          items[idx] = val;
          return { ...s, items };
        }
        return s;
      }),
    }));
  };

  const handleDeleteListItem = (idx: number) => {
    if (!currentSection || currentSection.type !== "list") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "list") {
          return { ...s, items: s.items.filter((_, i) => i !== idx) };
        }
        return s;
      }),
    }));
  };

  // Items Section Entries Drag & Drop
  const handleEntryDragEnd = (event: DragEndEvent) => {
    if (!currentSection || currentSection.type !== "items") return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id === currentSection.id && s.type === "items") {
            const oldIndex = s.entries.findIndex((e) => e.id === active.id);
            const newIndex = s.entries.findIndex((e) => e.id === over.id);
            return {
              ...s,
              entries: arrayMove(s.entries, oldIndex, newIndex),
            };
          }
          return s;
        }),
      }));
    }
  };

  const handleAddItemEntry = () => {
    if (!currentSection || currentSection.type !== "items") return;
    const newEntry: ItemEntry = {
      id: `entry-${Date.now()}`,
      title: "",
      subtitle: "",
      period: "",
      highlights: [""],
    };
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          return { ...s, entries: [...s.entries, newEntry] };
        }
        return s;
      }),
    }));
  };

  const handleDuplicateItemEntry = (entryIdx: number) => {
    if (!currentSection || currentSection.type !== "items") return;
    const target = currentSection.entries[entryIdx];
    const duplicated: ItemEntry = {
      ...JSON.parse(JSON.stringify(target)),
      id: `entry-${Date.now()}`,
      title: `${target.title} (Copy)`,
    };
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          const entries = [...s.entries];
          entries.splice(entryIdx + 1, 0, duplicated);
          return { ...s, entries };
        }
        return s;
      }),
    }));
  };

  const handleMoveEntry = (entryIdx: number, direction: "up" | "down") => {
    if (!currentSection || currentSection.type !== "items") return;
    const targetIdx = direction === "up" ? entryIdx - 1 : entryIdx + 1;
    if (targetIdx < 0 || targetIdx >= currentSection.entries.length) return;

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          return {
            ...s,
            entries: arrayMove(s.entries, entryIdx, targetIdx),
          };
        }
        return s;
      }),
    }));
  };

  const handleUpdateItemEntry = (
    entryIdx: number,
    field: keyof ItemEntry,
    val: any,
  ) => {
    if (!currentSection || currentSection.type !== "items") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          const entries = [...s.entries];
          entries[entryIdx] = { ...entries[entryIdx], [field]: val };
          return { ...s, entries };
        }
        return s;
      }),
    }));
  };

  const handleDeleteItemEntry = (entryIdx: number) => {
    if (!currentSection || currentSection.type !== "items") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          return {
            ...s,
            entries: s.entries.filter((_, i) => i !== entryIdx),
          };
        }
        return s;
      }),
    }));
  };

  const handleAddHighlight = (entryIdx: number) => {
    if (!currentSection || currentSection.type !== "items") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          const entries = [...s.entries];
          entries[entryIdx] = {
            ...entries[entryIdx],
            highlights: [...entries[entryIdx].highlights, ""],
          };
          return { ...s, entries };
        }
        return s;
      }),
    }));
  };

  const handleUpdateHighlight = (
    entryIdx: number,
    hIdx: number,
    val: string,
  ) => {
    if (!currentSection || currentSection.type !== "items") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          const entries = [...s.entries];
          const highlights = [...entries[entryIdx].highlights];
          highlights[hIdx] = val;
          entries[entryIdx] = { ...entries[entryIdx], highlights };
          return { ...s, entries };
        }
        return s;
      }),
    }));
  };

  const handleDeleteHighlight = (entryIdx: number, hIdx: number) => {
    if (!currentSection || currentSection.type !== "items") return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        if (s.id === currentSection.id && s.type === "items") {
          const entries = [...s.entries];
          const highlights = entries[entryIdx].highlights.filter(
            (_, i) => i !== hIdx,
          );
          entries[entryIdx] = { ...entries[entryIdx], highlights };
          return { ...s, entries };
        }
        return s;
      }),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Advanced Visual Editor Suite
              </h2>
              <p className="text-xs text-slate-500">
                Drag-and-drop reordering, inline markdown formatting & dynamic
                schema builder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className="text-xs gap-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onSave(formData);
                onClose();
              }}
              className="text-xs gap-1.5 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs">
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with 2-Column Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Navigation Tabs & Sortable Section List */}
          <div className="w-full md:w-80 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col justify-between overflow-y-auto p-4 shrink-0 max-h-[35vh] md:max-h-full">
            <div className="space-y-4">
              {/* Primary Tabs */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "personal"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-200/60"
                  }`}>
                  <User className="w-4 h-4" />
                  <span>Personal Details & Links</span>
                </button>
              </div>

              {/* Dynamic Sections Header */}
              <div className="pt-2 border-t border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Sections ({formData.sections.length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Drag to reorder
                  </span>
                </div>

                {/* DND Sortable Section List */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleSectionDragEnd}>
                  <SortableContext
                    items={formData.sections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className="space-y-1.5">
                      {formData.sections.map((sec, idx) => (
                        <SortableSectionItem
                          key={sec.id}
                          section={sec}
                          index={idx}
                          totalSections={formData.sections.length}
                          isSelected={
                            activeTab === "sections" &&
                            selectedSectionId === sec.id
                          }
                          onSelect={() => {
                            setSelectedSectionId(sec.id);
                            setActiveTab("sections");
                          }}
                          onMoveUp={() => handleMoveSection(idx, "up")}
                          onMoveDown={() => handleMoveSection(idx, "down")}
                          onToggleVisibility={() => handleToggleSection(sec.id)}
                          onTogglePageBreak={() =>
                            handleTogglePageBreak(sec.id)
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </div>

            {/* Add New Dynamic Section Actions */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                + Add Dynamic Section
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleAddNewSection("text")}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => handleAddNewSection("key_value")}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                  <Table className="w-3 h-3 text-purple-600" />
                  <span>Key-Value</span>
                </button>
                <button
                  onClick={() => handleAddNewSection("items")}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>Items</span>
                </button>
                <button
                  onClick={() => handleAddNewSection("list")}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                  <ListIcon className="w-3 h-3 text-amber-600" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Form Editor Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {activeTab === "personal" ? (
              /* Personal Details & Dynamic Links Form */
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Personal & Contact Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This information appears in the top header and sidebar
                    across all templates.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Full Name
                    </label>
                    <Input
                      value={formData.personal.name}
                      onChange={(e) =>
                        handlePersonalChange("name", e.target.value)
                      }
                      placeholder="e.g. MD ROBIN MIA"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Professional Title
                    </label>
                    <Input
                      value={formData.personal.title}
                      onChange={(e) =>
                        handlePersonalChange("title", e.target.value)
                      }
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Location
                    </label>
                    <Input
                      value={formData.personal.location}
                      onChange={(e) =>
                        handlePersonalChange("location", e.target.value)
                      }
                      placeholder="e.g. Dhaka, Bangladesh"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Phone Number
                    </label>
                    <Input
                      value={formData.personal.phone}
                      onChange={(e) =>
                        handlePersonalChange("phone", e.target.value)
                      }
                      placeholder="e.g. +8801540374147"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Email Address
                    </label>
                    <Input
                      value={formData.personal.email}
                      onChange={(e) =>
                        handlePersonalChange("email", e.target.value)
                      }
                      placeholder="e.g. robindev2007@gmail.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      GitHub Profile URL
                    </label>
                    <Input
                      value={formData.personal.github?.url || ""}
                      onChange={(e) =>
                        handlePersonalChange("github", e.target.value)
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      LinkedIn Profile URL
                    </label>
                    <Input
                      value={formData.personal.linkedin?.url || ""}
                      onChange={(e) =>
                        handlePersonalChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  {/* Arbitrary Social & Portfolio Links with Platform Icon Detection */}
                  <div className="sm:col-span-2 pt-4 border-t border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Additional Social & Custom Links (
                          {formData.personal.links?.length || 0})
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Auto-detects icons for LeetCode, Play Store, Substack,
                          Medium, YouTube, Twitter/X, Discord, Portfolio...
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddSocialLink}
                        className="h-7 text-xs gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Link
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {formData.personal.links?.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 rounded-lg border border-slate-200 shrink-0 w-44">
                            <SocialIcon
                              url={link.url}
                              label={link.label}
                              className="w-3.5 h-3.5 text-slate-600"
                              showColor
                            />
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) =>
                                handleUpdateSocialLink(
                                  idx,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Label"
                              className="w-full text-xs py-1.5 font-semibold bg-transparent outline-none"
                            />
                          </div>

                          <Input
                            value={link.url}
                            onChange={(e) =>
                              handleUpdateSocialLink(idx, "url", e.target.value)
                            }
                            placeholder="URL (e.g. https://leetcode.com/username)"
                            className="flex-1 text-xs"
                          />

                          <button
                            type="button"
                            onClick={() => handleDeleteSocialLink(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : currentSection ? (
              /* Selected Dynamic Section Form */
              <div className="max-w-3xl space-y-6">
                {/* Section Header Controls */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div className="flex-1 mr-4 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Section Title
                    </label>
                    <Input
                      value={currentSection.title}
                      onChange={(e) =>
                        handleUpdateSectionTitle(
                          currentSection.id,
                          e.target.value,
                        )
                      }
                      className="font-bold text-sm bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs uppercase">
                      {currentSection.type}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateSection(currentSection.id)}
                      className="h-8 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer">
                      <Copy className="w-3.5 h-3.5 mr-1" /> Duplicate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSection(currentSection.id)}
                      className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>

                {/* 1. Text Section Editor */}
                {currentSection.type === "text" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Markdown Paragraph Content
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Supports **bold**, *italic*, `code`, [links](url)
                      </span>
                    </div>
                    <RichTextMarkdownEditor
                      value={currentSection.content}
                      onChange={handleUpdateTextContent}
                      placeholder="Write summary, background, or overview..."
                      rows={6}
                      showBulletScorer={false}
                    />
                  </div>
                )}

                {/* 2. Key-Value Matrix Section Editor */}
                {currentSection.type === "key_value" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block">
                          Category & Skill Badges (
                          {currentSection.items?.length || 0})
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Supports comma-separated skills and inline **bold**
                          highlighting.
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddKeyValueItem}
                        className="h-7 text-xs gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Category
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {currentSection.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={item.key}
                            onChange={(e) =>
                              handleUpdateKeyValueItem(
                                idx,
                                "key",
                                e.target.value,
                              )
                            }
                            placeholder="Category (e.g. Frontend)"
                            className="w-48 text-xs font-semibold"
                          />
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              handleUpdateKeyValueItem(
                                idx,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder="Comma-separated items (e.g. React, Next.js, TypeScript)"
                            className="flex-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteKeyValueItem(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. List Section Editor */}
                {currentSection.type === "list" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block">
                          List Items ({currentSection.items?.length || 0})
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Single-line items for Awards, Certifications, Honors,
                          Speaking.
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddListItem}
                        className="h-7 text-xs gap-1 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Item
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {currentSection.items?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="flex-1">
                            <RichTextMarkdownEditor
                              value={item}
                              onChange={(val) => handleUpdateListItem(idx, val)}
                              placeholder="Award, Certification, or milestone with **bold**..."
                              rows={1}
                              showBulletScorer={false}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteListItem(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 mt-6 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Items Section Editor (Experiences, Projects, Education) */}
                {currentSection.type === "items" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block">
                          Entries ({currentSection.entries?.length || 0})
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Drag grip handle to reorder entries.
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleAddItemEntry}
                        className="h-7 text-xs gap-1 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-xs">
                        <Plus className="w-3 h-3" /> Add Entry
                      </Button>
                    </div>

                    {/* DND Sortable Context for Item Entries */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleEntryDragEnd}>
                      <SortableContext
                        items={currentSection.entries.map(
                          (e, i) => e.id || `entry-${i}`,
                        )}
                        strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {currentSection.entries?.map((entry, entryIdx) => (
                            <SortableEntryItem
                              key={entry.id || `entry-${entryIdx}`}
                              entry={entry}
                              entryIndex={entryIdx}
                              totalEntries={currentSection.entries.length}
                              onUpdate={(field, val) =>
                                handleUpdateItemEntry(entryIdx, field, val)
                              }
                              onDelete={() => handleDeleteItemEntry(entryIdx)}
                              onDuplicate={() =>
                                handleDuplicateItemEntry(entryIdx)
                              }
                              onMoveUp={() => handleMoveEntry(entryIdx, "up")}
                              onMoveDown={() =>
                                handleMoveEntry(entryIdx, "down")
                              }
                              onAddHighlight={() =>
                                handleAddHighlight(entryIdx)
                              }
                              onUpdateHighlight={(hIdx, val) =>
                                handleUpdateHighlight(entryIdx, hIdx, val)
                              }
                              onDeleteHighlight={(hIdx) =>
                                handleDeleteHighlight(entryIdx, hIdx)
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-sm">
                Select a section from the left sidebar to edit its contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
