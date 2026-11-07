import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "mono" | "alert";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-primary text-[#F6F3EC] border border-primary",
    accent: "bg-accent/10 text-accent border border-accent/30",
    outline: "bg-transparent text-primary border border-primary/30",
    mono: "bg-[#EAE5D9] text-primary border border-primary/20 font-mono",
    alert: "bg-[#D94E28] text-white border border-primary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
