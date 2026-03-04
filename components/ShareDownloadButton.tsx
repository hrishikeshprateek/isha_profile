"use client";

import DownloadQuote from "./DownloadQuote";

interface ShareDownloadButtonProps {
    quoteId: string;
    text: string;
    author: string;
    title?: string;
    hideWrapper?: boolean;
}

export default function ShareDownloadButton({ quoteId, text, author, title, hideWrapper = true }: ShareDownloadButtonProps) {
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
                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                return;
            }

            // Fallback: open the URL in a new tab
            window.open(url, "_blank");
        } catch (err) {
            console.error("Share failed", err);
        }
    }

    return (
        <DownloadQuote
            text={text}
            author={author}
            quoteId={quoteId}
            showShareButton={true}
            onShare={handleShare}
            hideWrapper={hideWrapper}
        />
    );
}

