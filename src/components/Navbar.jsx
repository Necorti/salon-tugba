import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Hizmetler", href: "#services" },
  { label: "Instagram", href: "#instagram" },
  { label: "İletişim", href: "#contact" },
];

export default function Navbar({ siteContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoSource = siteContent.logoUrl || logo;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
          ? "border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_10px_32px_rgba(0,0,0,0.14)]"
          : "border-white/10 bg-white/40 backdrop-blur-md shadow-[0_6px_22px_rgba(0,0,0,0.08)]"
      }`}
    >
      {siteContent.announcementEnabled && siteContent.announcementText ? (
        <div className="border-b border-gold/20 bg-black px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-gold sm:text-xs">
          {siteContent.announcementText}
        </div>
      ) : null}

      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6 md:h-20">
        <a href="#top" aria-label="Ana sayfa">
          <img
            src={logoSource}
            alt="Salon Tuğba"
            className="h-12 object-contain sm:h-14 md:h-14"
          />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-[0.08em] text-white transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}

          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d5b57a] hover:shadow-[0_12px_28px_rgba(200,169,106,0.28)]"
          >
            {siteContent.bookingButtonText}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex min-h-[48px] items-center gap-3 rounded-full border border-white/15 bg-black/60 px-4 py-2.5 text-sm font-semibold tracking-[0.12em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="flex h-4 w-4 flex-col justify-between">
            <span
              className={`block h-0.5 w-full rounded-full bg-white transition ${
                mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full rounded-full bg-white transition ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full rounded-full bg-white transition ${
                mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
          Menü
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={closeMobileMenu}
          />

          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-50 px-4 pb-4 pt-3 md:hidden"
          >
            <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f]/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex min-h-[52px] items-center rounded-2xl border border-transparent px-4 text-left text-base font-medium tracking-[0.05em] text-white transition hover:border-white/10 hover:bg-white/5 hover:text-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <a
                href={siteContent.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#d5b57a] hover:shadow-[0_12px_28px_rgba(200,169,106,0.28)]"
              >
                {siteContent.bookingButtonText}
              </a>

              {siteContent.specialNotice ? (
                <p className="mt-4 rounded-3xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm leading-6 text-white/80">
                  {siteContent.specialNotice}
                </p>
              ) : null}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
