import type { DynamicSection, ResumeDocument } from "./types";

export const defaultResumeDoc: ResumeDocument = {
  version: "2.0",
  meta: {
    lastModified: new Date().toISOString(),
    template: "modern-tech",
    font: "modern-sans",
    theme: "slate",
  },
  personal: {
    name: "MD ROBIN MIA",
    title: "Full Stack Developer",
    location: "Dhaka, Bangladesh",
    phone: "+8801540374147",
    email: "robindev2007@gmail.com",
    linkedin: {
      url: "https://linkedin.com/in/robin-mia",
      label: "linkedin.com/in/robin-mia",
    },
    github: {
      url: "https://github.com/robinmia",
      label: "github.com/robinmia",
    },
  },
  sections: [
    {
      id: "skills-overview",
      title: "SKILLS",
      type: "text",
      enabled: true,
      content:
        "Full Stack Developer with experience building and maintaining web applications from idea to production. I work mainly with React, Next.js, Node.js, NestJS, and PostgreSQL, and enjoy working across both frontend and backend. I've worked on 20+ projects, building APIs, dashboards, e-commerce platforms, real-time features, payment systems, and content management systems while solving day-to-day development and production issues.",
    },
    {
      id: "technical-skills",
      title: "TECHNICAL SKILLS",
      type: "key_value",
      enabled: true,
      items: [
        {
          key: "Backend",
          value:
            "NestJS, Node.js, Express.js, Prisma, REST API, JWT, OAuth, WebSockets, Socket.io, Zod",
        },
        {
          key: "Frontend",
          value:
            "React.js, Next.js, TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand",
        },
        {
          key: "Database & ORMs",
          value: "PostgreSQL, MongoDB, Redis, Prisma, SQL, Drizzle",
        },
        {
          key: "Services",
          value: "Stripe, Firebase, BullMQ, Socket.io, MinIO, Cloudinary",
        },
        {
          key: "DevOps & Tools",
          value:
            "Docker, Nginx, Git, GitHub, GitHub Actions, CI/CD, PM2, Linux",
        },
        {
          key: "Testing & Development",
          value: "Jest, ESLint, Prettier, Postman, Swagger/OpenAPI",
        },
      ],
    },
    {
      id: "experiences",
      title: "EXPERIENCES",
      type: "items",
      enabled: true,
      entries: [
        {
          id: "exp-1",
          title: "Full Stack Developer | SM Technology",
          period: "Oct 2025 – Present",
          highlights: [
            "Developed apps with React, Next.js, Node.js, Express.js, NestJS.",
            "Built REST APIs, dashboards, admin panels, e-commerce, authentication & RBAC.",
            "Integrated Stripe, PayPal, Socket.io, Redis, BullMQ.",
            "Worked with Prisma, MongoDB, PostgreSQL.",
            "Optimized performance, caching, payments & production issues.",
            "Handled high traffic app backend that has 100k users.",
          ],
        },
      ],
    },
    {
      id: "projects",
      title: "PROJECTS",
      type: "items",
      enabled: true,
      entries: [
        {
          id: "proj-1",
          title: "StringShare App - Guitar renting platform (Backend)",
          period: "Nov 2025",
          link: {
            url: "https://play.google.com/store/apps/details?id=com.sn.stringshare",
            label: "Play store",
          },
          highlights: [
            "Built the backend for a peer-to-peer rental marketplace supporting listings, rentals, bookings, and user management.",
            "Integrated Stripe for secure payments, refunds, and automated payment workflows.",
            "Developed real-time chat between renters and item owners.",
            "Implemented automated booking workflows for payment expiration, cancellations, and status updates.",
            "Built notification and email systems for important booking and account events.",
            "Designed a secure, modular, and scalable backend architecture for reliable platform growth.",
          ],
        },
        {
          id: "proj-2",
          title: "SwissEduTrack App (Backend + Dashboard)",
          period: "Jan 2026",
          highlights: [
            "Designed multi-school, multi-tenant architecture with school-level data isolation.",
            "Implemented JWT, Google OAuth, Apple Sign-In, email OTP, password reset.",
            "Built RBAC with granular permissions and role/school-based access control.",
            "Built BullMQ, Redis & FCM pipelines for background emails and push notifications.",
            "Integrated MinIO (S3), react-email, and QueueDash for file storage, emails, and job monitoring.",
          ],
        },
      ],
    },
    {
      id: "education",
      title: "EDUCATION",
      type: "items",
      enabled: true,
      entries: [
        {
          id: "edu-1",
          title: "Siraj Uddin Sarker Vidyaniketan & College",
          subtitle: "HSC | Science | GPA: 4.67/5.00",
          period: "2023 – 2024",
          highlights: [],
        },
      ],
    },
    {
      id: "languages",
      title: "LANGUAGES",
      type: "text",
      enabled: true,
      content: "Bengali (Native), English (Professional Working Proficiency)",
    },
  ],
};

// Backward-compatibility normalization helper
export function normalizeToDocument(data: any): ResumeDocument {
  if (data && data.version === "2.0" && Array.isArray(data.sections)) {
    return data as ResumeDocument;
  }

  // Convert old flat format to dynamic sections
  const sections: DynamicSection[] = [];

  if (data?.summary) {
    sections.push({
      id: "skills-overview",
      title: "SKILLS",
      type: "text",
      enabled: true,
      content: data.summary,
    });
  }

  if (Array.isArray(data?.skills) && data.skills.length > 0) {
    sections.push({
      id: "technical-skills",
      title: "TECHNICAL SKILLS",
      type: "key_value",
      enabled: true,
      items: data.skills.map((s: any) => ({
        key: s.category || "",
        value: s.items || "",
      })),
    });
  }

  if (Array.isArray(data?.experience) && data.experience.length > 0) {
    sections.push({
      id: "experiences",
      title: "EXPERIENCES",
      type: "items",
      enabled: true,
      entries: data.experience.map((e: any, i: number) => ({
        id: `exp-${i + 1}`,
        title: `${e.role || ""}${e.role && e.company ? " | " : ""}${e.company || ""}`,
        period: e.period || "",
        location: e.location,
        highlights: e.highlights || [],
      })),
    });
  }

  if (Array.isArray(data?.projects) && data.projects.length > 0) {
    sections.push({
      id: "projects",
      title: "PROJECTS",
      type: "items",
      enabled: true,
      entries: data.projects.map((pr: any, i: number) => ({
        id: `proj-${i + 1}`,
        title: pr.name || "",
        period: pr.period || "",
        link: pr.link,
        highlights: pr.highlights || [],
      })),
    });
  }

  if (Array.isArray(data?.education) && data.education.length > 0) {
    sections.push({
      id: "education",
      title: "EDUCATION",
      type: "items",
      enabled: true,
      entries: data.education.map((ed: any, i: number) => ({
        id: `edu-${i + 1}`,
        title: ed.institution || "",
        subtitle: ed.degree || "",
        period: ed.period || "",
        highlights: [],
      })),
    });
  }

  if (data?.languages) {
    sections.push({
      id: "languages",
      title: "LANGUAGES",
      type: "text",
      enabled: true,
      content: data.languages,
    });
  }

  return {
    version: "2.0",
    personal: data?.personal || defaultResumeDoc.personal,
    sections: sections.length > 0 ? sections : defaultResumeDoc.sections,
  };
}
