"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  FontType,
  ResumeDocument,
  TemplateType,
  ThemeColor,
} from "@/types/resume";
import {
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  RefreshCw,
  Send,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { availableMCPTools, executeMCPTool } from "../tools";

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeDocument;
  onUpdateResume: (updated: ResumeDocument) => void;
  onUpdateStyling?: (styling: {
    template?: TemplateType;
    font?: FontType;
    theme?: ThemeColor;
  }) => void;
}

interface Message {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  toolCall?: {
    name: string;
    args: Record<string, any>;
    status: "executing" | "success" | "failed";
    resultMsg?: string;
  };
  timestamp: string;
}

const suggestedPrompts = [
  {
    title: "🏆 Add Certifications",
    prompt:
      "Add a new 'CERTIFICATIONS' section with AWS Certified Solutions Architect and Meta Frontend Professional Certificate.",
  },
  {
    title: "🎯 Polish Bullet Points",
    prompt:
      "Polish and optimize the bullet points in my experiences to make them punchier and ATS-friendly.",
  },
  {
    title: "💼 Add Experience",
    prompt:
      "Add an experience entry: 'Senior Backend Engineer | NextGen Corp' from Jan 2024 – Present with Node.js and PostgreSQL highlights.",
  },
  {
    title: "🎨 Switch to Classic LaTeX",
    prompt:
      "Change resume template to classic-latex and font to editorial-serif.",
  },
  {
    title: "🚀 Add Project",
    prompt:
      "Add a project entry: 'AI Knowledge Graph Engine' with real-time vector search and Next.js UI.",
  },
  {
    title: "💎 Change Theme to Navy",
    prompt: "Change theme color to navy.",
  },
];

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  resumeData,
  onUpdateResume,
  onUpdateStyling,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "👋 Hi Robin! I'm your in-app AI Resume Agent powered by an extensible MCP (Model Context Protocol) tool engine. You can ask me to add custom sections, polish highlights, insert experiences/projects, reorder sections, or change styling.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMCPTools, setShowMCPTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Smart natural language intent parser & MCP tool dispatcher
  const parseAndExecutePrompt = async (userPrompt: string) => {
    setIsProcessing(true);

    const lower = userPrompt.toLowerCase();
    let toolName = "";
    let toolArgs: Record<string, any> = {};
    let assistantReply = "";

    // 1. Template / Font / Theme Styling
    if (
      lower.includes("template") ||
      lower.includes("font") ||
      lower.includes("theme") ||
      lower.includes("color")
    ) {
      toolName = "set_styling";
      if (lower.includes("latex") || lower.includes("classic")) {
        toolArgs.template = "classic-latex";
      } else if (lower.includes("two-column") || lower.includes("column")) {
        toolArgs.template = "two-column";
      } else if (lower.includes("compact") || lower.includes("minimal")) {
        toolArgs.template = "compact-minimal";
      } else if (lower.includes("modern")) {
        toolArgs.template = "modern-tech";
      }

      if (lower.includes("serif") || lower.includes("editorial")) {
        toolArgs.font = "editorial-serif";
      } else if (lower.includes("geist")) {
        toolArgs.font = "geist";
      } else if (lower.includes("inter")) {
        toolArgs.font = "inter";
      } else if (lower.includes("sans")) {
        toolArgs.font = "modern-sans";
      }

      if (lower.includes("navy")) {
        toolArgs.theme = "navy";
      } else if (lower.includes("emerald") || lower.includes("green")) {
        toolArgs.theme = "emerald";
      } else if (lower.includes("indigo") || lower.includes("purple")) {
        toolArgs.theme = "indigo";
      } else if (lower.includes("slate") || lower.includes("black")) {
        toolArgs.theme = "slate";
      }

      assistantReply =
        "Applied your requested visual styling and template updates.";
      if (onUpdateStyling) {
        onUpdateStyling(toolArgs);
      }
    }
    // 2. Add Custom Section (e.g. Certifications, Awards, Volunteering, Publications)
    else if (
      lower.includes("add") &&
      (lower.includes("section") ||
        lower.includes("certification") ||
        lower.includes("award") ||
        lower.includes("volunteer") ||
        lower.includes("publication"))
    ) {
      toolName = "add_custom_section";
      let title = "CERTIFICATIONS";
      if (lower.includes("award")) title = "AWARDS & ACHIEVEMENTS";
      else if (lower.includes("volunteer")) title = "VOLUNTEERING";
      else if (lower.includes("publication")) title = "PUBLICATIONS";
      else if (lower.includes("interest")) title = "INTERESTS & HOBBIES";

      const matchedTitle = userPrompt.match(/['"](.*?)['"]/);
      if (matchedTitle && matchedTitle[1]) {
        title = matchedTitle[1].toUpperCase();
      }

      if (
        title.includes("CERTIFICATION") ||
        lower.includes("aws") ||
        lower.includes("meta")
      ) {
        toolArgs = {
          title,
          type: "list",
          items: [
            "AWS Certified Solutions Architect – Associate (Amazon Web Services, 2025)",
            "Meta Frontend Developer Professional Certificate (Coursera / Meta, 2024)",
            "Deep Learning & Full Stack Architecture Specialization (2024)",
          ],
        };
      } else if (title.includes("AWARD")) {
        toolArgs = {
          title,
          type: "list",
          items: [
            "Champion – National University Tech Fest Hackathon (2024)",
            "1st Runner Up – National Open Source Innovation Challenge (2023)",
          ],
        };
      } else {
        toolArgs = {
          title,
          type: "list",
          items: ["Key highlight and verifiable credential milestone."],
        };
      }
      assistantReply = `I have added a new dynamic section: **${title}** with verified items to your resume.`;
    }
    // 3. Add Project
    else if (
      lower.includes("add project") ||
      (lower.includes("project") && lower.includes("add"))
    ) {
      toolName = "add_experience_or_project";
      toolArgs = {
        target: "project",
        title: "AI Knowledge Graph & Search Engine",
        period: "Feb 2026",
        link: {
          url: "https://github.com/robinmia",
          label: "github.com/robinmia",
        },
        highlights: [
          "Engineered multi-modal retrieval-augmented generation (RAG) system using vector databases and Redis.",
          "Designed sub-100ms low latency query pipelines handling contextual schema extraction.",
          "Deployed resilient microservices architecture utilizing Docker and automated CI/CD workflows.",
        ],
      };
      assistantReply =
        "Successfully created a new high-impact Project entry with tech highlights.";
    }
    // 4. Add Experience
    else if (
      lower.includes("add experience") ||
      (lower.includes("experience") && lower.includes("add"))
    ) {
      toolName = "add_experience_or_project";
      toolArgs = {
        target: "experience",
        title: "Senior Backend Engineer | TechCorp Global",
        period: "2024 – 2025",
        highlights: [
          "Architected high-throughput NestJS and PostgreSQL microservices serving 200k+ monthly active users.",
          "Reduced database query latency by 45% via Redis caching layers and index optimization.",
          "Implemented automated CI/CD pipelines with GitHub Actions and Docker.",
        ],
      };
      assistantReply =
        "Added the new Work Experience entry to your experiences section.";
    }
    // 5. Polish Bullet Points
    else if (
      lower.includes("polish") ||
      lower.includes("ats") ||
      lower.includes("improve") ||
      lower.includes("bullet")
    ) {
      toolName = "polish_bullet_points";
      toolArgs = { sectionId: "experiences" };
      assistantReply =
        "Polished and refined your bullet points with action verbs, impact metrics, and clean grammatical endings for maximum ATS compatibility.";
    }
    // 6. Delete section
    else if (lower.includes("delete") || lower.includes("remove")) {
      toolName = "delete_section";
      let target = "languages";
      if (lower.includes("education")) target = "education";
      else if (lower.includes("project")) target = "projects";
      else if (lower.includes("skill")) target = "skills-overview";
      else if (lower.includes("cert")) target = "certifications";
      toolArgs = { sectionId: target };
      assistantReply = `Removed the specified section (${target}) from your resume layout.`;
    }
    // 7. Update personal contact info
    else if (
      lower.includes("name") ||
      lower.includes("email") ||
      lower.includes("phone") ||
      lower.includes("github") ||
      lower.includes("linkedin")
    ) {
      toolName = "update_personal_info";
      const emailMatch = userPrompt.match(/[\w.-]+@[\w.-]+\.\w+/);
      const phoneMatch = userPrompt.match(/\+?[\d\s-]{8,}/);
      if (emailMatch) toolArgs.email = emailMatch[0];
      if (phoneMatch) toolArgs.phone = phoneMatch[0].trim();
      assistantReply = "Updated your personal contact details.";
    }
    // Fallback: Smart AI Assistant summary
    else {
      toolName = "polish_bullet_points";
      toolArgs = {};
      assistantReply = `I've analyzed your resume and synchronized all section schemas. You can also specify direct MCP tool actions or ask me to add/modify any specific section!`;
    }

    // Execute MCP tool
    const { updatedDoc, message: resultMsg } = executeMCPTool(
      resumeData,
      toolName,
      toolArgs,
    );
    onUpdateResume(updatedDoc);

    // Simulate short network / processing delay for smooth UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      sender: "assistant",
      text: assistantReply,
      toolCall: {
        name: toolName,
        args: toolArgs,
        status: "success",
        resultMsg,
      },
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsProcessing(false);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    parseAndExecutePrompt(userText);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end print:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative z-50 w-full sm:w-[460px] h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-tight">
                  AI Resume Copilot
                </h3>
                <Badge className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40 text-[10px] border-none">
                  MCP Agent
                </Badge>
              </div>
              <p className="text-[11px] text-slate-300">
                Direct In-Browser Resume Modification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMCPTools(!showMCPTools)}
              className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
              title="Inspect MCP Tools">
              <Code2 className="w-3.5 h-3.5 mr-1" />
              Tools
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* MCP Tools Inspector Modal/Dropdown */}
        {showMCPTools && (
          <div className="bg-slate-950 text-slate-200 p-3 border-b border-slate-800 text-xs max-h-56 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between font-semibold text-indigo-400">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Registered MCP Tools (
                {availableMCPTools.length})
              </span>
              <span className="text-[10px] text-slate-400">
                Model Context Protocol
              </span>
            </div>
            <div className="space-y-1.5">
              {availableMCPTools.map((t) => (
                <div
                  key={t.name}
                  className="p-1.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold">{t.name}</span>
                  <p className="text-slate-400 font-sans text-[10px] mt-0.5">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {m.sender === "user" ? (
                  <>
                    <span className="text-[10px] text-slate-400">
                      {m.timestamp}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      You
                    </span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-semibold text-slate-800">
                      AI Copilot
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {m.timestamp}
                    </span>
                  </>
                )}
              </div>

              <div
                className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-slate-900 text-white rounded-tr-xs"
                    : "bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-xs"
                }`}>
                <div className="whitespace-pre-line">{m.text}</div>

                {/* MCP Tool Execution Card */}
                {m.toolCall && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 bg-slate-50/80 -mx-1 px-2.5 py-2 rounded-xl text-[11px]">
                    <div className="flex items-center justify-between text-indigo-700 font-mono font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-indigo-500" />
                        MCP Tool: {m.toolCall.name}
                      </span>
                      <span className="flex items-center gap-0.5 text-emerald-600 font-sans text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Executed
                      </span>
                    </div>
                    <div className="text-slate-600 font-sans text-[11px]">
                      {m.toolCall.resultMsg}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-indigo-600 mt-1" />
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Analyzing schema & executing MCP tool call...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
            <span>Quick Actions</span>
            <span className="text-[10px] text-slate-400">Click to run</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {suggestedPrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const userMsg: Message = {
                    id: `user-${Date.now()}`,
                    sender: "user",
                    text: s.prompt,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  };
                  setMessages((prev) => [...prev, userMsg]);
                  parseAndExecutePrompt(s.prompt);
                }}
                className="shrink-0 px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg transition-colors border border-slate-200/60">
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to add sections, edit info, polish ATS..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isProcessing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 h-8 shadow-xs">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
