import { FormattedText } from "@/lib/format-text";
import { SocialIcon } from "@/lib/social-icons";
import type { DynamicSection, ResumeDocument } from "@/types/resume";
import React from "react";

interface TemplateProps {
  data: ResumeDocument;
  isPageTwo?: boolean;
}

export const TwoColumnTemplate: React.FC<TemplateProps> = ({
  data,
  isPageTwo = false,
}) => {
  const p = data.personal || {};
  const activeSections = (data.sections || []).filter((s) => s.enabled);
  const sectionSpacing = data.meta?.themeConfig?.sectionSpacing ?? 6;

  // Split sections: Key-Value, Lists, Languages go to Sidebar; Summary, Experience, Projects, Education go to Main
  const sidebarSections = activeSections.filter(
    (s) =>
      s.type === "key_value" ||
      s.type === "list" ||
      s.id === "technical-skills" ||
      s.id === "languages",
  );
  const mainSections = activeSections.filter(
    (s) => !sidebarSections.includes(s),
  );

  const renderSection = (sec: DynamicSection, isSidebar = false) => {
    switch (sec.type) {
      case "text":
        return (
          <p className="text-justify leading-[1.3] text-[8.8pt] text-slate-800">
            <FormattedText text={sec.content} />
          </p>
        );

      case "key_value":
        return (
          <div className="flex flex-col gap-1.5 mt-0.5">
            {sec.items.map((item, idx) => (
              <div key={idx}>
                <div className="font-bold text-[8.8pt] text-slate-950">
                  {item.key}
                </div>
                <div className="text-[8.3pt] text-slate-700 leading-tight">
                  <FormattedText text={item.value} />
                </div>
              </div>
            ))}
          </div>
        );

      case "items":
        return (
          <div className="space-y-1.5 mt-0.5">
            {sec.entries.map((entry) => (
              <div key={entry.id}>
                <div className="flex justify-between items-baseline">
                  <span
                    className={`font-bold ${
                      isSidebar ? "text-[8.8pt]" : "text-[9.3pt]"
                    } text-slate-950`}>
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
                            className="w-3 h-3"
                          />
                          <span>{entry.link.label}</span>
                        </a>
                      </>
                    )}
                  </span>
                  <span
                    className={`font-bold ${
                      isSidebar ? "text-[8.2pt]" : "text-[8.6pt]"
                    } text-slate-700 shrink-0 ml-1`}>
                    {entry.period}
                  </span>
                </div>
                {entry.subtitle && (
                  <div className="italic text-[8.5pt] text-slate-600">
                    <FormattedText text={entry.subtitle} />
                  </div>
                )}
                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className="list-disc pl-3.5 mt-0.5 mb-1">
                    {entry.highlights.map((h, hIdx) => (
                      <li
                        key={hIdx}
                        className="mb-[1px] text-justify leading-[1.26] text-slate-900 text-[8.8pt]">
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
          <ul className="list-disc pl-3.5 mt-0.5 mb-1 text-[8.8pt]">
            {sec.items.map((item, idx) => (
              <li
                key={idx}
                className="mb-[1px] text-justify leading-[1.26] text-slate-900">
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
    rawUrl: string;
    isExternal?: boolean;
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
    <div className="w-full flex -m-[12mm_15mm] h-[297mm] max-h-[297mm] overflow-hidden">
      {/* Sidebar Column (32%) */}
      <aside className="w-[32%] bg-slate-50/80 border-r border-slate-200 p-[10mm_8mm_10mm_10mm] flex flex-col gap-3 shrink-0 h-full overflow-hidden">
        {/* Contact Block */}
        {!isPageTwo ? (
          <div>
            <h3 className="text-[9.8pt] font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-1.5 font-heading template-heading">
              Contact
            </h3>
            <div className="flex flex-col gap-1 text-[8.5pt] text-slate-800">
              {p.location && (
                <div className="flex items-center gap-1.5">
                  <SocialIcon
                    url="location"
                    className="w-3.5 h-3.5 text-slate-600"
                  />
                  <span>{p.location}</span>
                </div>
              )}
              {contactLinks.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <SocialIcon
                    url={item.rawUrl}
                    label={item.label}
                    className="w-3.5 h-3.5 text-slate-600"
                  />
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="hover:underline break-all">
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[8.5pt] font-bold text-slate-700 pb-1 border-b border-slate-200">
            <span>{p.name}</span>
          </div>
        )}

        {/* Dynamic Sidebar Sections */}
        {sidebarSections.map((sec) => (
          <div key={sec.id} style={{ marginTop: `${sectionSpacing}px` }}>
            <h3 className="text-[9.8pt] font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-1 font-heading template-heading">
              {sec.title}
            </h3>
            {renderSection(sec, true)}
          </div>
        ))}
      </aside>

      {/* Main Column (68%) */}
      <main className="w-[68%] p-[10mm_10mm_10mm_8mm] flex flex-col gap-2 h-full overflow-hidden">
        {/* Header */}
        {!isPageTwo ? (
          <header className="mb-0.5">
            <h1 className="text-[19pt] font-extrabold uppercase tracking-tight leading-none mb-1 font-heading template-name">
              {p.name}
            </h1>
            <div className="text-[10pt] font-semibold template-subtitle">
              {p.title}
            </div>
          </header>
        ) : (
          <header className="pb-1 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="font-bold text-slate-900">{p.name}</span>
            <span>{p.title}</span>
          </header>
        )}

        {/* Dynamic Main Column Sections */}
        {mainSections.map((sec) => (
          <section key={sec.id} style={{ marginTop: `${sectionSpacing}px` }}>
            <h2 className="text-[10.2pt] font-bold uppercase tracking-wider border-b-2 pb-0.5 mb-1 font-heading template-heading">
              {sec.title}
            </h2>
            {renderSection(sec, false)}
          </section>
        ))}
      </main>
    </div>
  );
};
