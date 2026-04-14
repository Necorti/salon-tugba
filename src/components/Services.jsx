import useReveal from "../hooks/useReveal";
import { buildWhatsAppUrl, siteContent } from "../data/siteContent";

export default function Services() {
  const revealRef = useReveal();

  return (
    <section
      id="services"
      ref={revealRef}
      className="reveal overflow-x-hidden bg-white py-16 text-black md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="text-3xl font-heading md:text-4xl">Hizmetlerimiz</h2>
          <p className="mt-4 text-base leading-7 text-black/70">
            Güzelliğinize değer katacak, sonuç odaklı ve profesyonel dokunuşlar.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {siteContent.services.map((service) => (
            <article
              key={service.title}
              className="flex h-full flex-col rounded-3xl border border-black/8 bg-white p-6 shadow-[0_12px_30px_rgba(10,10,10,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(10,10,10,0.08)] md:p-8"
            >
              <h3 className="mb-3 pt-1 font-heading text-2xl text-black">
                {service.title}
              </h3>

              <p className="text-base leading-7 text-black/70">{service.desc}</p>

              <a
                href={buildWhatsAppUrl(
                  `Merhaba, ${service.title} için randevu almak istiyorum.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[48px] w-fit items-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#b89655] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2"
              >
                Randevu Al
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
