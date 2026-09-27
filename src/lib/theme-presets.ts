import type { FontType, ThemeColor, ThemeConfig } from "@/types/resume";

export interface ThemePreset {
  id: ThemeColor;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  bgLight: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "slate",
    name: "Obsidian Slate",
    primary: "#0f172a",
    secondary: "#334155",
    accent: "#2563eb",
    border: "#0f172a",
    bgLight: "#f8fafc",
  },
  {
    id: "navy",
    name: "Royal Navy",
    primary: "#1e3a8a",
    secondary: "#1d4ed8",
    accent: "#2563eb",
    border: "#1e3a8a",
    bgLight: "#eff6ff",
  },
  {
    id: "emerald",
    name: "Emerald Forest",
    primary: "#065f46",
    secondary: "#047857",
    accent: "#059669",
    border: "#065f46",
    bgLight: "#ecfdf5",
  },
  {
    id: "indigo",
    name: "Electric Indigo",
    primary: "#3730a3",
    secondary: "#4338ca",
    accent: "#4f46e5",
    border: "#3730a3",
    bgLight: "#eef2ff",
  },
  {
    id: "ruby",
    name: "Ruby Crimson",
    primary: "#881337",
    secondary: "#be123c",
    accent: "#e11d48",
    border: "#881337",
    bgLight: "#fff1f2",
  },
  {
    id: "teal",
    name: "Cyber Teal",
    primary: "#115e59",
    secondary: "#0d9488",
    accent: "#0f766e",
    border: "#115e59",
    bgLight: "#f0fdfa",
  },
  {
    id: "amber",
    name: "Amber Bronze",
    primary: "#78350f",
    secondary: "#92400e",
    accent: "#d97706",
    border: "#78350f",
    bgLight: "#fffbeb",
  },
  {
    id: "charcoal",
    name: "Pure Charcoal",
    primary: "#18181b",
    secondary: "#27272a",
    accent: "#52525b",
    border: "#18181b",
    bgLight: "#fafafa",
  },
];

export interface FontPreset {
  id: FontType;
  name: string;
  category: "sans" | "serif" | "mono" | "hybrid";
  headingFont: string;
  bodyFont: string;
  description: string;
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "modern-sans",
    name: "Modern Sans",
    category: "sans",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    description: "Ultra-clean tech standard with high legibility",
  },
  {
    id: "geist",
    name: "Geist Clean",
    category: "sans",
    headingFont: "Geist Sans",
    bodyFont: "Geist Sans",
    description: "Modern minimalist engineered for tech & startups",
  },
  {
    id: "inter",
    name: "Inter Corporate",
    category: "sans",
    headingFont: "Inter",
    bodyFont: "Inter",
    description: "Executive and corporate ATS universal standard",
  },
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    category: "serif",
    headingFont: "Newsreader",
    bodyFont: "Georgia",
    description: "Academic, research, law, and publication style",
  },
];

/**
 * Computes custom CSS variables style object for dynamic ThemeConfig
 */
export function getThemeVariables(
  theme: ThemeColor,
  themeConfig?: ThemeConfig,
): React.CSSProperties {
  const preset = THEME_PRESETS.find((t) => t.id === theme) || THEME_PRESETS[0];

  const primary = themeConfig?.primaryColor || preset.primary;
  const secondary = themeConfig?.secondaryColor || preset.secondary;
  const accent = themeConfig?.accentColor || preset.accent;
  const border = themeConfig?.primaryColor || preset.border;

  return {
    ["--primary-accent" as any]: primary,
    ["--secondary-accent" as any]: secondary,
    ["--link-accent" as any]: accent,
    ["--border-accent" as any]: border,
    ...(themeConfig?.fontSize ? { fontSize: `${themeConfig.fontSize}pt` } : {}),
    ...(themeConfig?.lineHeight ? { lineHeight: themeConfig.lineHeight } : {}),
  };
}
