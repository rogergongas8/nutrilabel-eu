import React from "react";

export const BrandLogo: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Bespoke Stamp-Label & Botanical Leaf Emblem */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="56" height="56" rx="15" fill="#C84B31" />
        <path
          d="M15 19C15 15.6863 17.6863 13 21 13H43C46.3137 13 49 15.6863 49 19V47C49 49.2091 47.2091 51 45 51H19C16.7909 51 15 49.2091 15 47V19Z"
          fill="#FAF7F2"
        />
        <circle cx="32" cy="19.5" r="2.5" fill="#C84B31" />
        <line
          x1="21"
          y1="27.5"
          x2="43"
          y2="27.5"
          stroke="#231F1D"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <line
          x1="21"
          y1="34"
          x2="36"
          y2="34"
          stroke="#6E655F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="21"
          y1="39.5"
          x2="32"
          y2="39.5"
          stroke="#6E655F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="21"
          y1="45"
          x2="37"
          y2="45"
          stroke="#231F1D"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Botanical Olive Leaf */}
        <path
          d="M47 33C47 33 38.5 33.5 37 39.5C35.5 45.5 42.5 47.5 42.5 47.5C42.5 47.5 48.5 42.5 47 33Z"
          fill="#4A5D4E"
        />
        <path
          d="M38.5 45.5L44 37.5"
          stroke="#FAF7F2"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1 leading-none">
          <span className="text-xl font-bold tracking-tight text-[#231F1D]">
            Nutri
          </span>
          <span className="font-serif italic text-[22px] font-semibold text-[#C84B31]">
            Label
          </span>
          <span className="ml-1.5 text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-[#EBE4D8] text-[#5C534C]">
            EU
          </span>
        </div>
        {subtitle && (
          <span className="text-[11px] text-[#6E655F] font-medium mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
