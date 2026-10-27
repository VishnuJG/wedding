"use client";

import { useEffect, useMemo, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";
import FadeIn from "./FadeIn";
import SectionHeading from "./SectionHeading";

function getTimeRemaining(targetDate) {
  const total = targetDate.getTime() - Date.now();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    finished: false,
  };
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex min-w-[72px] flex-col items-center rounded-2xl border border-stone-200/80 bg-white/70 px-3 py-4 shadow-sm backdrop-blur-sm sm:min-w-[88px] sm:px-5 sm:py-5">
      <span
        className="font-serif text-3xl tabular-nums text-charcoal sm:text-4xl md:text-5xl"
        suppressHydrationWarning
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const targetDate = useMemo(() => new Date(WEDDING.date), []);
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const update = () => setTimeLeft(getTimeRemaining(targetDate));
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="countdown" className="scroll-mt-4 px-5 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          label="Countdown"
          title="The Big Day Approaches"
          subtitle={
            timeLeft.finished
              ? "Today is the day! We can't wait to see you."
              : "Mark your calendars — our celebration is just around the corner."
          }
        />

        <FadeIn delay={150}>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <TimeBlock value={timeLeft.days} label="Days" />
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <TimeBlock value={timeLeft.minutes} label="Minutes" />
            <TimeBlock value={timeLeft.seconds} label="Seconds" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
