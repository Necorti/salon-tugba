import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { normalizeSiteContent } from "../lib/siteContent";

const loggedSiteContentWarnings = new Set();

function logSiteContent(level, message, details, warningKey = message) {
  const logger = console[level] ?? console.warn;
  const shouldSkipDuplicate =
    level === "warn" &&
    import.meta.env.PROD &&
    loggedSiteContentWarnings.has(warningKey);

  if (shouldSkipDuplicate) {
    return;
  }

  if (level === "warn") {
    loggedSiteContentWarnings.add(warningKey);
  }

  if (details) {
    logger(`[site-content] ${message}`, details);
    return;
  }

  logger(`[site-content] ${message}`);
}

function safeNormalizeSiteContent(rawContent, warningKey) {
  if (!rawContent || typeof rawContent !== "object" || Array.isArray(rawContent)) {
    logSiteContent(
      "warn",
      "Firestore site verisi gecersiz formatta geldi. Varsayilan icerik kullaniliyor.",
      {
        receivedType: Array.isArray(rawContent) ? "array" : typeof rawContent,
      },
      warningKey
    );
    return normalizeSiteContent();
  }

  try {
    return normalizeSiteContent(rawContent);
  } catch (error) {
    logSiteContent(
      "warn",
      "Firestore site verisi normalize edilemedi. Varsayilan icerik kullaniliyor.",
      error,
      warningKey
    );
    return normalizeSiteContent();
  }
}

export default function useSiteContent() {
  const [data, setData] = useState(() =>
    safeNormalizeSiteContent({}, "initial-normalize")
  );
  const [loading, setLoading] = useState(() => Boolean(db));

  useEffect(() => {
    if (!db) {
      logSiteContent(
        "warn",
        "Firestore baglantisi hazir degil. Varsayilan site icerigi kullaniliyor.",
        undefined,
        "missing-db"
      );
      return undefined;
    }

    const siteDocRef = doc(db, "site", "main");

    const unsubscribe = onSnapshot(
      siteDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(
            safeNormalizeSiteContent(snapshot.data(), "invalid-snapshot-data")
          );
        } else {
          setData(safeNormalizeSiteContent({}, "missing-site-document"));
        }

        setLoading(false);
      },
      (error) => {
        logSiteContent(
          "warn",
          "Firestore site verisi okunamadi. Varsayilan icerik ile devam ediliyor.",
          error,
          "snapshot-read-failed"
        );
        setData(safeNormalizeSiteContent({}, "snapshot-read-fallback"));
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { data, loading };
}
