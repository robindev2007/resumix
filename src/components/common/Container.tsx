import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "full";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = "default",
  ...props
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "sm" && "max-w-4xl",
        size === "default" && "max-w-7xl",
        size === "lg" && "max-w-[1400px]",
        size === "full" && "max-w-full",
        className,
      )}
      {...props}>
      {children}
    </div>
  );
};
