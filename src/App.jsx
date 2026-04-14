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
import { siteContent } from "./data/siteContent";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let minimumTimer;
    const img = new Image();
    const minimumLoadingTime = 1000;
    const startTime = window.performance.now();



    const finishLoading = () => {
      const elapsed = window.performance.now() - startTime;
      const remaining = Math.max(minimumLoadingTime - elapsed, 0);

      window.clearTimeout(minimumTimer);
      minimumTimer = window.setTimeout(() => {
        if (!cancelled) {
          setLoading(false);
        }
      }, remaining);
    };

    img.src = siteContent.heroImage;

    if (img.complete) {
      finishLoading();
      return () => {
        cancelled = true;
      };
    }

    img.onload = finishLoading;
    img.onerror = finishLoading;

    const fallbackTimer = window.setTimeout(() => {
  if (!cancelled) finishLoading();
}, 1000);

    return () => {
      cancelled = true;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(fallbackTimer);
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary px-6">
        <img
          src={loadingLogo}
          alt="Salon Tuğba logosu"
          className="w-32 animate-logo brightness-110 sm:w-40 md:w-52"
          width="208"
          height="208"
        />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Instagram />
        <Contact />
        <TrustSection />
      </main>
      <Footer />
      <ScrollToTopButton />
      <WhatsAppFloat />
    </div>
  );
}

export default App;
