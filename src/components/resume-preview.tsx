import { normalizeToDocument } from "@/features/resume/default-data";
import type { ResumeData, TemplateType } from "@/types/resume";
import React from "react";
import { ClassicLatexTemplate } from "./templates/classic-latex";
import { CompactMinimalTemplate } from "./templates/compact-minimal";
import { ModernTechTemplate } from "./templates/modern-tech";
import { TwoColumnTemplate } from "./templates/two-column";

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  template,
}) => {
  const doc = normalizeToDocument(data);

  const renderTemplate = () => {
    switch (template) {
      case "classic-latex":
        return <ClassicLatexTemplate data={doc} />;
      case "two-column":
        return <TwoColumnTemplate data={doc} />;
      case "compact-minimal":
        return <CompactMinimalTemplate data={doc} />;
      case "modern-tech":
      default:
        return <ModernTechTemplate data={doc} />;
    }
  };

  return (
    <div className="w-[210mm] min-h-[297mm] p-[12mm_15mm] my-6 mx-auto bg-white shadow-xl relative print:m-0 print:p-[12mm_15mm] print:shadow-none print:w-full print:min-h-auto box-border">
      {renderTemplate()}
    </div>
  );
};
