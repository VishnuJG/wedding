"use client";

import { useEffect, useState } from "react";
import {
  CalendarPlus,
  Check,
  Copy,
  Heart,
  Share2,
} from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import { buildGoogleCalendarUrl } from "@/lib/utils";

export default function Footer() {
  const [copiedTag, setCopiedTag] = useState(null);
  const [shareUrl, setShareUrl] = useState(WEDDING.siteUrl);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareText = `You're invited to ${WEDDING.groom} & ${WEDDING.bride}'s wedding! ${WEDDING.dateDisplay} · ${WEDDING.location}\n${WEDDING.hashtags.join(" ")}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopiedTag("share");
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCopyHashtag = async (tag) => {
    await navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

  return (
    <footer className="border-t border-stone-700 bg-[#0d1117] px-5 py-12 text-ivory md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <Heart className="mx-auto h-6 w-6 text-gold" aria-hidden="true" />

        <p className="mt-4 font-serif text-2xl sm:text-3xl">
          {WEDDING.groom} <span className="text-lg text-gold">&</span> {WEDDING.bride}
        </p>
        <p className="mt-2 font-mono text-xs text-stone-500 sm:text-sm">
          {WEDDING.dateDisplay} · {WEDDING.location}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {WEDDING.hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleCopyHashtag(tag)}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-md border border-stone-700 bg-[#161b22] px-3 py-2 font-mono text-xs text-gold transition-colors hover:border-gold/40 hover:bg-[#1c2128] sm:text-sm"
            >
              {copiedTag === tag ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-stone-700 bg-[#161b22] px-6 py-2.5 font-mono text-sm transition-colors hover:border-gold/40 hover:bg-[#1c2128] sm:w-auto"
          >
            <CalendarPlus className="h-4 w-4 text-gold" aria-hidden="true" />
            cal.add(event)
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-[44px] w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-gold px-6 py-2.5 font-mono text-sm font-semibold text-[#0d1117] transition-colors hover:bg-gold-dark sm:w-auto"
          >
            {copiedTag === "share" ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Share2 className="h-4 w-4" aria-hidden="true" />
            )}
            share --invite
          </button>

          <a
            href={whatsappShare}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-2.5 font-mono text-sm text-[#25D366] transition-colors hover:bg-[#25D366]/20 sm:w-auto"
          >
            share -w whatsapp
          </a>
        </div>

        <p className="mt-10 font-mono text-xs text-stone-600">
          {"// made with love · exit 0 · "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
