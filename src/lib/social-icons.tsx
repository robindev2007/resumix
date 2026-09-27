import {
  BookOpen,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Smartphone,
} from "lucide-react";
import React from "react";

export interface SocialIconInfo {
  type: string;
  name: string;
  renderIcon: (props: { className?: string }) => React.ReactElement;
  colorClass: string;
}

// Crisp Vector SVGs for Popular Developer & Professional Platforms
const GithubSvg = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinSvg = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterSvg = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LeetCodeSvg = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.864 5.918 5.918 0 0 0 1.25.042c1.066-.062 2.1-.479 2.915-1.209l3.854-4.125a1.374 1.374 0 1 0-1.923-1.961l-3.854 4.126a3.17 3.17 0 0 1-1.562.646 3.197 3.197 0 0 1-2.583-2.084 3.036 3.036 0 0 1-.042-1.27c.063-.438.25-.854.542-1.188L9.04 8.146l5.406-5.788A1.374 1.374 0 0 0 13.483 0z" />
    <path d="M9.833 15.375a1.375 1.375 0 1 0 0 2.75h10.334a1.375 1.375 0 1 0 0-2.75H9.833z" />
  </svg>
);

const YoutubeSvg = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

export function detectSocialPlatform(
  url: string,
  label: string = "",
): SocialIconInfo {
  const combined = `${url} ${label}`.toLowerCase();

  if (combined.includes("linkedin.com") || combined.includes("linkedin")) {
    return {
      type: "linkedin",
      name: "LinkedIn",
      renderIcon: (props) => <LinkedinSvg {...props} />,
      colorClass: "text-[#0077B5]",
    };
  }
  if (combined.includes("github.com") || combined.includes("github")) {
    return {
      type: "github",
      name: "GitHub",
      renderIcon: (props) => <GithubSvg {...props} />,
      colorClass: "text-slate-900",
    };
  }
  if (
    combined.includes("twitter.com") ||
    combined.includes("x.com") ||
    combined.includes("twitter")
  ) {
    return {
      type: "twitter",
      name: "Twitter / X",
      renderIcon: (props) => <TwitterSvg {...props} />,
      colorClass: "text-sky-500",
    };
  }
  if (combined.includes("leetcode.com") || combined.includes("leetcode")) {
    return {
      type: "leetcode",
      name: "LeetCode",
      renderIcon: (props) => <LeetCodeSvg {...props} />,
      colorClass: "text-amber-500",
    };
  }
  if (
    combined.includes("play.google.com") ||
    combined.includes("playstore") ||
    combined.includes("play store") ||
    combined.includes("android")
  ) {
    return {
      type: "playstore",
      name: "Play Store",
      renderIcon: (props) => <Smartphone {...props} />,
      colorClass: "text-emerald-600",
    };
  }
  if (
    combined.includes("apps.apple.com") ||
    combined.includes("appstore") ||
    combined.includes("app store") ||
    combined.includes("ios")
  ) {
    return {
      type: "appstore",
      name: "App Store",
      renderIcon: (props) => <Smartphone {...props} />,
      colorClass: "text-slate-800",
    };
  }
  if (
    combined.includes("medium.com") ||
    combined.includes("substack.com") ||
    combined.includes("dev.to") ||
    combined.includes("blog")
  ) {
    return {
      type: "blog",
      name: "Blog",
      renderIcon: (props) => <BookOpen {...props} />,
      colorClass: "text-orange-600",
    };
  }
  if (combined.includes("youtube.com") || combined.includes("youtube")) {
    return {
      type: "youtube",
      name: "YouTube",
      renderIcon: (props) => <YoutubeSvg {...props} />,
      colorClass: "text-red-600",
    };
  }
  if (combined.includes("discord.com") || combined.includes("discord")) {
    return {
      type: "discord",
      name: "Discord",
      renderIcon: (props) => <MessageSquare {...props} />,
      colorClass: "text-indigo-600",
    };
  }
  if (
    combined.includes("mailto:") ||
    combined.includes("@") ||
    combined.includes("email")
  ) {
    return {
      type: "email",
      name: "Email",
      renderIcon: (props) => <Mail {...props} />,
      colorClass: "text-slate-700",
    };
  }
  if (
    combined.includes("tel:") ||
    combined.includes("phone") ||
    /^\+?[\d\s-]{7,}$/.test(url.trim())
  ) {
    return {
      type: "phone",
      name: "Phone",
      renderIcon: (props) => <Phone {...props} />,
      colorClass: "text-slate-700",
    };
  }
  if (combined.includes("location") || combined.includes("address")) {
    return {
      type: "location",
      name: "Location",
      renderIcon: (props) => <MapPin {...props} />,
      colorClass: "text-slate-700",
    };
  }
  if (
    combined.includes("portfolio") ||
    combined.includes("website") ||
    url.startsWith("http")
  ) {
    return {
      type: "portfolio",
      name: "Portfolio / Website",
      renderIcon: (props) => <Globe {...props} />,
      colorClass: "text-blue-600",
    };
  }

  return {
    type: "custom",
    name: "Link",
    renderIcon: (props) => <ExternalLink {...props} />,
    colorClass: "text-slate-600",
  };
}

export function SocialIcon({
  url,
  label = "",
  className = "w-3.5 h-3.5 inline-block shrink-0",
  showColor = false,
}: {
  url: string;
  label?: string;
  className?: string;
  showColor?: boolean;
}) {
  const info = detectSocialPlatform(url, label);
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${showColor ? info.colorClass : ""}`}>
      {info.renderIcon({ className })}
    </span>
  );
}
