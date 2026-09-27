import React from "react";

/**
 * Parses inline markdown formatted text (bold, italic, links, code, metrics) into React elements.
 * Example: "Built with **Next.js**, scaled to **100k+ users**, and increased speed by **+45%**."
 */
export function FormattedText({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  if (!text) return null;

  // Regex to detect markdown tokens:
  // 1. [label](url)
  // 2. **bold**
  // 3. *italic*
  // 4. `code`
  const regex = /(\[.*?\]\(https?:\/\/.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Markdown Link [Label](url)
        const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors">
              {label}
            </a>
          );
        }

        // Bold **text**
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          const boldInner = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold text-slate-950">
              {boldInner}
            </strong>
          );
        }

        // Italic *text*
        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <em key={index} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        }

        // Inline Code `text`
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={index}
              className="px-1 py-0.5 bg-slate-100 rounded text-[8.5pt] font-mono text-slate-800">
              {part.slice(1, -1)}
            </code>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
