import { useEffect, useState } from "react";
import useReveal from "../hooks/useReveal";

const GRID_MEDIA_CLASS =
  "h-full w-full object-cover transition duration-500 group-hover:scale-105";

const LIGHTBOX_MEDIA_CLASS =
  "mx-auto block max-h-[85vh] max-w-full rounded-[28px] bg-black object-contain";

export default function Instagram({ siteContent }) {
  const revealRef = useReveal();
  const [selectedItem, setSelectedItem] = useState(null);
  const [mediaErrors, setMediaErrors] = useState({});
  const [videoReady, setVideoReady] = useState({});

  useEffect(() => {
    if (!selectedItem) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const esc = (e) => {
      if (e.key === "Escape") setSelectedItem(null);
    };

    window.addEventListener("keydown", esc);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", esc);
    };
  }, [selectedItem]);

  const markError = (src) => {
    setMediaErrors((current) => ({ ...current, [src]: true }));
  };

  const markVideoReady = (src) => {
    setVideoReady((current) => ({ ...current, [src]: true }));
  };

  return (
    <section
      id="instagram"
      ref={revealRef}
      className="reveal bg-primary py-16 text-white md:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-heading md:text-4xl">
            {siteContent.instagramTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            {siteContent.instagramDescription}
          </p>

          <a
            href={siteContent.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/16 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white hover:text-black active:scale-95"
          >
            Instagram&apos;a Git
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {siteContent.galleryItems.map((item) => {
            const hasError = mediaErrors[item.src];
            const isReady = videoReady[item.src];

            return (
              <button
                key={item.src}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/8 bg-white/5 text-left shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_22px_44px_rgba(0,0,0,0.24)] focus:outline-none focus:ring-2 focus:ring-gold/70 focus:ring-offset-2 focus:ring-offset-primary active:scale-[0.99]"
              >
                {item.type === "image" && !hasError && (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={GRID_MEDIA_CLASS}
                    loading="lazy"
                    onError={() => markError(item.src)}
                  />
                )}

                {item.type === "video" && !hasError && (
                  <>
                    {!isReady && (
                      <div className="absolute inset-0 animate-pulse bg-black/30" />
                    )}

                    <video
                      src={item.src}
                      className={`${GRID_MEDIA_CLASS} ${
                        isReady ? "opacity-100" : "opacity-0"
                      }`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={() => markVideoReady(item.src)}
                      onError={() => markError(item.src)}
                    />
                  </>
                )}

                {hasError && (
                  <div className="flex h-full items-center justify-center bg-white/10 px-6 text-sm leading-6">
                    Medya yüklenemedi
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 p-4 sm:items-center"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-3 top-3 z-10 inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-white/12 bg-black/72 px-4 text-sm font-medium text-white shadow-lg backdrop-blur transition-all duration-200 hover:bg-black active:scale-95"
            >
              Kapat
            </button>

            {selectedItem.type === "video" ? (
              <video
                src={selectedItem.src}
                controls
                autoPlay
                className={LIGHTBOX_MEDIA_CLASS}
              />
            ) : (
              <img
                src={selectedItem.src}
                alt={selectedItem.alt || siteContent.instagramTitle}
                className={LIGHTBOX_MEDIA_CLASS}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
