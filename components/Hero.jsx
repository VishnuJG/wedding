"use client";

import { ChevronDown, MapPin } from "lucide-react";
import DrivePhoto from "@/components/DrivePhoto";
import { WEDDING } from "@/lib/wedding-data";
import { scrollToSection } from "@/lib/utils";

const HERO_DRIVE_ID = "1N2kpfKT9iFduudJFdcjVo_I8Qk5YUE5S";

const heroPhoto = {
  kind: "drive",
  id: HERO_DRIVE_ID,
  src: `https://lh3.googleusercontent.com/d/${HERO_DRIVE_ID}=w800-rw`,
  fullSrc: `https://drive.google.com/uc?export=view&id=${HERO_DRIVE_ID}`,
  srcFallbacks: [
    `https://lh3.googleusercontent.com/d/${HERO_DRIVE_ID}=w800-rw`,
    `https://drive.google.com/uc?export=view&id=${HERO_DRIVE_ID}`,
    `https://drive.google.com/thumbnail?id=${HERO_DRIVE_ID}&sz=w800`,
  ],
  alt: `${WEDDING.groom} & ${WEDDING.bride}`,
  name: "hero",
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-16 text-center sm:px-5 sm:pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(250,250,249,0.6) 0%, rgba(250,250,249,0.88) 55%, #FAFAF9 100%), url('https://images.unsplash.com/photo-1522673607860-1d4837531e1?w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(217,119,6,0.08),transparent_55%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-sage-700">
          We&apos;re getting married
        </p>

        <div className="relative mb-8">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white/90 shadow-xl ring-2 ring-gold/30 sm:h-40 sm:w-40">
            <DrivePhoto photo={heroPhoto} className="h-full w-full" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-1 text-xs font-medium text-gold shadow-sm backdrop-blur-sm">
            Save the Date
          </div>
        </div>

        <h1 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl md:text-6xl">
          {WEDDING.groom}
          <span className="mx-2 text-2xl text-gold sm:mx-3 sm:text-3xl">&</span>
          {WEDDING.bride}
        </h1>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {WEDDING.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 font-mono text-[10px] text-gold sm:text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 space-y-1 text-sm leading-relaxed text-stone-600 sm:text-base">
          <p>
            Son of {WEDDING.groomParents[0]} & {WEDDING.groomParents[1]}
          </p>
          <p className="text-gold">&</p>
          <p>
            Daughter of {WEDDING.brideParents[0]} & {WEDDING.brideParents[1]}
          </p>
        </div>

        <p className="mt-6 font-serif text-xl text-stone-700 sm:text-2xl">
          {WEDDING.dateDisplay}
        </p>
        <p className="mt-2 text-sm text-stone-500">{WEDDING.dateDetail}</p>

        <p className="mt-4 flex flex-col items-center justify-center gap-1 text-sm text-stone-600 sm:text-base">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-sage-600" aria-hidden="true" />
            {WEDDING.location}
          </span>
          <span className="text-stone-500">{WEDDING.locationDetail}</span>
        </p>

        <button
          type="button"
          onClick={() => scrollToSection("rsvp")}
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gold px-10 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-gold/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-xl active:scale-[0.98]"
        >
          RSVP Now
        </button>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("countdown")}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-stone-500 transition-colors hover:text-gold"
        aria-label="Scroll to countdown"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </section>
  );
}
