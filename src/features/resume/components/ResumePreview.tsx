"use client";

import { ClassicLatexTemplate } from "@/components/templates/classic-latex";
import { CompactMinimalTemplate } from "@/components/templates/compact-minimal";
import { ModernTechTemplate } from "@/components/templates/modern-tech";
import { TwoColumnTemplate } from "@/components/templates/two-column";
import { getThemeVariables } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { normalizeToDocument } from "../default-data";
import type {
  DynamicSection,
  FontType,
  PageDensity,
  PaperSize,
  ResumeData,
  ResumeDocument,
  TemplateType,
  ThemeColor,
  ThemeConfig,
} from "../types";

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
  font?: FontType;
  theme?: ThemeColor;
  paperSize?: PaperSize;
  density?: PageDensity;
  themeConfig?: ThemeConfig;
  pageMode?: "auto" | "single" | "multi";
  className?: string;
  onPageCountChange?: (count: number) => void;
  onOverflowStatusChange?: (isOverflowing: boolean) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  template,
  font = "modern-sans",
  theme = "slate",
  paperSize = "A4",
  density = "normal",
  themeConfig,
  pageMode = "auto",
  className,
  onPageCountChange,
  onOverflowStatusChange,
}) => {
  const doc = useMemo(() => normalizeToDocument(data), [data]);
  const activeThemeConfig = themeConfig || doc.meta?.themeConfig;

  // Accurately compute section weights and fill Page 1 completely before overflowing
  const { pageDocuments, totalPages, isOverflowing } = useMemo(() => {
    const activeSections = (doc.sections || []).filter((s) => s.enabled);

    // Calculate height weight of each section in line units
    const getSectionWeight = (
      sec: DynamicSection,
      isNarrowColumn = false,
    ): number => {
      let w = 1.5; // Section title & divider
      const lineMultiplier = isNarrowColumn ? 1.35 : 1.0;

      if (sec.type === "text") {
        const lines = Math.max(
          1,
          Math.ceil((sec.content?.length || 0) / (isNarrowColumn ? 75 : 110)),
        );
        w += lines * 0.95;
      } else if (sec.type === "key_value") {
        w += (sec.items?.length || 0) * (isNarrowColumn ? 1.2 : 0.95);
      } else if (sec.type === "items") {
        sec.entries?.forEach((entry) => {
          w += 1.2;
          if (entry.subtitle) w += 0.7;
          if (entry.highlights?.length) {
            entry.highlights.forEach((h) => {
              const hLines = Math.max(
                1,
                Math.ceil(h.length / (isNarrowColumn ? 68 : 100)),
              );
              w += hLines * 0.9;
            });
          }
        });
      } else if (sec.type === "list") {
        w += (sec.items?.length || 0) * 0.85;
      }
      return w * (isNarrowColumn ? 1.0 : lineMultiplier);
    };

    const isTwoCol = template === "two-column";

    // For two-column template:
    // Sidebar: key_value, list, technical-skills, languages
    // Main: summary, experiences, projects, education
    const isSidebarSection = (sec: DynamicSection) =>
      sec.type === "key_value" ||
      sec.type === "list" ||
      sec.id === "technical-skills" ||
      sec.id === "languages";

    let mainWeight = 0;
    let sidebarWeight = 0;
    let singleColWeight = 0;
    let hasManualPageBreak = false;

    activeSections.forEach((sec) => {
      if (sec.pageBreakBefore) hasManualPageBreak = true;
      if (isTwoCol) {
        if (isSidebarSection(sec)) {
          sidebarWeight += getSectionWeight(sec, true);
        } else {
          mainWeight += getSectionWeight(sec, true);
        }
      } else {
        singleColWeight += getSectionWeight(sec, false);
      }
    });

    // Calibrate line capacities for standard single page A4
    let page1Capacity = 58;
    if (density === "compact") page1Capacity = 68;
    if (density === "spacious") page1Capacity = 46;
    if (template === "compact-minimal") page1Capacity = 68;

    // Two-column Main Column capacity (68% width after header ~30 lines)
    const twoColMainCapacity =
      density === "compact" ? 38 : density === "spacious" ? 26 : 32;

    const totalWeight = isTwoCol ? mainWeight : singleColWeight;
    const capacityLimit = isTwoCol ? twoColMainCapacity : page1Capacity;

    const overflowing = totalWeight > capacityLimit;

    // Strict 1-Page mode or auto when content fits within capacity
    if (
      pageMode === "single" ||
      (!hasManualPageBreak &&
        pageMode === "auto" &&
        totalWeight <= capacityLimit) ||
      activeSections.length <= 1
    ) {
      return {
        pageDocuments: [doc],
        totalPages: 1,
        isOverflowing: overflowing,
      };
    }

    // Pack Page 1 up to capacity and flow cleanly onto Page 2
    const page1Sections: DynamicSection[] = [];
    const page2Sections: DynamicSection[] = [];
    let currentMainWeight = 0;
    let currentSingleWeight = 0;
    let reachedPage2 = false;

    activeSections.forEach((sec) => {
      const isSidebar = isTwoCol && isSidebarSection(sec);
      const secWeight = getSectionWeight(sec, isTwoCol);

      // Manual page break
      if (sec.pageBreakBefore) {
        reachedPage2 = true;
      }

      if (isTwoCol) {
        if (!isSidebar) {
          if (
            !reachedPage2 &&
            (currentMainWeight + secWeight <= twoColMainCapacity ||
              page1Sections.filter((s) => !isSidebarSection(s)).length === 0)
          ) {
            page1Sections.push(sec);
            currentMainWeight += secWeight;
          } else {
            reachedPage2 = true;
            page2Sections.push(sec);
          }
        } else {
          // Sidebar sections are placed on Page 1 (and Page 2 if excess)
          if (!reachedPage2 || page1Sections.length <= 2) {
            page1Sections.push(sec);
          } else {
            page2Sections.push(sec);
          }
        }
      } else {
        if (
          !reachedPage2 &&
          (currentSingleWeight + secWeight <= page1Capacity ||
            page1Sections.length === 0)
        ) {
          page1Sections.push(sec);
          currentSingleWeight += secWeight;
        } else {
          reachedPage2 = true;
          page2Sections.push(sec);
        }
      }
    });

    const page1Doc: ResumeDocument = {
      ...doc,
      sections: page1Sections,
    };

    const page2Doc: ResumeDocument = {
      ...doc,
      sections: page2Sections,
    };

    return {
      pageDocuments:
        page2Sections.length > 0 ? [page1Doc, page2Doc] : [page1Doc],
      totalPages: page2Sections.length > 0 ? 2 : 1,
      isOverflowing: overflowing,
    };
  }, [doc, pageMode, density, template, activeThemeConfig]);

  React.useEffect(() => {
    if (onPageCountChange) {
      onPageCountChange(totalPages);
    }
    if (onOverflowStatusChange) {
      onOverflowStatusChange(isOverflowing);
    }
  }, [totalPages, isOverflowing, onPageCountChange, onOverflowStatusChange]);

  const renderTemplateForDoc = (d: ResumeDocument, isPageTwo = false) => {
    switch (template) {
      case "classic-latex":
        return <ClassicLatexTemplate data={d} isPageTwo={isPageTwo} />;
      case "two-column":
        return <TwoColumnTemplate data={d} isPageTwo={isPageTwo} />;
      case "compact-minimal":
        return <CompactMinimalTemplate data={d} isPageTwo={isPageTwo} />;
      case "modern-tech":
      default:
        return <ModernTechTemplate data={d} isPageTwo={isPageTwo} />;
    }
  };

  const paperSizeClass =
    paperSize === "Letter"
      ? "w-[215.9mm] h-[279.4mm] max-h-[279.4mm]"
      : "w-[210mm] h-[297mm] max-h-[297mm]";

  const densityClass =
    density === "compact"
      ? "[&_*]:leading-[1.22] [&_p]:text-[8.8pt] [&_li]:text-[8.8pt] [&_td]:text-[8.8pt]"
      : density === "spacious"
        ? "[&_*]:leading-[1.45] [&_p]:text-[9.8pt] [&_li]:text-[9.8pt] [&_td]:text-[9.8pt]"
        : "";

  const themeVars = getThemeVariables(theme, activeThemeConfig);
  const customMargin = activeThemeConfig?.pageMargin
    ? `${activeThemeConfig.pageMargin}mm`
    : "12mm 15mm";

  return (
    <div
      style={themeVars}
      className="flex flex-col items-center gap-6 print:gap-0 w-full">
      {pageDocuments.map((pageDoc, idx) => {
        const pageNum = idx + 1;
        const isPageTwo = idx > 0;

        return (
          <div key={pageNum} className="flex flex-col items-center w-full">
            {/* The Clean Resume Document Box (Rigid A4/Letter size, no bottom footer inside) */}
            <div
              id={`resume-page-${pageNum}`}
              data-page={pageNum}
              style={{ padding: customMargin }}
              className={cn(
                "resume-a4-page bg-white shadow-2xl rounded-xs box-border relative flex flex-col justify-start transition-shadow overflow-hidden",
                `font-${font}`,
                `theme-${theme}`,
                paperSizeClass,
                densityClass,
                "print:m-0 print:shadow-none print:w-full print:h-[297mm] print:break-after-page",
                className,
              )}>
              {/* Page Content */}
              <div className="w-full h-full overflow-hidden">
                {renderTemplateForDoc(pageDoc, isPageTwo)}
              </div>
            </div>

            {/* Outside Canvas Page Indicator (UI only, hidden in print/export) */}
            {totalPages > 1 && (
              <div className="mt-2.5 text-[11px] font-mono font-medium text-slate-400 print:hidden select-none bg-slate-100/80 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
                Page {pageNum} of {totalPages}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
