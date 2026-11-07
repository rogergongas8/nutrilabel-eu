import * as React from "react";
import { cn } from "@/lib/utils";

export const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-[#E8E2D5]",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

export const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center font-display text-sm font-bold text-primary",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
