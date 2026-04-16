import useReveal from "../hooks/useReveal";
import { buildWhatsAppUrl } from "../lib/siteContent";

export default function Services({ siteContent }) {
  const revealRef = useReveal();

  return (
    <section
      id="services"
      ref={revealRef}
      aria-labelledby="services-heading"
      className="reveal overflow-x-hidden bg-white py-16 text-black md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2
            id="services-heading"
            className="text-3xl font-heading leading-tight md:text-4xl"
          >
            Hizmetlerimiz
          </h2>
          <p className="mt-4 text-base leading-7 text-black/70">
            Güzelliğinize değer katacak, sonuç odaklı ve profesyonel dokunuşlar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 xl:grid-cols-3">
          {siteContent.services.map((service) => (
            <article
              key={service.title}
              className="group flex h-full flex-col rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_14px_34px_rgba(10,10,10,0.05)] transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(10,10,10,0.08)]"
            >
              <h3 className="mb-3 pt-1 font-heading text-[1.75rem] leading-tight text-black">
                {service.title}
              </h3>

              <p className="flex-1 text-base leading-7 text-black/70">
                {service.desc}
              </p>

              <a
                href={buildWhatsAppUrl(
                  siteContent.whatsappNumber,
                  `Merhaba, ${service.title} için randevu almak istiyorum.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${service.title} için WhatsApp'tan randevu alın`}
                className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#b89655] hover:shadow-md active:scale-95 sm:w-fit"
              >
                {siteContent.bookingButtonText}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
