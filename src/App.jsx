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
const SITE_URL = "https://salontugba.vercel.app/";

function toAbsoluteUrl(value) {
  if (!value) {
    return "";
  }

  try {
    return new URL(value, SITE_URL).href;
  } catch {
    return SITE_URL;
  }
}

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
    const nextTitle = safeSiteContent?.seoTitle || "Salon Tugba";
    const nextDescription = safeSiteContent?.seoDescription || "";
    const nextImage = toAbsoluteUrl(safeSiteContent?.heroImage || "/hero.jpg");
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "BeautySalon",
      name: safeSiteContent?.salonName || safeSiteContent?.name || "Salon Tugba",
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
      content: safeSiteContent?.heroImageAlt || "Salon Tugba hero gorseli",
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
      content: safeSiteContent?.heroImageAlt || "Salon Tugba hero gorseli",
    });
    upsertCanonical(SITE_URL);
    upsertJsonLd("local-business", localBusinessSchema);
  }, [safeSiteContent]);

  if (loading || !minLoadingDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary px-6">
        <img
          src={loadingLogo}
          alt="Salon Tugba logosu"
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
