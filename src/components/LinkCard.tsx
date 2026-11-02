"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { LinkItem } from "../types/mylink";
import { incrementLinkClick } from "../lib/storage";
import { Badge } from "./ui/badge";

interface LinkCardProps {
  link: LinkItem;
  onLinkClick?: (link: LinkItem) => void;
}

export function LinkCard({ link, onLinkClick }: LinkCardProps) {
  const handleClick = () => {
    incrementLinkClick(link.id);
    if (onLinkClick) {
      onLinkClick(link);
    }
  };

  const isExternal = link.url.startsWith("http://") || link.url.startsWith("https://");

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className="group block w-full rounded-2xl border border-[#E5E8EB] bg-white p-4 sm:p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-[#3182F6]/40 hover:shadow-xs active:scale-[0.98] cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-[#3182F6]/30"
    >
      <div className="flex items-center gap-3.5">
        {/* Leading Icon / Emoji Box */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-2xl transition-all duration-150 group-hover:bg-[#E8F3FF] group-hover:scale-105">
          <span>{link.icon || "🔗"}</span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[16px] font-semibold text-[#191F28] truncate transition-colors group-hover:text-[#3182F6]">
              {link.title}
            </h3>
            {link.badge && (
              <Badge variant="brand" className="text-[11px] px-2 py-0.5">
                {link.badge}
              </Badge>
            )}
          </div>
          {link.subtitle && (
            <p className="mt-0.5 text-[13px] text-[#6B7684] truncate leading-snug">
              {link.subtitle}
            </p>
          )}
        </div>

        {/* Trailing Icon (Chevron) */}
        <div className="shrink-0 text-[#B0B8C1] transition-all duration-150 group-hover:text-[#3182F6] group-hover:translate-x-0.5">
          <ChevronRight className="h-5 w-5 stroke-[2.2]" />
        </div>
      </div>
    </a>
  );
}
