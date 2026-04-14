import { useEffect, useState } from "react";
import { siteContent } from "../data/siteContent";
import useReveal from "../hooks/useReveal";

const GRID_MEDIA_CLASS =
  "h-60 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-72";

const LIGHTBOX_MEDIA_CLASS =
  "max-h-[85vh] max-w-full mx-auto rounded-[28px] bg-black object-contain block";

export default function Instagram() {
  const revealRef = useReveal();
  const [selectedItem, setSelectedItem] = useState(null);
  const [mediaErrors, setMediaErrors] = useState({});
  const [videoReady, setVideoReady] = useState({});

  useEffect(() => {
    if (!selectedItem) return;

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
    setMediaErrors((c) => ({ ...c, [src]: true }));
  };

  const markVideoReady = (src) => {
    setVideoReady((c) => ({ ...c, [src]: true }));
  };

  return (
    <section
      id="instagram"
      ref={revealRef}
      className="reveal bg-primary py-16 text-white md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-heading md:text-4xl">Instagram</h2>
          <p className="mt-4 text-base text-white/70">
            Güncel çalışmalarımızı ve salon atmosferimizi yakından inceleyin.
          </p>

<a 
  href={siteContent.instagramUrl}
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block mt-6 px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition"
>
  Instagram’a Git
</a>
        </div>

        {/* ✅ mobile padding eklendi */}
        <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.galleryItems.map((item) => {
            const hasError = mediaErrors[item.src];
            const isReady = videoReady[item.src];

            return (
              <button
                key={item.src}
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden rounded-[28px] transform transition duration-300 hover:scale-[1.02]"
              >
                {/* IMAGE */}
                {item.type === "image" && !hasError && (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={GRID_MEDIA_CLASS}
                    loading="lazy"
                    onError={() => markError(item.src)}
                  />
                )}

                {/* VIDEO */}
                {item.type === "video" && !hasError && (
                  <>
                    {!isReady && (
                      <div className="absolute inset-0 bg-black/30 animate-pulse" />
                    )}

                    <video
                      src={item.src}
                      className={`${GRID_MEDIA_CLASS} transition-opacity duration-500 ${
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

                {/* ERROR */}
                {hasError && (
                  <div className="h-60 flex items-center justify-center bg-white/10 text-sm">
                    Medya yüklenemedi
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-3 top-3 z-10 bg-black/60 px-3 py-1 text-white"
            >
              ✕
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
                alt=""
                className={LIGHTBOX_MEDIA_CLASS}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}