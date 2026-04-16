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
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.classList.toggle("menu-open", mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? "hidden" : previousOverflow;
    document.body.style.touchAction = mobileMenuOpen
      ? "none"
      : previousTouchAction;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={`fixed left-0 top-0 z-[70] w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_10px_32px_rgba(0,0,0,0.14)]"
          : "border-white/10 bg-white/40 backdrop-blur-md shadow-[0_6px_22px_rgba(0,0,0,0.08)]"
      }`}
    >
      {siteContent.announcementEnabled && siteContent.announcementText ? (
        <div className="border-b border-gold/20 bg-black px-4 py-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-gold sm:py-2 sm:text-xs">
          {siteContent.announcementText}
        </div>
      ) : null}

      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6 md:h-20">
        <a href="#top" aria-label="Ana sayfa" className="shrink-0">
          <img
            src={logoSource}
            alt="Salon Tuğba"
            className="h-11 object-contain sm:h-12 md:h-14"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-[0.08em] text-white/92 transition-all duration-200 hover:text-gold hover:opacity-100"
            >
              {link.label}
            </a>
          ))}

          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#d5b57a] hover:shadow-[0_12px_28px_rgba(200,169,106,0.28)] active:scale-95"
          >
            {siteContent.bookingButtonText}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className={`inline-flex min-h-[46px] items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold tracking-[0.12em] shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur transition-all duration-200 active:scale-95 md:hidden ${
            mobileMenuOpen
              ? "border-gold/35 bg-black/80 text-gold"
              : "border-white/15 bg-black/60 text-white"
          }`}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          <span className="flex h-4 w-4 flex-col justify-between">
            <span
              className={`block h-0.5 w-full rounded-full transition ${
                mobileMenuOpen
                  ? "translate-y-[7px] rotate-45 bg-gold"
                  : "bg-white"
              }`}
            />
            <span
              className={`block h-0.5 w-full rounded-full transition ${
                mobileMenuOpen ? "opacity-0" : "bg-white"
              }`}
            />
            <span
              className={`block h-0.5 w-full rounded-full transition ${
                mobileMenuOpen
                  ? "-translate-y-[7px] -rotate-45 bg-gold"
                  : "bg-white"
              }`}
            />
          </span>
          <span className="leading-none">{mobileMenuOpen ? "Kapat" : "Menü"}</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-[60] bg-black/88 backdrop-blur-xl md:hidden"
            onClick={closeMobileMenu}
          />

          <div
            id="mobile-menu"
            className="fixed inset-0 z-[80] overflow-y-auto px-4 pb-5 pt-6 md:hidden"
          >
            <div className="min-h-full rounded-[30px] border border-white/10 bg-[#080808]/98 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="mb-6 border-b border-white/8 pb-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
                  Hızlı Erişim
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/58">
                  Tek bir adım seçin ve devam edin.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex min-h-[58px] items-center rounded-2xl border border-white/8 bg-white/[0.04] px-4 text-left text-base font-medium tracking-[0.05em] text-white transition-all duration-200 hover:border-white/10 hover:bg-white/6 hover:text-gold"
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
                className="mt-7 inline-flex min-h-[54px] w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#d5b57a] hover:shadow-[0_12px_28px_rgba(200,169,106,0.28)] active:scale-95"
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
