import FadeIn from "./FadeIn";

export default function SectionHeading({ label, title, subtitle }) {
  return (
    <FadeIn className="mb-10 text-center md:mb-14">
      {label && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
          {label}
        </p>
      )}
      <h2 className="font-serif text-3xl text-charcoal sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    </FadeIn>
  );
}
