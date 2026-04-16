import { useEffect, useState } from "react";

export default function Hero({ siteContent }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center text-white"
    >
      <div className="absolute inset-0">
        <img
          src={siteContent.heroImage}
          alt={siteContent.heroImageAlt}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full animate-[slowZoom_20s_linear_infinite] object-cover scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.24)_0%,rgba(10,10,10,0.52)_34%,rgba(10,10,10,0.84)_100%)]" />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-28 transition-all duration-1000 sm:px-6 sm:py-20 md:py-24 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <p className="mb-5 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm sm:text-xs">
          {siteContent.hero.eyebrow}
        </p>

        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className="text-4xl font-heading leading-[1.05] sm:text-5xl md:text-6xl"
          >
            {siteContent.hero.headline}
          </h1>
        </div>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/82 sm:text-lg">
          {siteContent.hero.subheadline}
        </p>

        <div className="mt-9 flex w-full max-w-xl flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-gold px-8 py-4 text-sm font-semibold text-black shadow-[0_18px_34px_rgba(200,169,106,0.26)] transition-all duration-200 hover:bg-[#d5b57a] active:scale-95 sm:w-auto"
          >
            {siteContent.bookingButtonText}
          </a>

          <a
            href="#services"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/18 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-95 sm:w-auto"
          >
            {siteContent.ctaButtonText}
          </a>
        </div>

        {siteContent.specialNotice ? (
          <p className="mt-6 max-w-lg rounded-[24px] border border-white/15 bg-black/28 px-5 py-3 text-sm leading-6 text-white/80 backdrop-blur">
            {siteContent.specialNotice}
          </p>
        ) : null}
      </div>
    </section>
  );
}
