import useReveal from "../hooks/useReveal";
import { siteContent } from "../data/siteContent";

export default function Contact() {
  const revealRef = useReveal();

  return (
    <section
      id="contact"
      ref={revealRef}
      className="reveal overflow-x-hidden bg-white py-16 text-black md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        <div className="flex flex-col rounded-[28px] bg-[#faf6ef] p-6 shadow-[0_20px_60px_rgba(10,10,10,0.06)] md:p-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-gold">
            İletişim
          </p>
          <h2 className="text-3xl font-heading md:text-4xl">
            Randevu ve bilgi için bize ulaşın
          </h2>

          <p className="mt-5 text-base leading-7 text-black/72">
            {siteContent.address}
          </p>

          <div className="mt-5 flex flex-col gap-3">
  <a
    href={siteContent.phoneHref}
    className="group flex items-center justify-between rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-base font-medium transition hover:border-gold/40 hover:bg-white/60"
  >
    <div className="flex flex-col">
      <span>{siteContent.phoneDisplay}</span>
      <span className="text-xs text-black/60">Tuğba Gürsoy</span>
    </div>

    <span className="text-xs text-black/40 group-hover:text-gold transition">
      Ara →
    </span>
  </a>

  <a
    href={siteContent.phoneHref2}
    className="group flex items-center justify-between rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-base font-medium transition hover:border-gold/40 hover:bg-white/60"
  >
    <div className="flex flex-col">
      <span>{siteContent.phoneDisplay2}</span>
      <span className="text-xs text-black/60">Umut Gürsoy</span>
    </div>

    <span className="text-xs text-black/40 group-hover:text-gold transition">
      Ara →
    </span>
  </a>
</div>

          <p className="mt-3 text-sm text-black/65">
            Çalışma Saatleri: {siteContent.workingHours}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-full"
            >
              WhatsApp'tan Randevu Al
            </a>

            <a
              href={siteContent.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black transition hover:border-gold/40 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2"
            >
              Instagram'a Git
            </a>
          </div>
        </div>

        <div className="min-h-[320px] overflow-hidden rounded-[28px] border border-black/8 shadow-[0_20px_60px_rgba(10,10,10,0.08)] sm:min-h-[380px] lg:min-h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.616273869793!2d29.0835913!3d37.7755948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c73faf26e65acf%3A0x992b77c0e62a5be4!2sSalon%20Tu%C4%9Fba!5e0!3m2!1str!2str!4v1775901434101!5m2!1str!2str"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            title="Salon Tuğba konumu"
          />
        </div>
      </div>
    </section>
  );
}
