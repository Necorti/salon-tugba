import useReveal from "../hooks/useReveal";

export default function Contact({ siteContent }) {
  const revealRef = useReveal();

  return (
    <section
      id="contact"
      ref={revealRef}
      aria-labelledby="contact-heading"
      className="reveal overflow-x-hidden bg-white py-16 text-black md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        <div className="flex flex-col rounded-[28px] bg-[#faf6ef] p-6 shadow-[0_20px_60px_rgba(10,10,10,0.06)] sm:p-7 md:p-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-gold">
            İletişim
          </p>

          <h2 id="contact-heading" className="text-3xl font-heading md:text-4xl">
            Randevu ve bilgi için bize ulaşın
          </h2>

          <p className="mt-5 text-base leading-relaxed text-black/72">
            {siteContent.address}
          </p>

          <p className="mt-4 text-sm leading-6 text-black/62">
            {siteContent.contactDescription}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={siteContent.phoneHref}
              className="inline-flex min-h-[52px] w-full items-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium transition-all duration-200 hover:border-gold hover:text-gold sm:w-fit sm:rounded-full"
            >
              {siteContent.phoneDisplay} - Tuğba Gürsoy
            </a>

            <a
              href={siteContent.phoneHref2}
              className="inline-flex min-h-[52px] w-full items-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium transition-all duration-200 hover:border-gold hover:text-gold sm:w-fit sm:rounded-full"
            >
              {siteContent.phoneDisplay2} - Umut Gürsoy
            </a>
          </div>

          <p className="mt-3 text-sm text-black/65">
            Çalışma Saatleri: {siteContent.workingHours}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto"
            >
              {siteContent.bookingButtonText}
            </a>

            <a
              href={siteContent.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-black hover:bg-black hover:text-white active:scale-95 sm:w-auto"
            >
              Instagram&apos;a Git
            </a>
          </div>
        </div>

        <div className="min-h-[320px] overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(10,10,10,0.08)]">
          <iframe
            src={siteContent.mapsEmbedUrl}
            title="Salon Tuğba konumu"
            loading="lazy"
            aria-label="Salon Tuğba konum haritası"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-[320px] h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
