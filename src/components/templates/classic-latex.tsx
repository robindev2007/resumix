import { FormattedText } from "@/lib/format-text";
import { SocialIcon } from "@/lib/social-icons";
import type { DynamicSection, ResumeDocument } from "@/types/resume";
import React from "react";

interface TemplateProps {
  data: ResumeDocument;
  isPageTwo?: boolean;
}

export const ClassicLatexTemplate: React.FC<TemplateProps> = ({
  data,
  isPageTwo = false,
}) => {
  const p = data.personal || {};
  const activeSections = (data.sections || []).filter((s) => s.enabled);
  const sectionSpacing = data.meta?.themeConfig?.sectionSpacing ?? 8;

  const renderSection = (sec: DynamicSection) => {
    switch (sec.type) {
      case "text":
        return (
          <p className="text-justify leading-[1.35]">
            <FormattedText text={sec.content} />
          </p>
        );

      case "key_value":
        return (
          <table className="w-full border-collapse text-[9.5pt]">
            <tbody>
              {sec.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="font-bold w-[165px] pr-2 py-[1px] align-top whitespace-nowrap">
                    {item.key}
                  </td>
                  <td className="py-[1px] align-top">
                    <FormattedText text={item.value} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "items":
        return (
          <div className="space-y-1">
            {sec.entries.map((entry) => (
              <div key={entry.id} className="mt-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[9.8pt]">
                    <FormattedText text={entry.title} />
                    {entry.link && (
                      <>
                        {" "}
                        -{" "}
                        <a
                          href={entry.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline inline-flex items-center gap-1">
                          <SocialIcon
                            url={entry.link.url}
                            label={entry.link.label}
                            className="w-3 h-3"
                          />
                          <span>{entry.link.label}</span>
                        </a>
                      </>
                    )}
                  </span>
                  <span className="font-bold text-[9.5pt] shrink-0 ml-2">
                    {entry.period}
                  </span>
                </div>
                {entry.subtitle && (
                  <div className="italic text-[9.3pt]">
                    <FormattedText text={entry.subtitle} />
                  </div>
                )}
                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className="list-disc pl-4 mt-0.5 mb-1">
                    {entry.highlights.map((h, hIdx) => (
                      <li
                        key={hIdx}
                        className="mb-[1px] text-justify leading-[1.3]">
                        <FormattedText text={h} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case "list":
        return (
          <ul className="list-disc pl-4 mt-0.5 mb-1 text-[9.5pt]">
            {sec.items.map((item, idx) => (
              <li key={idx} className="mb-[1px] text-justify leading-[1.3]">
                <FormattedText text={item} />
              </li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  const contactLinks: {
    label: string;
    href: string;
    isExternal?: boolean;
    rawUrl: string;
  }[] = [];
  if (p.phone)
    contactLinks.push({
      label: p.phone,
      href: `tel:${p.phone}`,
      rawUrl: p.phone,
    });
  if (p.email)
    contactLinks.push({
      label: p.email,
      href: `mailto:${p.email}`,
      rawUrl: p.email,
    });
  if (p.linkedin)
    contactLinks.push({
      label: p.linkedin.label,
      href: p.linkedin.url,
      rawUrl: p.linkedin.url,
      isExternal: true,
    });
  if (p.github)
    contactLinks.push({
      label: p.github.label,
      href: p.github.url,
      rawUrl: p.github.url,
      isExternal: true,
    });
  if (p.links) {
    p.links.forEach((l) => {
      contactLinks.push({
        label: l.label,
        href: l.url,
        rawUrl: l.url,
        isExternal: true,
      });
    });
  }

  return (
    <div className="w-full text-black leading-[1.32] text-[9.5pt] font-serif">
      {/* LaTeX Authentic Academic Header */}
      {!isPageTwo ? (
        <header className="text-center mb-2">
          <h1 className="text-[19pt] font-bold tracking-tight uppercase leading-none mb-1">
            {p.name}
          </h1>
          <div className="text-[10pt] italic text-slate-800 mb-1">
            {p.title} {p.location && <>&nbsp;•&nbsp; {p.location}</>}
          </div>
          <div className="text-[9.2pt] flex justify-center items-center flex-wrap gap-x-2.5 gap-y-1 text-slate-800 font-sans">
            {contactLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                <a
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className="hover:underline inline-flex items-center gap-1">
                  <SocialIcon
                    url={item.rawUrl}
                    label={item.label}
                    className="w-3.5 h-3.5"
                  />
                  <span>{item.label}</span>
                </a>
                {idx < contactLinks.length - 1 && (
                  <span className="text-slate-400">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </header>
      ) : (
        <header className="border-b border-black pb-1 mb-1 flex items-center justify-between text-[8.5pt] text-slate-600 font-sans">
          <span className="font-bold text-black">{p.name}</span>
          <span>{p.title}</span>
        </header>
      )}

      {/* Dynamic Sections Engine */}
      {activeSections.map((sec) => (
        <section key={sec.id} style={{ marginTop: `${sectionSpacing}px` }}>
          <h2 className="text-[10.5pt] font-bold uppercase tracking-wider border-b border-black pb-[1px] mb-1">
            {sec.title}
          </h2>
          {renderSection(sec)}
        </section>
      ))}
    </div>
  );
};
