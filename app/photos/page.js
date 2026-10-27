import Link from "next/link";
import PhotoDump from "@/components/PhotoDump";
import Footer from "@/components/Footer";
import { WEDDING } from "@/lib/wedding-data";

export const metadata = {
  title: `Photo dump | ${WEDDING.coupleDisplay}`,
  description: `Share engagement, reception, and wedding photos with ${WEDDING.coupleDisplay}.`,
};

export default function PhotosPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <header className="border-b border-stone-200/80 bg-ivory/95 px-5 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-lg text-charcoal transition-colors hover:text-gold sm:text-xl"
          >
            ← {WEDDING.coupleDisplay}
          </Link>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-stone-400 sm:inline">
            Photo dump
          </span>
        </div>
      </header>
      <PhotoDump />
      <Footer />
    </main>
  );
}
