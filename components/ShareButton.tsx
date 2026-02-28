"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";

interface Props {
  quoteId: string;
  title?: string;
  text?: string;
  className?: string;
}

export default function ShareButton({ quoteId, title, text, className }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "error" | "shared">("idle");

  async function handleShare() {
    try {
      const slug = title
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 80)
        : quoteId;

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/quotes/${quoteId}-${slug}`;

      if (navigator.share) {
        await navigator.share({
          title: title || "Quote",
          text: text ? text.slice(0, 140) : undefined,
          url,
        });
        setStatus("shared");
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
        setTimeout(() => setStatus("idle"), 2000);
        return;
      }

      // Fallback: open the URL in a new tab
      window.open(url, "_blank");
      setStatus("shared");
    } catch (err) {
      console.error("Share failed", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share quote"
      className={`p-1.5 rounded-full hover:!bg-[#FAF0E6]/10 transition-colors ${className || ""}`}
    >
      {status === "copied" ? (
        <span className="text-[9px] font-bold !text-[#F2A7A7]">Copied</span>
      ) : status === "shared" ? (
        <span className="text-[9px] font-bold !text-[#F2A7A7]">Shared</span>
      ) : (
        <Share2 size={16} className="!text-[#F2A7A7]" />
      )}
    </button>
  );
}

