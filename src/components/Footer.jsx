import { siteContent } from "../data/siteContent";

const quickLinks = [
  { label: "Hizmetler", href: "#services" },
  { label: "Instagram", href: "#instagram" },
  { label: "İletişim", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-primary py-10 text-white md:mt-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3 md:gap-10 md:px-0">
        <div>
          <h2 className="mb-3 font-heading text-2xl">{siteContent.name}</h2>
          <p className="max-w-sm text-white/70">{siteContent.tagline}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            İletişim
          </h3>
          <div className="flex flex-col gap-3">
  <a
    href={siteContent.phoneHref}
    className="group block transition hover:text-gold"
  >
    <span className="block">{siteContent.phoneDisplay}</span>
    <span className="text-xs text-white/60 group-hover:text-gold transition">
      Tuğba Gürsoy
    </span>
  </a>

  <a
    href={siteContent.phoneHref2}
    className="group block transition hover:text-gold"
  >
    <span className="block">{siteContent.phoneDisplay2}</span>
    <span className="text-xs text-white/60 group-hover:text-gold transition">
      Umut Gürsoy
    </span>
  </a>
</div>
          <p className="mt-2 max-w-xs text-white/70">{siteContent.address}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Hızlı Erişim
          </h3>
          <div className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-primary"
              >
                {link.label}
              </a>
            ))}
            <a
              href={siteContent.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-primary"
            >
              Instagram Profili
            </a>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Tüm hakları saklıdır.
      </p>
    </footer>
  );
}