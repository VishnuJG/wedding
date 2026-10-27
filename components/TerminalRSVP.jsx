"use client";

import { useEffect, useState } from "react";

const SUCCESS_LINES = [
  { text: "// Collecting Guest Data... ", ok: true },
  { text: "// Verifying Status... ", ok: true },
  { text: "// Approved: Vishnu && Soumya Forever.", ok: false },
  { text: "// Exiting with status 0.", ok: false },
  { text: "// Thank you! Your RSVP is merged.", ok: false },
];

const DECLINE_LINES = [
  { text: "// Collecting Guest Data... ", ok: true },
  { text: "// Verifying Status... ", ok: true },
  { text: "// Response recorded. We'll miss you!", ok: false },
  { text: "// Exiting with status 0.", ok: false },
];

function renderLineContent(line) {
  if (line.ok) {
    return (
      <>
        <span className="text-stone-400">{line.text}</span>
        <span className="text-emerald-400">[OK]</span>
      </>
    );
  }
  return <span className="text-emerald-300">{line.text}</span>;
}

export default function TerminalRSVP({ attending, guestName }) {
  const lines = attending === "yes" ? SUCCESS_LINES : DECLINE_LINES;
  const [completedLines, setCompletedLines] = useState([]);
  const [activeLine, setActiveLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const finished = lineIndex >= lines.length;

  const fullText = (line) => (line.ok ? `${line.text}[OK]` : line.text);

  useEffect(() => {
    if (finished) return;

    const current = lines[lineIndex];
    const target = fullText(current);

    if (charIndex < target.length) {
      const timer = setTimeout(() => {
        setActiveLine(target.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 28);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCompletedLines((prev) => [...prev, lineIndex]);
      setActiveLine("");
      setCharIndex(0);
      setLineIndex((i) => i + 1);
    }, 320);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, charIndex, attending, finished]);

  const renderTypedLine = (line, typed) => {
    if (line.ok) {
      const marker = "[OK]";
      if (typed.endsWith(marker) || typed.includes(marker)) {
        const comment = typed.replace(marker, "");
        return (
          <>
            <span className="text-stone-400">{comment}</span>
            <span className="text-emerald-400">{marker}</span>
          </>
        );
      }
      return <span className="text-stone-400">{typed}</span>;
    }
    return <span className="text-emerald-300">{typed}</span>;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-700/80 bg-[#0d1117] shadow-2xl shadow-black/30">
      <div className="flex items-center gap-2 border-b border-stone-700/80 bg-[#161b22] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-stone-500">rsvp — bash</span>
      </div>

      <div
        className="min-h-[220px] p-4 font-mono text-sm leading-relaxed sm:p-5 sm:text-[15px]"
        aria-live="polite"
        aria-label="RSVP confirmation terminal output"
      >
        <p className="mb-3 text-violet-300">
          <span className="text-emerald-400">guest@wedding</span>
          <span className="text-stone-500">:</span>
          <span className="text-sky-400">~</span>
          <span className="text-stone-500">$ </span>
          <span className="text-stone-300">./submit-rsvp.sh --guest=&quot;{guestName}&quot;</span>
        </p>

        {completedLines.map((index) => (
          <p key={index} className="whitespace-pre-wrap">
            {renderLineContent(lines[index])}
          </p>
        ))}

        {lineIndex < lines.length && activeLine && (
          <p className="whitespace-pre-wrap">
            {renderTypedLine(lines[lineIndex], activeLine)}
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-emerald-400/80 align-middle" />
          </p>
        )}

        {finished && (
          <p className="mt-3 text-stone-500">
            <span className="text-emerald-400">guest@wedding</span>
            <span className="text-stone-600">:~$ </span>
            <span className="inline-block h-4 w-2 animate-pulse bg-stone-500/80 align-middle" />
          </p>
        )}
      </div>
    </div>
  );
}

export function TerminalRSVPFooter({ attending, guestName, onReset }) {
  return (
    <>
      <TerminalRSVP attending={attending} guestName={guestName} onReset={onReset} />
      {attending === "yes" && (
        <p className="mt-6 text-center text-sm leading-relaxed text-stone-600">
          We&apos;re delighted you&apos;ll be joining us,{" "}
          <span className="font-medium text-charcoal">{guestName.split(" ")[0]}</span>
          . See you at the deploy — er, wedding.
        </p>
      )}
      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full text-center font-mono text-xs text-stone-500 transition-colors hover:text-gold"
      >
        $ git checkout -b another-rsvp
      </button>
    </>
  );
}
