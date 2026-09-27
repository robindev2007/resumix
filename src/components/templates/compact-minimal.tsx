import { FormattedText } from "@/lib/format-text";
import { SocialIcon } from "@/lib/social-icons";
import type { DynamicSection, ResumeDocument } from "@/types/resume";
import React from "react";

interface TemplateProps {
  data: ResumeDocument;
  isPageTwo?: boolean;
}

export const CompactMinimalTemplate: React.FC<TemplateProps> = ({
  data,
  isPageTwo = false,
}) => {
  const p = data.personal || {};
  const activeSections = (data.sections || []).filter((s) => s.enabled);
  const sectionSpacing = data.meta?.themeConfig?.sectionSpacing ?? 6;

  const renderSection = (sec: DynamicSection) => {
    switch (sec.type) {
      case "text":
        return (
          <p className="text-justify leading-[1.32] text-[9pt] text-slate-800">
            <FormattedText text={sec.content} />
          </p>
        );

      case "key_value":
        return (
          <table className="w-full border-collapse text-[9pt]">
            <tbody>
              {sec.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="font-bold w-[155px] pr-2 py-[1px] align-top whitespace-nowrap text-slate-950">
                    {item.key}
                  </td>
                  <td className="py-[1px] align-top text-slate-800">
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
                  <span className="font-bold text-[9.3pt] text-slate-950">
                    <FormattedText text={entry.title} />
                    {entry.link && (
                      <>
                        {" "}
                        -{" "}
                        <a
                          href={entry.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold template-link inline-flex items-center gap-1">
                          <SocialIcon
                            url={entry.link.url}
                            label={entry.link.label}
                            className="w-3 h-3 text-slate-600"
                          />
                          <span>{entry.link.label}</span>
                        </a>
                      </>
                    )}
                  </span>
                  <span className="font-bold text-[8.8pt] text-slate-700 shrink-0 ml-1">
                    {entry.period}
                  </span>
                </div>
                {entry.subtitle && (
                  <div className="italic text-[8.8pt] text-slate-600">
                    <FormattedText text={entry.subtitle} />
                  </div>
                )}
                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className="list-disc pl-3.5 mt-0.5 mb-1">
                    {entry.highlights.map((h, hIdx) => (
                      <li
                        key={hIdx}
                        className="mb-[1px] text-justify leading-[1.28] text-slate-900 text-[9pt]">
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
          <ul className="list-disc pl-3.5 mt-0.5 mb-1 text-[9pt]">
            {sec.items.map((item, idx) => (
              <li
                key={idx}
                className="mb-[1px] text-justify leading-[1.28] text-slate-900">
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
    <div className="w-full text-slate-900 leading-[1.3] text-[9pt]">
      {/* Header */}
      {!isPageTwo ? (
        <header className="border-b-2 pb-2 mb-2 template-heading">
          <div className="flex justify-between items-end flex-wrap gap-2">
            <div>
              <h1 className="text-[18pt] font-black uppercase tracking-tight leading-none template-name">
                {p.name}
              </h1>
              <div className="text-[10pt] font-bold text-slate-700 mt-0.5 template-subtitle">
                {p.title} {p.location && <>&nbsp;•&nbsp; {p.location}</>}
              </div>
            </div>

            <div className="text-[8.5pt] flex flex-wrap gap-x-2 gap-y-0.5 text-slate-700 justify-end">
              {contactLinks.map((item, idx) => (
                <React.Fragment key={idx}>
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="hover:underline font-medium inline-flex items-center gap-1">
                    <SocialIcon
                      url={item.rawUrl}
                      label={item.label}
                      className="w-3 h-3 text-slate-600"
                    />
                    <span>{item.label}</span>
                  </a>
                  {idx < contactLinks.length - 1 && (
                    <span className="text-slate-300">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>
      ) : (
        <header className="border-b pb-1 mb-1 border-slate-200 flex items-center justify-between text-[8.5pt] text-slate-500 font-mono">
          <span className="font-bold text-slate-900">{p.name}</span>
          <span>{p.title}</span>
        </header>
      )}

      {/* Dynamic Sections Engine */}
      {activeSections.map((sec) => (
        <section key={sec.id} style={{ marginTop: `${sectionSpacing}px` }}>
          <h2 className="text-[9.8pt] font-black uppercase tracking-wider border-b pb-[1px] mb-1 template-heading">
            {sec.title}
          </h2>
          {renderSection(sec)}
        </section>
      ))}
    </div>
  );
};
