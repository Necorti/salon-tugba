import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { siteContent } from "../data/siteContent";

const navLinks = [
  { label: "Hizmetler", href: "#services" },
  { label: "Instagram", href: "#instagram" },
  { label: "İletişim", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileMenuOpen);

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
  ? "border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
  : "border-white/10 bg-white/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-20">
        <a
          href="#top"
          className="inline-flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2"
          aria-label="Salon Tuğba ana sayfa"
        >
          <img
            src={logo}
            alt="Salon Tuğba"
            className="h-12 md:h-14 object-contain transition duration-300 hover:scale-[1.02] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
            width="168"
            height="48"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-md font-medium text-black/100 transition hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b89655] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2"
          >
            Randevu Al
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/60 text-black shadow-[0_10px_22px_rgba(10,10,10,0.10)] backdrop-blur-xl transition hover:border-gold/40 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/60 md:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 stroke-current"
            fill="none"
            strokeWidth="1.8"
          >
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-white/15 bg-primary/88 text-white backdrop-blur-2xl transition-all duration-300 supports-[backdrop-filter]:bg-primary/72 md:hidden ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-white/85 transition hover:bg-white/8 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/60"
            >
              {link.label}
            </a>
          ))}

          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-gold px-4 py-3 text-center font-semibold text-black transition hover:bg-[#b89655] focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-primary"
          >
            WhatsApp'tan Randevu Al
          </a>
        </div>
      </div>
    </nav>
  );
}
