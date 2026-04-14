import { useEffect, useState } from "react";
import { siteContent } from "../data/siteContent";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center text-white">
      <div className="absolute inset-0">
        <img
          src={siteContent.heroImage}
          alt={siteContent.heroImageAlt}
          className="h-full w-full object-cover scale-105 animate-[slowZoom_20s_linear_infinite]"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.42),rgba(10,10,10,0.76))]" />

      <div
        className={`relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 transition-all duration-1000 sm:px-6 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <p className="mb-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
          {siteContent.hero.eyebrow}
        </p>

        <h1 className="max-w-3xl text-4xl font-heading leading-tight sm:text-5xl md:text-6xl">
          {siteContent.hero.headline}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg md:text-xl">
          {siteContent.hero.subheadline}
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b89655] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-primary sm:w-auto"
          >
            Randevu Al
            <span aria-hidden="true">→</span>
          </a>

          <a
            href="#services"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white transition hover:bg-white/16 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-primary sm:w-auto"
          >
            Hizmetleri İncele
          </a>
        </div>
      </div>

      <a
        href="#services"
        className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-primary"
      >
        Aşağı Kaydır
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
