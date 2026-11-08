import React from "react";

export const BrandLogo: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xs shrink-0 p-1.5 text-white`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M12 2a9 9 0 0 1 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a9 9 0 0 1 9-9z" />
          <path d="M12 2v20" />
          <path d="M12 12h7" />
          <path d="M12 7h5" />
          <path d="M12 17h6" />
        </svg>
      </div>

      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-base font-bold tracking-tight text-neutral-900">
          Nutri<span className="text-emerald-600">Label</span>
        </span>
        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          EU·FDA
        </span>
      </div>
    </div>
  );
};
