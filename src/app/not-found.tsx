"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 text-center">
      <h1 className="text-4xl font-extrabold font-heading mb-2">404</h1>
      <p className="text-sm text-muted-foreground mb-4">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow-xs transition-colors">
        Back to Resume Studio
      </Link>
    </div>
  );
}
