import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Instagram from "./components/Instagram";
import Contact from "./components/Contact";
import TrustSection from "./components/TrustSection";
import WhatsAppFloat from "./components/WhatsAppFloat";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Footer from "./components/Footer";
import loadingLogo from "./assets/loading.png";
import useSiteContent from "./hooks/useSiteContent";
import { normalizeSiteContent } from "./lib/siteContent";

const MIN_LOADING_DURATION = 800;
const SITE_URL = "https://www.salontugba.com/";
const OG_IMAGE_URL = "https://www.salontugba.com/og-image.jpg";

function upsertMeta(selector, attributes) {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let tag = document.head.querySelector(`script[data-schema-id="${id}"]`);

  if (!tag) {
    tag = document.createElement("script");
    tag.setAttribute("type", "application/ld+json");
    tag.setAttribute("data-schema-id", id);
    document.head.appendChild(tag);
  }

  tag.textContent = JSON.stringify(data);
}

function App() {
  const { data: siteContent, loading } = useSiteContent();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  const safeSiteContent =
    siteContent && typeof siteContent === "object" && !Array.isArray(siteContent)
      ? normalizeSiteContent(siteContent)
      : normalizeSiteContent();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinLoadingDone(true);
    }, MIN_LOADING_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const nextTitle =
      safeSiteContent?.seoTitle ||
      "Salon Tuğba | Denizli Kuaför, Saç ve Bakım Salonu";

    const nextDescription =
      safeSiteContent?.seoDescription ||
      "Salon Tuğba, Denizli'de saç kesimi, renklendirme, bakım ve gelin saçı uygulamalarında özenli, güven veren ve modern bir salon deneyimi sunar.";

    const nextImage = OG_IMAGE_URL;

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "BeautySalon",
      name: safeSiteContent?.salonName || safeSiteContent?.name || "Salon Tuğba",
      image: nextImage,
      url: SITE_URL,
      telephone: safeSiteContent?.phone1 || undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: safeSiteContent?.address || undefined,
        addressLocality: "Denizli",
        addressCountry: "TR",
      },
      openingHours: safeSiteContent?.workingHours || undefined,
      sameAs: [safeSiteContent?.instagramUrl].filter(Boolean),
    };

    document.title = nextTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: nextDescription,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: "index, follow",
    });

    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: nextTitle,
    });

    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: nextDescription,
    });

    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: SITE_URL,
    });

    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });

    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: nextImage,
    });

    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: "Salon Tuğba tanıtım görseli",
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: nextTitle,
    });

    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: nextDescription,
    });

    upsertMeta('meta[name="twitter:url"]', {
      name: "twitter:url",
      content: SITE_URL,
    });

    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: nextImage,
    });

    upsertMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: "Salon Tuğba tanıtım görseli",
    });

    upsertCanonical(SITE_URL);
    upsertJsonLd("local-business", localBusinessSchema);
  }, [safeSiteContent]);

  if (loading || !minLoadingDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary px-6">
        <img
          src={loadingLogo}
          alt="Salon Tuğba logosu"
          className="w-32 animate-logo brightness-110 sm:w-40 md:w-52"
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <Navbar siteContent={safeSiteContent} />

      <main id="main-content">
        <Hero siteContent={safeSiteContent} />

        <section
          className="bg-black px-6 py-12 text-white"
          aria-label="Denizli kuaför hizmetleri açıklaması"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Denizli Kuaför Hizmetleri
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
              Salon Tuğba, Denizli’de profesyonel saç kesimi,
              renklendirme ve bakım hizmetleri sunan modern bir kuaför
              salonudur. Uzman ekibimiz ile kişiye özel saç tasarımları
              yaparak en iyi sonucu elde etmenizi sağlıyoruz.
            </p>
          </div>
        </section>

        <Services siteContent={safeSiteContent} />
        <Instagram siteContent={safeSiteContent} />
        <Contact siteContent={safeSiteContent} />
        <TrustSection siteContent={safeSiteContent} />
      </main>

      <Footer siteContent={safeSiteContent} />
      <ScrollToTopButton />
      <WhatsAppFloat siteContent={safeSiteContent} />
    </div>
  );
}

export default App;
