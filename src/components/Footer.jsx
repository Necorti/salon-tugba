const quickLinks = [
  { label: "Hizmetler", href: "#services" },
  { label: "Instagram", href: "#instagram" },
  { label: "İletişim", href: "#contact" },
];

export default function Footer({ siteContent }) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-primary py-12 text-white md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.15fr_1fr_0.9fr] md:gap-8">
        <div className="space-y-4">
          <h2 className="font-heading text-2xl md:text-3xl">{siteContent.name}</h2>
          <p className="max-w-md text-sm leading-7 text-white/72">
            {siteContent.footerText}
          </p>
          {siteContent.specialNotice ? (
            <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold">
              {siteContent.specialNotice}
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            İletişim
          </h3>

          <div className="space-y-3 text-sm text-white/78">
            <a
              href={siteContent.phoneHref}
              className="block min-h-[48px] rounded-2xl px-4 py-3 transition hover:bg-white/5 hover:text-gold"
            >
              {siteContent.phoneDisplay} - Tuğba Gürsoy
            </a>

            <a
              href={siteContent.phoneHref2}
              className="block min-h-[48px] rounded-2xl px-4 py-3 transition hover:bg-white/5 hover:text-gold"
            >
              {siteContent.phoneDisplay2} - Umut Gürsoy
            </a>

            <p className="rounded-2xl bg-white/[0.03] px-4 py-3 leading-7">
              {siteContent.address}
            </p>
            <p className="px-4 leading-7 text-white/58">{siteContent.workingHours}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Hızlı Erişim
          </h3>

          <div className="flex flex-col gap-3 text-sm text-white/78">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-[48px] items-center rounded-2xl px-4 transition hover:bg-white/5 hover:text-gold"
              >
                {link.label}
              </a>
            ))}

            <a
              href={siteContent.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center rounded-2xl px-4 transition hover:bg-white/5 hover:text-gold"
            >
              Instagram Sayfamız
            </a>

            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-gold hover:text-gold sm:w-fit"
            >
              {siteContent.bookingButtonText}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-white/10 px-5 pt-6 text-xs uppercase tracking-[0.18em] text-white/45 md:flex-row md:items-center md:justify-between">
        <span>{siteContent.name}</span>
        <span>{siteContent.tagline}</span>
      </div>
    </footer>
  );
}
