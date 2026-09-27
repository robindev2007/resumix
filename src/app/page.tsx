"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EditorModal } from "@/features/resume/components/EditorModal";
import { MicroStylingPanel } from "@/features/resume/components/MicroStylingPanel";
import { ResumePreview } from "@/features/resume/components/ResumePreview";
import { StudioBottomBar } from "@/features/resume/components/StudioBottomBar";
import { ZoomCanvas } from "@/features/resume/components/ZoomCanvas";
import {
  defaultResumeDoc,
  normalizeToDocument,
} from "@/features/resume/default-data";
import type {
  FontType,
  PageDensity,
  PaperSize,
  ResumeDocument,
  TemplateType,
  ThemeColor,
  ThemeConfig,
} from "@/types/resume";

export default function ResumeStudioPage() {
  const [resumeData, setResumeData] =
    useState<ResumeDocument>(defaultResumeDoc);
  const [template, setTemplate] = useState<TemplateType>("modern-tech");
  const [font, setFont] = useState<FontType>("modern-sans");
  const [theme, setTheme] = useState<ThemeColor>("slate");
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [density, setDensity] = useState<PageDensity>("normal");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({});
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activePage, setActivePage] = useState<number>(1);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [isPanToolActive, setIsPanToolActive] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isStylingOpen, setIsStylingOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedData = localStorage.getItem("resume_v2_data");
      if (savedData) {
        setResumeData(normalizeToDocument(JSON.parse(savedData)));
      } else {
        const legacyData = localStorage.getItem("resume_custom_data");
        if (legacyData) {
          setResumeData(normalizeToDocument(JSON.parse(legacyData)));
        }
      }
      const savedTpl = localStorage.getItem("resume_preferred_template");
      if (savedTpl) setTemplate(savedTpl as TemplateType);

      const savedFont = localStorage.getItem("resume_preferred_font");
      if (savedFont) setFont(savedFont as FontType);

      const savedTheme = localStorage.getItem("resume_preferred_theme");
      if (savedTheme) setTheme(savedTheme as ThemeColor);

      const savedPaper = localStorage.getItem("resume_preferred_paper");
      if (savedPaper) setPaperSize(savedPaper as PaperSize);

      const savedDensity = localStorage.getItem("resume_preferred_density");
      if (savedDensity) setDensity(savedDensity as PageDensity);

      const savedThemeConfig = localStorage.getItem("resume_v2_theme_config");
      if (savedThemeConfig) setThemeConfig(JSON.parse(savedThemeConfig));
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }, []);

  const handleTemplateChange = (t: TemplateType) => {
    setTemplate(t);
    try {
      localStorage.setItem("resume_preferred_template", t);
    } catch {}
  };

  const handleFontChange = (f: FontType) => {
    setFont(f);
    try {
      localStorage.setItem("resume_preferred_font", f);
    } catch {}
  };

  const handleThemeChange = (th: ThemeColor) => {
    setTheme(th);
    try {
      localStorage.setItem("resume_preferred_theme", th);
    } catch {}
  };

  const handlePaperSizeChange = (ps: PaperSize) => {
    setPaperSize(ps);
    try {
      localStorage.setItem("resume_preferred_paper", ps);
    } catch {}
  };

  const handleDensityChange = (d: PageDensity) => {
    setDensity(d);
    try {
      localStorage.setItem("resume_preferred_density", d);
    } catch {}
  };

  const handleThemeConfigChange = (tc: ThemeConfig) => {
    setThemeConfig(tc);
    try {
      localStorage.setItem("resume_v2_theme_config", JSON.stringify(tc));
    } catch {}
  };

  const handleResetStyling = () => {
    setThemeConfig({});
    setFont("modern-sans");
    setTheme("slate");
    setPaperSize("A4");
    setDensity("normal");
    try {
      localStorage.removeItem("resume_v2_theme_config");
      localStorage.setItem("resume_preferred_font", "modern-sans");
      localStorage.setItem("resume_preferred_theme", "slate");
      localStorage.setItem("resume_preferred_paper", "A4");
      localStorage.setItem("resume_preferred_density", "normal");
    } catch {}
  };

  const handleSaveData = (updated: ResumeDocument) => {
    setResumeData(updated);
    try {
      localStorage.setItem("resume_v2_data", JSON.stringify(updated));
    } catch {}
  };

  const handleImportData = (imported: any) => {
    const normalized = normalizeToDocument(imported);
    setResumeData(normalized);
    try {
      localStorage.setItem("resume_v2_data", JSON.stringify(normalized));
    } catch {}
  };

  const handleResetData = () => {
    if (
      confirm(
        "Reset all resume sections and details back to the original default data?",
      )
    ) {
      setResumeData(defaultResumeDoc);
      try {
        localStorage.removeItem("resume_v2_data");
        localStorage.removeItem("resume_custom_data");
      } catch {}
    }
  };

  // Zoom and Canvas Action Handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(Number((prev + 0.1).toFixed(2)), 4.0));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(Number((prev - 0.1).toFixed(2)), 0.15));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleFitPage = useCallback(() => {
    const a4WidthPx = paperSize === "A4" ? 794 : 816;
    const availableWidth = window.innerWidth - 80;
    if (availableWidth > 0) {
      const calculatedScale = Math.min(
        Math.max(Number((availableWidth / a4WidthPx).toFixed(2)), 0.15),
        4.0,
      );
      setZoom(calculatedScale);
    }
  }, [paperSize]);

  const handleScrollToPage = (pageNum: number) => {
    setActivePage(pageNum);
    // ZoomCanvas.handleScrollToPage will do the actual pan-to-page via DOM rect
  };


  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm font-medium">
        Loading Resume Studio...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen h-screen bg-background text-foreground font-${font} theme-${theme} overflow-hidden relative print:overflow-visible print:h-auto print:min-h-0`}
    >
      {/* Full-screen canvas — bottom bar floats over it as a fixed overlay */}
      <main className="absolute inset-0 print:static print:inset-auto print:overflow-visible">
        <ZoomCanvas
          totalPages={totalPages}
          activePage={activePage}
          onSelectPage={handleScrollToPage}
          zoom={zoom}
          onZoomChange={setZoom}
          isPanToolActive={isPanToolActive}
        >
          <ResumePreview
            data={resumeData}
            template={template}
            font={font}
            theme={theme}
            paperSize={paperSize}
            density={density}
            themeConfig={themeConfig}
            onPageCountChange={setTotalPages}
            onOverflowStatusChange={setIsOverflowing}
            className="shadow-2xl border border-slate-200/80 rounded-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-300 print:shadow-none print:border-0"
          />
        </ZoomCanvas>
      </main>

      {/* Unified Floating Studio Bottom Bar */}
      <StudioBottomBar
        template={template}
        font={font}
        theme={theme}
        paperSize={paperSize}
        density={density}
        themeConfig={themeConfig}
        zoom={zoom}
        isPanToolActive={isPanToolActive}
        totalPages={totalPages}
        activePage={activePage}
        isOverflowing={isOverflowing}
        resumeData={resumeData}
        onTemplateChange={handleTemplateChange}
        onFontChange={handleFontChange}
        onThemeChange={handleThemeChange}
        onPaperSizeChange={handlePaperSizeChange}
        onDensityChange={handleDensityChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitPage={handleFitPage}
        onTogglePanTool={() => setIsPanToolActive((prev) => !prev)}
        onSelectPage={handleScrollToPage}
        onOpenEditor={() => setIsEditorOpen(true)}
        onOpenStyling={() => setIsStylingOpen(true)}
        onReset={handleResetData}
        onImportData={handleImportData}
        onExportPdf={() => window.print()}
      />

      {/* Content & Dynamic Sections Editor Modal */}
      <EditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        data={resumeData}
        onSave={handleSaveData}
        onReset={handleResetData}
      />

      {/* Micro-Styling & Layout Controls Drawer */}
      <MicroStylingPanel
        isOpen={isStylingOpen}
        onClose={() => setIsStylingOpen(false)}
        font={font}
        theme={theme}
        paperSize={paperSize}
        density={density}
        themeConfig={themeConfig}
        onFontChange={handleFontChange}
        onThemeChange={handleThemeChange}
        onPaperSizeChange={handlePaperSizeChange}
        onDensityChange={handleDensityChange}
        onThemeConfigChange={handleThemeConfigChange}
        onResetStyling={handleResetStyling}
      />
    </div>
  );
}
