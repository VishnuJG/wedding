import { STORY } from "@/lib/wedding-data";
import FadeIn from "./FadeIn";
import SectionHeading from "./SectionHeading";

export default function OurStory() {
  return (
    <section className="bg-sand px-5 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          label="Our Story"
          title="How We Fell in Love"
          subtitle="Every great love story has a beginning — here's ours."
        />

        <div className="relative">
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-gold/40 via-sage-400/40 to-transparent md:left-1/2 md:block md:-translate-x-px"
            aria-hidden="true"
          />

          <div className="space-y-8 md:space-y-12">
            {STORY.map((chapter, index) => (
              <FadeIn key={chapter.year} delay={index * 100}>
                <article
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />

                  <div
                    className="absolute left-4 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-gold shadow md:left-1/2 md:block"
                    aria-hidden="true"
                  />

                  <div className="md:w-1/2">
                    <div className="rounded-2xl border border-stone-200/60 bg-ivory p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
                      <span className="inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sage-800">
                        {chapter.year}
                      </span>
                      <h3 className="mt-3 font-serif text-xl text-charcoal sm:text-2xl">
                        {chapter.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
