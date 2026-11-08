import React from "react";

export const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#171717" />
        <rect x="8" y="8" width="16" height="3" rx="1" fill="#FFFFFF" />
        <rect x="8" y="14" width="11" height="2" rx="1" fill="#A3A3A3" />
        <rect x="8" y="18.5" width="9" height="2" rx="1" fill="#A3A3A3" />
        <rect x="8" y="23" width="16" height="2" rx="1" fill="#FFFFFF" />
        <circle cx="22" cy="16" r="2.5" fill="#10B981" />
      </svg>
      <span className="text-base font-semibold tracking-tight text-neutral-900">
        NutriLabel
      </span>
    </div>
  );
};
