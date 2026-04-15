import useReveal from "../hooks/useReveal";

export default function TrustSection({ siteContent }) {
  const revealRef = useReveal();

  return (
    <section ref={revealRef} className="reveal bg-primary py-14 text-white md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-gold">
              Güven
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-tight md:text-4xl">
              {siteContent.trust.text}
            </h2>
          </div>

          <a
            href={siteContent.trust.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold md:mt-0 md:w-auto"
          >
            Yorumlara Git
          </a>
        </div>
      </div>
    </section>
  );
}
