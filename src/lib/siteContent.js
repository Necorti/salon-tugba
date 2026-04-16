const base = import.meta.env.BASE_URL;

const DEFAULT_WHATSAPP_MESSAGE =
  "Merhaba, hizmetleriniz hakkında bilgi almak ve bana uygun bir randevu oluşturmak istiyorum.";
const DEFAULT_WHATSAPP_NUMBER = "905558739174";
const DEFAULT_ADDRESS = "Sırakapılar, Mimar Sinan Cd. No:22";
const DEFAULT_WORKING_HOURS =
  "Salı günü kapalıdır. Diğer günler 09:00 - 20:00";
const DEFAULT_GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Salon+Tu%C4%9Fba/@37.7755948,29.0835913,17z/data=!4m18!1m9!3m8!1s0x14c73faf26e65acf:0x992b77c0e62a5be4!2sSalon+Tu%C4%9Fba!8m2!3d37.7755948!4d29.0835913!9m1!1b1!16s%2Fg%2F11c1tfjgfq!3m7!1s0x14c73faf26e65acf:0x992b77c0e62a5be4!8m2!3d37.7755948!4d29.0835913!9m1!1b1!16s%2Fg%2F11c1tfjgfq";

export const DEFAULT_SITE_CONTENT_DOC = {
  salonName: "Salon Tuğba",
  tagline: "Denizli'de özenli, modern ve güven veren salon deneyimi",
  phone1: "0555 873 91 74",
  phone2: "0507 935 71 54",
  address: DEFAULT_ADDRESS,
  workingHours: DEFAULT_WORKING_HOURS,
  instagramUrl: "https://instagram.com/salonntugba",
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  whatsappMessage: DEFAULT_WHATSAPP_MESSAGE,
  googleMapsEmbedUrl: "",
  googleReviewsUrl: DEFAULT_GOOGLE_REVIEWS_URL,
  heroEyebrow: "Denizli'de özenli bakım deneyimi",
  heroHeadline:
    "Size yakışan görünüm için profesyonel saç ve bakım uygulamaları",
  heroSubheadline:
    "Kesimden renklendirmeye, gelin hazırlığından bakım uygulamalarına kadar her adımı; sizi dinleyen, ihtiyacınızı anlayan ve içinize sinen bir sonuç hedefiyle planlıyoruz.",
  heroImage: `${base}hero.jpg`,
  heroImageAlt: "Salon Tuğba'da profesyonel saç uygulaması",
  trustText:
    "Salon Tuğba'da sizi aceleye gelmeyen bir ilgiyle karşılıyoruz. Hijyenik uygulama, dengeli sonuç ve yüzünüze gerçekten yakışan seçimler bizim için önemli. Buradan yalnızca bakımlı değil, içiniz rahat şekilde ayrılmanızı istiyoruz.",
  contactDescription:
    "Size en uygun işlemi ve randevu zamanını birlikte planlıyoruz.",
  footerText:
    "Denizli'de saç, renklendirme ve bakım uygulamalarında özenli, modern ve güven veren bir salon deneyimi için sizi bekliyoruz.",
  footerSupportText:
    "Size en uygun işlemi birlikte planlayalım.\nRandevu öncesinde bizimle iletişime geçebilirsiniz.\nKısaca beklentinizi iletmeniz yeterli.",
  ctaButtonText: "Hizmetleri İncele",
  bookingButtonText: "WhatsApp'tan Randevu Al",
  instagramTitle: "Instagram'da Çalışmalarımız",
  instagramDescription:
    "Uygulamalarımızı, renk geçişlerini ve salon atmosferimizi yakından inceleyin. Tarzınıza yakın bir görünüm gördüğünüzde bize kolayca ulaşabilirsiniz.",
  announcementEnabled: false,
  announcementText: "",
  seoTitle: "Salon Tuğba | Denizli Kuaför, Saç ve Bakım Hizmetleri",
  seoDescription:
    "Denizli kuaför arayışınız için Salon Tuğba'da saç kesimi, renklendirme, gelin saçı, manikür ve profesyonel bakım hizmetlerini güvenle keşfedin.",
  logoUrl: "",
  specialNotice: "",
  services: [
    {
      title: "Saç Kesimi",
      desc: "Yüz hatlarınıza, stilinize ve günlük kullanımınıza uygun; kolay şekil alan dengeli kesimler.",
    },
    {
      title: "Boya",
      desc: "Saç yapınıza uygun ton seçimiyle parlak, dengeli ve bakımlı görünen profesyonel renklendirme.",
    },
    {
      title: "Ombre & Sombre",
      desc: "Sert geçişler olmadan, daha yumuşak ve doğal bir aydınlık sağlayan modern renk uygulamaları.",
    },
    {
      title: "Gelin Saçı & Makyajı",
      desc: "Özel gününüz boyunca konforlu hissettiren, fotoğraflarda güçlü duran ve size özel planlanan hazırlık süreci.",
    },
    {
      title: "Manikür & Pedikür",
      desc: "Ellerinizin ve ayaklarınızın temiz, bakımlı ve özenli görünmesini sağlayan konforlu bakım uygulamaları.",
    },
    {
      title: "Kalıcı Oje",
      desc: "Uzun süre düzgün görünümünü koruyan, parlaklığını kaybetmeden günlük tempoya uyum sağlayan uygulama.",
    },
    {
      title: "Kaş & Bıyık",
      desc: "Yüz ifadenizi sertleştirmeden toparlayan, daha temiz ve dengeli bir görünüm sağlayan özenli bakım.",
    },
    {
      title: "Ağda",
      desc: "Hijyenik, dikkatli ve konfor odaklı uygulamayla cildinizde daha temiz ve pürüzsüz bir his bırakan bakım.",
    },
  ],
  galleryItems: [
    {
      type: "video",
      src: `${base}instagram/1.mp4`,
      alt: "Saç dönüşüm videosu",
    },
    {
      type: "image",
      src: `${base}instagram/2.jpg`,
      alt: "Salon Tuğba saç tasarımı örneği",
    },
    {
      type: "video",
      src: `${base}instagram/3.mp4`,
      alt: "Saç bakım uygulaması videosu",
    },
    {
      type: "image",
      src: `${base}instagram/4.jpg`,
      alt: "Profesyonel saç renklendirme sonucu",
    },
    {
      type: "image",
      src: `${base}instagram/5.jpg`,
      alt: "Salon Tuğba gelin saçı örneği",
    },
    {
      type: "video",
      src: `${base}instagram/6.mp4`,
      alt: "Salon çalışmasından kısa video",
    },
  ],
};

function asTrimmedString(value, fallback = "") {
  const nextValue = String(value ?? "").trim();
  return nextValue || fallback;
}

function preferDefaultText(value, defaultValue) {
  const normalizedValue = asTrimmedString(value);

  if (!normalizedValue) {
    return defaultValue;
  }

  return normalizedValue;
}

function mergeWithDefaultCollection(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  return items
    .map((item, index) => ({
      ...fallback[index % fallback.length],
      ...item,
    }))
    .filter((item) => asTrimmedString(item.title || item.src || item.alt));
}

export function sanitizePhone(phone) {
  return String(phone ?? "").replace(/\D/g, "");
}

function normalizePhoneForTel(phone) {
  const digits = sanitizePhone(phone);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("90")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+90${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+90${digits}`;
  }

  return `+${digits}`;
}

function normalizePhoneForWhatsapp(phone) {
  const normalized = normalizePhoneForTel(phone);
  return normalized.replace(/\D/g, "");
}

export function buildPhoneHref(phone) {
  const normalizedPhone = normalizePhoneForTel(phone);
  return normalizedPhone ? `tel:${normalizedPhone}` : "tel:";
}

export function buildWhatsAppUrl(phone, message = DEFAULT_WHATSAPP_MESSAGE) {
  const whatsappNumber = normalizePhoneForWhatsapp(
    phone || DEFAULT_WHATSAPP_NUMBER
  );

  if (!whatsappNumber) {
    return "#";
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildMapsEmbedUrl(address, embedUrl) {
  const normalizedEmbedUrl = asTrimmedString(embedUrl);

  if (normalizedEmbedUrl) {
    return normalizedEmbedUrl;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;
}

export function createAdminFormValues(firestoreData = {}) {
  const defaults = DEFAULT_SITE_CONTENT_DOC;
  const normalizedServices = mergeWithDefaultCollection(
    firestoreData.services,
    defaults.services
  );
  const normalizedGalleryItems = mergeWithDefaultCollection(
    firestoreData.galleryItems,
    defaults.galleryItems
  );

  return {
    salonName: preferDefaultText(
      firestoreData.salonName ?? firestoreData.name ?? firestoreData.title,
      defaults.salonName,
      ["Salon Tugba"]
    ),
    tagline: preferDefaultText(
      firestoreData.tagline,
      defaults.tagline,
      [
        "Guzelliginize deger katan profesyonel salon deneyimi",
        "Denizli'de ozenli, modern ve guven veren salon deneyimi",
      ]
    ),
    phone1: preferDefaultText(
      firestoreData.phone1 ?? firestoreData.phone,
      defaults.phone1
    ),
    phone2: preferDefaultText(firestoreData.phone2, defaults.phone2),
    address: preferDefaultText(
      firestoreData.address,
      defaults.address,
      ["Sirakapilar, Mimar Sinan Cd. No:22"]
    ),
    workingHours: preferDefaultText(
      firestoreData.workingHours,
      defaults.workingHours,
      ["Sali gunu kapalidir. Diger gunler 09:00 - 20:00"]
    ),
    instagramUrl: preferDefaultText(
      firestoreData.instagramUrl,
      defaults.instagramUrl
    ),
    whatsappNumber: preferDefaultText(
      firestoreData.whatsappNumber,
      defaults.whatsappNumber
    ),
    whatsappMessage: preferDefaultText(
      firestoreData.whatsappMessage,
      defaults.whatsappMessage,
      ["Merhaba, randevu almak istiyorum"]
    ),
    googleMapsEmbedUrl: asTrimmedString(firestoreData.googleMapsEmbedUrl),
    googleReviewsUrl: preferDefaultText(
      firestoreData.googleReviewsUrl ?? firestoreData.trust?.googleUrl,
      defaults.googleReviewsUrl,
      ["https://www.google.com/maps/place/Salon+Tu%C4%9Fba/"]
    ),
    heroEyebrow: preferDefaultText(
      firestoreData.heroEyebrow ?? firestoreData.hero?.eyebrow,
      defaults.heroEyebrow,
      ["Denizli'de premium bakim"]
    ),
    heroHeadline: preferDefaultText(
      firestoreData.heroHeadline ?? firestoreData.hero?.headline,
      defaults.heroHeadline,
      ["Kendinizi iyi hissettiren sac ve bakim uygulamalari"]
    ),
    heroSubheadline: preferDefaultText(
      firestoreData.heroSubheadline ?? firestoreData.hero?.subheadline,
      defaults.heroSubheadline,
      [
        "Uzman ekibimizle kesimden renklendirmeye kadar size ozel, guven veren ve randevuya donusen profesyonel salon deneyimi.",
      ]
    ),
    heroImage: asTrimmedString(firestoreData.heroImage, defaults.heroImage),
    heroImageAlt: preferDefaultText(
      firestoreData.heroImageAlt,
      defaults.heroImageAlt,
      ["Salon Tugba'da profesyonel sac uygulamasi"]
    ),
    trustText: asTrimmedString(
      firestoreData.trustText ?? firestoreData.trust?.text,
      defaults.trustText
    ),
    contactDescription: asTrimmedString(
      firestoreData.contactDescription,
      defaults.contactDescription
    ),
    footerText: asTrimmedString(firestoreData.footerText, defaults.footerText),
    footerSupportText: asTrimmedString(
      firestoreData.footerSupportText,
      defaults.footerSupportText
    ),
    ctaButtonText: asTrimmedString(
      firestoreData.ctaButtonText,
      defaults.ctaButtonText
    ),
    bookingButtonText: asTrimmedString(
      firestoreData.bookingButtonText,
      defaults.bookingButtonText
    ),
    instagramTitle: asTrimmedString(
      firestoreData.instagramTitle,
      defaults.instagramTitle
    ),
    instagramDescription: asTrimmedString(
      firestoreData.instagramDescription,
      defaults.instagramDescription
    ),
    announcementEnabled: Boolean(firestoreData.announcementEnabled),
    announcementText: asTrimmedString(firestoreData.announcementText),
    seoTitle: asTrimmedString(firestoreData.seoTitle, defaults.seoTitle),
    seoDescription: asTrimmedString(
      firestoreData.seoDescription,
      defaults.seoDescription
    ),
    logoUrl: asTrimmedString(firestoreData.logoUrl),
    specialNotice: asTrimmedString(firestoreData.specialNotice),
    services: normalizedServices.map((service, index) => ({
      title: preferDefaultText(
        service.title,
        defaults.services[index]?.title ?? service.title
      ),
      desc: preferDefaultText(
        service.desc,
        defaults.services[index]?.desc ?? service.desc
      ),
    })),
    galleryItems: normalizedGalleryItems.map((item, index) => ({
      type: item.type === "video" ? "video" : "image",
      src: asTrimmedString(item.src),
      alt: preferDefaultText(
        item.alt,
        defaults.galleryItems[index]?.alt ?? item.alt
      ),
    })),
  };
}

export function sanitizeSiteContentPayload(formValues = {}) {
  const values = createAdminFormValues(formValues);

  return {
    title: values.salonName,
    salonName: values.salonName,
    tagline: values.tagline,
    phone: values.phone1,
    phone1: values.phone1,
    phone2: values.phone2,
    address: values.address,
    workingHours: values.workingHours,
    instagramUrl: values.instagramUrl,
    whatsappNumber: values.whatsappNumber,
    whatsappMessage: values.whatsappMessage,
    googleMapsEmbedUrl: values.googleMapsEmbedUrl,
    googleReviewsUrl: values.googleReviewsUrl,
    heroEyebrow: values.heroEyebrow,
    heroHeadline: values.heroHeadline,
    heroSubheadline: values.heroSubheadline,
    heroImage: values.heroImage,
    heroImageAlt: values.heroImageAlt,
    trustText: values.trustText,
    contactDescription: values.contactDescription,
    footerText: values.footerText,
    footerSupportText: values.footerSupportText,
    ctaButtonText: values.ctaButtonText,
    bookingButtonText: values.bookingButtonText,
    instagramTitle: values.instagramTitle,
    instagramDescription: values.instagramDescription,
    announcementEnabled: values.announcementEnabled,
    announcementText: values.announcementText,
    seoTitle: values.seoTitle,
    seoDescription: values.seoDescription,
    logoUrl: values.logoUrl,
    specialNotice: values.specialNotice,
    services: values.services,
    galleryItems: values.galleryItems,
    hero: {
      eyebrow: values.heroEyebrow,
      headline: values.heroHeadline,
      subheadline: values.heroSubheadline,
    },
    trust: {
      text: values.trustText,
      googleUrl: values.googleReviewsUrl,
    },
  };
}

export function normalizeSiteContent(firestoreData = {}) {
  const values = createAdminFormValues(firestoreData);

  return {
    ...values,
    name: values.salonName,
    phoneDisplay: values.phone1 || "-",
    phoneHref: buildPhoneHref(values.phone1),
    phoneDisplay2: values.phone2 || "-",
    phoneHref2: buildPhoneHref(values.phone2),
    whatsappUrl: buildWhatsAppUrl(values.whatsappNumber, values.whatsappMessage),
    mapsEmbedUrl: buildMapsEmbedUrl(values.address, values.googleMapsEmbedUrl),
    hero: {
      eyebrow: values.heroEyebrow,
      headline: values.heroHeadline,
      subheadline: values.heroSubheadline,
    },
    trust: {
      text: values.trustText,
      googleUrl: values.googleReviewsUrl,
    },
  };
}
