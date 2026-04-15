function asTrimmedString(value, fallback = "") {
  const nextValue = String(value ?? "").trim();
  return nextValue || fallback;
}

function normalizeList(items, fallbackItem, mapper) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      ...fallbackItem,
      ...(item && typeof item === "object" ? item : {}),
    }))
    .map(mapper)
    .filter(Boolean);
}

export function sanitizeSiteContentPayload(formValues) {
  if (!formValues || typeof formValues !== "object" || Array.isArray(formValues)) {
    throw new Error("Invalid site content payload.");
  }

  const salonName = asTrimmedString(
    formValues.salonName ?? formValues.name ?? formValues.title
  );

  const payload = {
    title: salonName,
    salonName,
    tagline: asTrimmedString(formValues.tagline),
    phone: asTrimmedString(formValues.phone1 ?? formValues.phone),
    phone1: asTrimmedString(formValues.phone1 ?? formValues.phone),
    phone2: asTrimmedString(formValues.phone2),
    address: asTrimmedString(formValues.address),
    workingHours: asTrimmedString(formValues.workingHours),
    instagramUrl: asTrimmedString(formValues.instagramUrl),
    whatsappNumber: asTrimmedString(formValues.whatsappNumber),
    whatsappMessage: asTrimmedString(formValues.whatsappMessage),
    googleMapsEmbedUrl: asTrimmedString(formValues.googleMapsEmbedUrl),
    googleReviewsUrl: asTrimmedString(
      formValues.googleReviewsUrl ?? formValues.trust?.googleUrl
    ),
    heroEyebrow: asTrimmedString(formValues.heroEyebrow ?? formValues.hero?.eyebrow),
    heroHeadline: asTrimmedString(
      formValues.heroHeadline ?? formValues.hero?.headline
    ),
    heroSubheadline: asTrimmedString(
      formValues.heroSubheadline ?? formValues.hero?.subheadline
    ),
    heroImage: asTrimmedString(formValues.heroImage),
    heroImageAlt: asTrimmedString(formValues.heroImageAlt),
    trustText: asTrimmedString(formValues.trustText ?? formValues.trust?.text),
    footerText: asTrimmedString(formValues.footerText),
    ctaButtonText: asTrimmedString(formValues.ctaButtonText),
    bookingButtonText: asTrimmedString(formValues.bookingButtonText),
    instagramTitle: asTrimmedString(formValues.instagramTitle),
    instagramDescription: asTrimmedString(formValues.instagramDescription),
    announcementEnabled: Boolean(formValues.announcementEnabled),
    announcementText: asTrimmedString(formValues.announcementText),
    seoTitle: asTrimmedString(formValues.seoTitle),
    seoDescription: asTrimmedString(formValues.seoDescription),
    logoUrl: asTrimmedString(formValues.logoUrl),
    specialNotice: asTrimmedString(formValues.specialNotice),
    services: normalizeList(
      formValues.services,
      { title: "", desc: "" },
      (service) => {
        const normalizedService = {
          title: asTrimmedString(service.title),
          desc: asTrimmedString(service.desc),
        };

        return normalizedService.title || normalizedService.desc
          ? normalizedService
          : null;
      }
    ),
    galleryItems: normalizeList(
      formValues.galleryItems,
      { type: "image", src: "", alt: "" },
      (item) => {
        const normalizedItem = {
          type: item.type === "video" ? "video" : "image",
          src: asTrimmedString(item.src),
          alt: asTrimmedString(item.alt),
        };

        return normalizedItem.src || normalizedItem.alt ? normalizedItem : null;
      }
    ),
  };

  return {
    ...payload,
    hero: {
      eyebrow: payload.heroEyebrow,
      headline: payload.heroHeadline,
      subheadline: payload.heroSubheadline,
    },
    trust: {
      text: payload.trustText,
      googleUrl: payload.googleReviewsUrl,
    },
  };
}
