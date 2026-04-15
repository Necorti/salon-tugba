import { useEffect, useState } from "react";

export default function Hero({ siteContent }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center text-white">
      <div className="absolute inset-0">
        <img
          src={siteContent.heroImage}
          alt={siteContent.heroImageAlt}
          className="h-full w-full animate-[slowZoom_20s_linear_infinite] object-cover scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.24)_0%,rgba(10,10,10,0.52)_34%,rgba(10,10,10,0.84)_100%)]" />

      <div
        className={`relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 pb-14 pt-28 transition-all duration-1000 sm:px-6 sm:pb-16 sm:pt-32 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <p className="mb-5 rounded-full border border-white/12 bg-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm sm:text-xs">
          {siteContent.hero.eyebrow}
        </p>

        <h1 className="max-w-[12ch] text-4xl font-heading leading-[1.05] sm:max-w-[13ch] sm:text-5xl md:max-w-none md:text-6xl">
          {siteContent.hero.headline}
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
          {siteContent.hero.subheadline}
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-gold px-8 py-4 text-sm font-semibold text-black shadow-[0_18px_34px_rgba(200,169,106,0.26)] transition hover:bg-[#d5b57a]"
          >
            {siteContent.bookingButtonText}
          </a>

          <a
            href="#services"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/18 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
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
