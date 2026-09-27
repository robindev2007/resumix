export interface SocialLink {
  id?: string;
  type?:
    | "linkedin"
    | "github"
    | "portfolio"
    | "twitter"
    | "leetcode"
    | "playstore"
    | "appstore"
    | "medium"
    | "substack"
    | "youtube"
    | "discord"
    | "gitlab"
    | "kaggle"
    | "dribbble"
    | "custom"
    | string;
  label: string;
  url: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  linkedin?: {
    url: string;
    label: string;
  };
  github?: {
    url: string;
    label: string;
  };
  links?: SocialLink[];
}

export type SectionType = "text" | "key_value" | "items" | "list";

export interface BaseSection {
  id: string;
  title: string;
  type: SectionType;
  enabled?: boolean;
  pageBreakBefore?: boolean;
  icon?: string;
}

export interface TextSection extends BaseSection {
  type: "text";
  content: string;
}

export interface KeyValueItem {
  key: string;
  value: string;
}

export interface KeyValueSection extends BaseSection {
  type: "key_value";
  items: KeyValueItem[];
}

export interface ItemEntry {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  location?: string;
  link?: {
    url: string;
    label: string;
  };
  highlights: string[];
}

export interface ItemsSection extends BaseSection {
  type: "items";
  entries: ItemEntry[];
}

export interface ListSection extends BaseSection {
  type: "list";
  items: string[];
}

export type DynamicSection =
  | TextSection
  | KeyValueSection
  | ItemsSection
  | ListSection;

export interface ThemeConfig {
  primaryColor?: string; // Hex color for headings, titles, dividers (e.g. #0f172a, #1e3a8a)
  secondaryColor?: string; // Hex color for subtitles, dates, meta (e.g. #475569)
  accentColor?: string; // Hex color for links, badges, highlights (e.g. #2563eb)
  fontScale?: "compact" | "normal" | "spacious" | number; // 9pt - 11pt
  fontSize?: number; // Exact pt size: 8.5 to 11.5
  lineHeight?: number; // 1.15 to 1.6
  sectionSpacing?: number; // 4px to 24px
  pageMargin?: number; // 8mm to 24mm
  dividerStyle?: "solid" | "dashed" | "dots" | "gradient" | "none";
}

export interface ResumeDocument {
  id?: string;
  title?: string;
  version?: "2.0" | string;
  meta?: {
    lastModified?: string;
    template?: TemplateType;
    font?: FontType;
    theme?: ThemeColor;
    themeConfig?: ThemeConfig;
  };
  personal: PersonalInfo;
  sections: DynamicSection[];
}

// Flat legacy structure compatibility
export interface SkillCategory {
  category: string;
  items: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
}

export interface ProjectItem {
  name: string;
  link?: { url: string; label: string };
  period?: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
}

export interface LegacyResumeData {
  personal: PersonalInfo;
  summary?: string;
  skills?: SkillCategory[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
  languages?: string;
}

export type ResumeData = ResumeDocument | LegacyResumeData;

export type TemplateType =
  | "modern-tech"
  | "classic-latex"
  | "two-column"
  | "compact-minimal";
export type ViewMode = "single" | "multi";
export type FontType = "modern-sans" | "geist" | "inter" | "editorial-serif";
export type ThemeColor =
  | "slate"
  | "navy"
  | "emerald"
  | "indigo"
  | "ruby"
  | "teal"
  | "amber"
  | "charcoal"
  | "custom";
export type PaperSize = "A4" | "Letter";
export type PageDensity = "compact" | "normal" | "spacious";
