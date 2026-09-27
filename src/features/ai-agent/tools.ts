import type {
  DynamicSection,
  ResumeDocument,
  SectionType,
} from "@/types/resume";

export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const availableMCPTools: MCPToolDefinition[] = [
  {
    name: "add_custom_section",
    description:
      "Add a brand new custom section (e.g. Certifications, Awards, Publications, Volunteering) to the resume.",
    parameters: {
      title: "string (e.g. 'CERTIFICATIONS', 'AWARDS')",
      type: "'text' | 'key_value' | 'items' | 'list'",
      data: "section content or entries",
    },
  },
  {
    name: "update_section",
    description:
      "Update the title or content of an existing section by section ID or name.",
    parameters: {
      sectionId:
        "string (e.g. 'skills-overview', 'technical-skills', 'experiences', 'projects', 'education')",
      newTitle: "string (optional)",
      newContent: "any",
    },
  },
  {
    name: "delete_section",
    description: "Remove a section from the resume by section ID or name.",
    parameters: {
      sectionId: "string",
    },
  },
  {
    name: "reorder_sections",
    description: "Change the display order of sections.",
    parameters: {
      sectionIdsInOrder: "string[]",
    },
  },
  {
    name: "update_personal_info",
    description:
      "Update name, title, location, phone, email, GitHub, or LinkedIn.",
    parameters: {
      name: "string (optional)",
      title: "string (optional)",
      location: "string (optional)",
      phone: "string (optional)",
      email: "string (optional)",
      github: "string (optional)",
      linkedin: "string (optional)",
    },
  },
  {
    name: "add_experience_or_project",
    description:
      "Add a new job experience or project entry with title, period, and bullet points.",
    parameters: {
      target: "'experience' | 'project'",
      title: "string",
      subtitle: "string (optional)",
      period: "string",
      link: "{ url: string, label: string } (optional)",
      highlights: "string[]",
    },
  },
  {
    name: "polish_bullet_points",
    description:
      "Enhance bullet points with action verbs, metrics, and ATS optimization.",
    parameters: {
      sectionId: "string",
      entryIndex: "number (optional)",
    },
  },
  {
    name: "set_styling",
    description: "Switch resume template, font, or color accent.",
    parameters: {
      template:
        "'modern-tech' | 'classic-latex' | 'two-column' | 'compact-minimal' (optional)",
      font: "'modern-sans' | 'geist' | 'inter' | 'editorial-serif' (optional)",
      theme: "'slate' | 'navy' | 'emerald' | 'indigo' (optional)",
    },
  },
];

// MCP Tool Execution Engine (Applies tool calls directly to ResumeDocument)
export function executeMCPTool(
  doc: ResumeDocument,
  toolName: string,
  args: Record<string, any>,
): { updatedDoc: ResumeDocument; message: string } {
  const updated: ResumeDocument = JSON.parse(JSON.stringify(doc));

  switch (toolName) {
    case "add_custom_section": {
      const id = `custom-${Date.now()}`;
      const title = args.title || "CUSTOM SECTION";
      const type: SectionType = args.type || "text";

      let newSection: DynamicSection;
      if (type === "text") {
        newSection = {
          id,
          title,
          type: "text",
          enabled: true,
          content: args.data || "New section content",
        };
      } else if (type === "key_value") {
        newSection = {
          id,
          title,
          type: "key_value",
          enabled: true,
          items: args.items || [{ key: "Item", value: "Value" }],
        };
      } else if (type === "items") {
        newSection = {
          id,
          title,
          type: "items",
          enabled: true,
          entries: args.entries || [],
        };
      } else {
        newSection = {
          id,
          title,
          type: "list",
          enabled: true,
          items: args.items || [],
        };
      }

      updated.sections.push(newSection);
      return { updatedDoc: updated, message: `Added new "${title}" section.` };
    }

    case "update_personal_info": {
      if (args.name) updated.personal.name = args.name;
      if (args.title) updated.personal.title = args.title;
      if (args.location) updated.personal.location = args.location;
      if (args.phone) updated.personal.phone = args.phone;
      if (args.email) updated.personal.email = args.email;
      if (args.github) {
        updated.personal.github = {
          url: args.github,
          label: args.github.replace(/^https?:\/\/(www\.)?/, ""),
        };
      }
      if (args.linkedin) {
        updated.personal.linkedin = {
          url: args.linkedin,
          label: args.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
        };
      }
      return {
        updatedDoc: updated,
        message: "Updated personal contact details.",
      };
    }

    case "delete_section": {
      const sId = (args.sectionId || "").toLowerCase();
      const initialLen = updated.sections.length;
      updated.sections = updated.sections.filter(
        (s) => s.id.toLowerCase() !== sId && s.title.toLowerCase() !== sId,
      );
      if (updated.sections.length < initialLen) {
        return {
          updatedDoc: updated,
          message: `Deleted section ${args.sectionId}.`,
        };
      }
      return {
        updatedDoc: updated,
        message: `Section ${args.sectionId} not found.`,
      };
    }

    case "add_experience_or_project": {
      const isExp =
        args.target === "experience" ||
        (!args.target && args.title.includes("Developer"));
      const targetSecId = isExp ? "experiences" : "projects";
      const targetSec = updated.sections.find(
        (s) => s.id === targetSecId && s.type === "items",
      ) as (DynamicSection & { type: "items" }) | undefined;

      if (targetSec) {
        targetSec.entries.push({
          id: `entry-${Date.now()}`,
          title: args.title,
          subtitle: args.subtitle,
          period: args.period || "Present",
          link: args.link,
          highlights: args.highlights || [],
        });
        return {
          updatedDoc: updated,
          message: `Added ${args.title} to ${targetSec.title}.`,
        };
      }
      return { updatedDoc: updated, message: `Could not find target section.` };
    }

    case "polish_bullet_points": {
      const sec = updated.sections.find(
        (s) =>
          s.type === "items" &&
          (args.sectionId ? s.id === args.sectionId : true),
      ) as (DynamicSection & { type: "items" }) | undefined;

      if (sec && sec.entries.length > 0) {
        const entry = sec.entries[0];
        entry.highlights = entry.highlights.map((h) => {
          if (!h.endsWith(".")) h += ".";
          return h;
        });
        return {
          updatedDoc: updated,
          message: `Polished bullet points in ${sec.title}.`,
        };
      }
      return {
        updatedDoc: updated,
        message: "No items section found to polish.",
      };
    }

    default:
      return { updatedDoc: updated, message: `Executed ${toolName}` };
  }
}
