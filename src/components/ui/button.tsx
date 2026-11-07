import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "primary" | "outline" | "ghost" | "editorial";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "accent", size = "md", ...props }, ref) => {
    const variants = {
      accent:
        "bg-accent text-white border-2 border-primary shadow-tactile hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0F291E] active:translate-y-0 active:shadow-tactile-sm",
      primary:
        "bg-primary text-[#F6F3EC] border-2 border-primary shadow-tactile-accent hover:bg-primary-light hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "bg-surface text-primary border-2 border-primary hover:bg-primary hover:text-[#F6F3EC] shadow-tactile-sm transition-colors",
      editorial:
        "bg-transparent text-primary border border-primary/30 hover:border-primary hover:bg-primary/5",
      ghost:
        "bg-transparent text-ink hover:bg-primary/5",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-xs font-semibold rounded-none tracking-wide uppercase",
      md: "px-5 py-2.5 text-sm font-semibold rounded-none",
      lg: "px-8 py-4 text-base font-bold rounded-none tracking-tight",
      xl: "px-10 py-5 text-lg font-bold rounded-none tracking-tight",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
