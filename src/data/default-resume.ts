import type { ResumeData } from "@/types/resume";

export const defaultResumeData: ResumeData = {
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
  summary:
    "Full Stack Developer with experience building and maintaining web applications from idea to production. I work mainly with React, Next.js, Node.js, NestJS, and PostgreSQL, and enjoy working across both frontend and backend. I've worked on 20+ projects, building APIs, dashboards, e-commerce platforms, real-time features, payment systems, and content management systems while solving day-to-day development and production issues.",
  skills: [
    {
      category: "Backend",
      items: "NestJS, Node.js, Express.js, Prisma, REST API, JWT, OAuth, WebSockets, Socket.io, Zod",
    },
    {
      category: "Frontend",
      items: "React.js, Next.js, TypeScript, Tailwind CSS, Shadcn UI, React Query, Zustand",
    },
    {
      category: "Database & ORMs",
      items: "PostgreSQL, MongoDB, Redis, Prisma, SQL, Drizzle",
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
        url: "https://play.google.com/store/apps/details?id=com.sn.stringshare",
        label: "Play store",
      },
      period: "Nov 2025",
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
      name: "SwissEduTrack App (Backend + Dashboard)",
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
  education: [
    {
      institution: "Siraj Uddin Sarker Vidyaniketan & College",
      degree: "HSC | Science | GPA: 4.67/5.00",
      period: "2023 – 2024",
    },
  ],
  languages: "Bengali (Native), English (Professional Working Proficiency)",
};
