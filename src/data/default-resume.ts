import type { ResumeData } from "@/types/resume";

export const defaultResumeData: ResumeData = {
  personal: {
    name: "MD ROBIN MIA",
    title: "Full Stack Developer",
    location: "Dhaka, Bangladesh",
    phone: "+8801540374147",
    email: "robindev2007@gmail.com",
    linkedin: {
      url: "https://linkedin.com/in/robin2007",
      label: "linkedin.com/in/robin2007",
    },
    github: {
      url: "https://github.com/robindev2007",
      label: "github.com/robindev2007",
    },
  },
  summary:
    "Full Stack Developer with experience building and maintaining web applications from idea to production. I work mainly with React, Next.js, Node.js, NestJS, and PostgreSQL, and enjoy working across both frontend and backend. I've worked on 20+ projects, building APIs, dashboards, e-commerce platforms, real-time features, payment systems, and content management systems while solving day-to-day development and production issues.",
  skills: [
    {
      category: "Backend",
      items:
        "NestJS, Node.js, Express.js, Prisma, REST API, JWT, OAuth, WebSockets, Socket.io, Zod",
    },
    {
      category: "Frontend",
      items:
        "React.js, Next.js, TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand",
    },
    {
      category: "Database & ORMs",
      items: "PostgreSQL, MySQL, MongoDB, Redis, Prisma, SQL, Drizzle",
    },
    {
      category: "Services",
      items: "Stripe, Firebase, BullMQ, Socket.io, MinIO, Cloudinary",
    },
    {
      category: "DevOps & Tools",
      items: "Docker, Nginx, Git, GitHub, GitHub Actions, CI/CD, PM2, Linux",
    },
    {
      category: "Testing & Development",
      items: "Jest, ESLint, Prettier, Postman, Swagger/OpenAPI",
    },
  ],
  experience: [
    {
      role: "Full Stack Developer",
      company: "SM Technology",
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
  projects: [
    {
      name: "StringShare App - Guitar renting platform (Backend)",
      link: {
        url: "https://stringshare.app/",
        label: "stringshare.app",
      },
      period: "Nov 2025",
      highlights: [
        "Built the backend for a peer-to-peer rental marketplace supporting listings, rentals, bookings, and user management.",
        "Integrated Stripe for secure payments, refunds, and automated payment workflows.",
        "Developed real-time chat between renters and item owners.",
        "Implemented automated booking workflows for payment expiration, cancellations, and status updates.",
        "Optimized PostgreSQL database queries and Prisma schemas with indexing for fast search and listing retrieval.",
      ],
    },
    {
      name: "SwissEduTrack App (Backend + Dashboard)",
      link: {
        url: "https://apps.apple.com/us/app/swiss-edutrack/id6789431893",
        label: "App Store",
      },
      period: "Jan 2026",
      highlights: [
        "Designed multi-school, multi-tenant architecture with school-level data isolation.",
        "Implemented JWT, Google OAuth, Apple Sign-In, email OTP, password reset, and granular RBAC.",
        "Built BullMQ, Redis & FCM pipelines for background emails and push notifications.",
        "Integrated MinIO (S3), react-email, and QueueDash for file storage, emails, and job monitoring.",
        "Developed dynamic competency tracking analytics aligned with Lehrplan 21 curriculum standards.",
      ],
    },
    {
      name: "Geeroo - Same Day Urgent Courier Platform (Full Stack)",
      link: {
        url: "https://www.geeroo.co.uk/",
        label: "geeroo.co.uk",
      },
      period: "Feb 2026",
      highlights: [
        "Built a high-performance UK courier logistics web platform supporting same-day and scheduled deliveries.",
        "Implemented instant quote calculation, multi-category vehicle selection guides, and multi-drop delivery booking.",
        "Integrated WhatsApp and automated dispatch communication channels with server-side lead routing.",
        "Optimized frontend performance, SEO metadata, and Core Web Vitals using Next.js App Router and Tailwind CSS.",
      ],
    },
  ],
  education: [
    {
      institution: "Siraj Uddin Sarker Vidyaniketan & College",
      degree: "HSC | Science | GPA: 4.67/5.00",
      period: "2023 – 2024",
    },
  ],
  languages: "Bengali (Native), English (Professional Working Proficiency)",
};
