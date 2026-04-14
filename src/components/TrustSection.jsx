import useReveal from "../hooks/useReveal";
import { siteContent } from "../data/siteContent";

export default function TrustSection() {
  const revealRef = useReveal();
  const { trust } = siteContent;

  return (
    <section
      ref={revealRef}
      className="reveal overflow-x-hidden bg-primary py-14 text-white md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:grid-cols-2 md:items-center md:gap-8 md:p-8">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gold">
              Güven Veren Sonuçlar
            </p>

            <h2 className="font-heading text-3xl leading-tight md:text-4xl">
              Misafirlerimizin memnuniyeti bizim için en güçlü referans.
            </h2>
          </div>

          <a
            href={trust.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-black/30 p-6 transition-all duration-300 hover:scale-[1.01] hover:border-gold/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-primary"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <p className="mb-3 text-xs tracking-[0.3em] text-gold">
                GOOGLE YORUMLARI
              </p>

              <h3 className="mb-3 text-lg font-medium leading-snug">
                Gerçek müşteri yorumlarını inceleyin
              </h3>

              <p className="mb-6 text-sm leading-6 text-white/65">
                Misafirlerimizin deneyimlerini doğrudan Google üzerinden görüntüleyin.
              </p>

              <span className="inline-flex items-center gap-2 font-medium text-gold transition group-hover:gap-3">
                Yorumlara Git
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
