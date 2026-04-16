import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  DEFAULT_SITE_CONTENT_DOC,
  createAdminFormValues,
} from "./lib/siteContent";

const initialCredentials = {
  username: "",
  password: "",
};

const emptyGalleryItem = {
  type: "image",
  src: "",
  alt: "",
};

const emptyServiceItem = {
  title: "",
  desc: "",
};

const REQUIRED_FIELDS = {
  salonName: "Salon adı",
  tagline: "Tagline / kısa açıklama",
  phone1: "Telefon 1",
  address: "Adres",
  workingHours: "Çalışma saatleri",
  whatsappNumber: "WhatsApp numarası",
  heroHeadline: "Hero ana başlık",
  heroSubheadline: "Hero alt açıklama",
  ctaButtonText: "CTA buton metni",
  bookingButtonText: "Rezervasyon buton metni",
  seoTitle: "SEO title",
  seoDescription: "SEO description",
};

const URL_FIELDS = {
  instagramUrl: "Instagram linki",
  logoUrl: "Logo URL",
  googleMapsEmbedUrl: "Google Maps embed linki",
  googleReviewsUrl: "Google yorum linki",
  heroImage: "Hero görseli",
};

function serializeFormSnapshot(value) {
  return JSON.stringify(value);
}

function hasText(value) {
  return String(value ?? "").trim().length > 0;
}

function isValidUrl(value) {
  if (!hasText(value)) {
    return true;
  }

  const normalizedValue = String(value).trim();

  if (normalizedValue.startsWith("/")) {
    return true;
  }

  try {
    new URL(normalizedValue);
    return true;
  } catch {
    return false;
  }
}

function validateAdminForm(form) {
  const errors = {};
  const warnings = {};

  Object.entries(REQUIRED_FIELDS).forEach(([fieldName, label]) => {
    if (!hasText(form?.[fieldName])) {
      errors[fieldName] = `${label} boş bırakılamaz.`;
    }
  });

  Object.entries(URL_FIELDS).forEach(([fieldName, label]) => {
    if (!isValidUrl(form?.[fieldName])) {
      errors[fieldName] = `${label} alanına geçerli bir URL girin.`;
    }
  });

  form?.services?.forEach((service, index) => {
    if (!hasText(service?.title)) {
      errors[`services.${index}.title`] = `Hizmet ${index + 1} başlığı boş bırakılamaz.`;
    }

    if (!hasText(service?.desc)) {
      errors[`services.${index}.desc`] = `Hizmet ${index + 1} açıklaması boş bırakılamaz.`;
    }
  });

  form?.galleryItems?.forEach((item, index) => {
    if (!hasText(item?.src)) {
      errors[`galleryItems.${index}.src`] = `Galeri ${index + 1} için kaynak URL zorunludur.`;
    } else if (!isValidUrl(item?.src)) {
      errors[`galleryItems.${index}.src`] = `Galeri ${index + 1} kaynak URL alanına geçerli bir bağlantı girin.`;
    }

    if (!hasText(item?.alt)) {
      warnings[`galleryItems.${index}.alt`] = `Galeri ${index + 1} alt metni boş. Erişilebilirlik için açıklama ekleyin.`;
    }
  });

  return {
    errors,
    warnings,
    errorMessages: Object.values(errors),
    warningMessages: Object.values(warnings),
  };
}

function Field({ label, htmlFor, children, hint, description, error, warning }) {
  return (
    <div className="grid gap-2.5">
      <div className="grid gap-1">
        <label htmlFor={htmlFor} className="text-sm font-medium text-white/88">
          {label}
        </label>
        {description ? (
          <p className="text-xs leading-5 text-white/48">{description}</p>
        ) : null}
      </div>
      {children}
      {hint ? <span className="text-xs leading-5 text-white/45">{hint}</span> : null}
      {error ? (
        <span className="text-xs leading-5 text-red-200">{error}</span>
      ) : null}
      {!error && warning ? (
        <span className="text-xs leading-5 text-amber-200">{warning}</span>
      ) : null}
    </div>
  );
}

function inputClassName({ invalid = false, warning = false } = {}) {
  const stateClass = invalid
    ? "border-red-400/60 bg-red-400/5 focus:border-red-300"
    : warning
      ? "border-amber-400/40 bg-amber-400/[0.03] focus:border-amber-300"
      : "border-white/10 bg-white/5 focus:border-gold focus:bg-white/[0.07]";

  return `min-h-[48px] rounded-2xl ${stateClass} px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 disabled:cursor-not-allowed disabled:opacity-60`;
}

function cardClassName() {
  return "rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.16)] md:p-6";
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5 grid gap-2 border-b border-white/8 pb-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
        {eyebrow}
      </p>
      <h2 className="font-heading text-2xl text-white">{title}</h2>
      <p className="max-w-3xl text-sm leading-7 text-white/55">{description}</p>
    </div>
  );
}

function statusBannerTone(message) {
  if (!message) {
    return null;
  }

  const normalizedMessage = message.toLocaleLowerCase("tr-TR");

  if (
    normalizedMessage.includes("başarı") ||
    normalizedMessage.includes("kaydedildi")
  ) {
    return "success";
  }

  if (
    normalizedMessage.includes("yüklenemedi") ||
    normalizedMessage.includes("kaydedilemedi") ||
    normalizedMessage.includes("hata") ||
    normalizedMessage.includes("bulunamadı")
  ) {
    return "error";
  }

  return "info";
}

function bannerClassName(tone) {
  if (tone === "success") {
    return "mb-6 rounded-[24px] border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-50";
  }

  if (tone === "error") {
    return "mb-6 rounded-[24px] border border-red-400/25 bg-red-400/10 px-5 py-4 text-sm text-red-100";
  }

  return "mb-6 rounded-[24px] border border-gold/20 bg-gold/10 px-5 py-4 text-sm text-white/85";
}

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) {
    return response.json().catch(() => null);
  }

  const text = await response.text().catch(() => "");
  return {
    message: text ? "Beklenmeyen sunucu yanıtı alındı." : undefined,
    rawText: text,
  };
}

function buildApiErrorMessage(fallbackMessage, response, payload) {
  if (payload?.message) {
    return payload.message;
  }

  if (response.status === 404) {
    return "Admin API endpoint'i bulunamadı. Local geliştirme için Vite admin API middleware'inin çalıştığını doğrulayın.";
  }

  return fallbackMessage;
}

async function requestAdmin(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
  });
  const payload = await parseApiResponse(response);

  return { response, payload };
}

async function requestSession() {
  try {
    const { response, payload } = await requestAdmin("/api/admin/session");

    if (response.status === 401) {
      return {
        session: null,
        shouldLogError: false,
        message: payload?.message || "",
      };
    }

    if (!response.ok) {
      return { session: null, shouldLogError: true };
    }

    return { session: payload, shouldLogError: false };
  } catch (error) {
    return { session: null, shouldLogError: true, error };
  }
}

export default function Admin() {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [form, setForm] = useState(() => createAdminFormValues());
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    serializeFormSnapshot(createAdminFormValues())
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [validationVisible, setValidationVisible] = useState(false);

  useEffect(() => {
    document.title = "Salon Tugba Admin";

    const robotsTag = document.querySelector('meta[name="robots"]');
    const canonicalTag = document.querySelector('link[rel="canonical"]');

    if (robotsTag) {
      robotsTag.setAttribute("content", "noindex, nofollow, noarchive");
    }

    if (canonicalTag) {
      canonicalTag.setAttribute("href", "https://salontugba.vercel.app/admin");
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      const { session, shouldLogError, error, message: sessionMessage } =
        await requestSession();

      if (!active) {
        return;
      }

      if (session?.authenticated) {
        setAuthenticated(true);
        setUser(session.user ?? null);
        setAuthMessage("");
      } else {
        setAuthenticated(false);
        setUser(null);
        setAuthMessage(sessionMessage || "");
      }

      if (shouldLogError) {
        console.error("Admin session okunamadı:", error);
      }

      if (active) {
        setSessionLoading(false);
      }
    }

    bootstrapSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return undefined;
    }

    if (!db) {
      setLoading(false);
      setMessage("Firestore bağlantısı kurulamadığı için içerik yüklenemedi.");
      return undefined;
    }

    let active = true;

    async function loadSiteContent() {
      setLoading(true);
      setMessage("");

      try {
        const snapshot = await getDoc(doc(db, "site", "main"));

        if (!active) {
          return;
        }

        if (snapshot.exists()) {
          const nextForm = createAdminFormValues(snapshot.data());
          setForm(nextForm);
          setSavedSnapshot(serializeFormSnapshot(nextForm));
        } else {
          const defaultForm = createAdminFormValues(DEFAULT_SITE_CONTENT_DOC);
          setForm(defaultForm);
          setSavedSnapshot(serializeFormSnapshot(defaultForm));
          setMessage(
            "site/main belgesi bulunamadı. Varsayılan alanlarla devam edebilirsiniz."
          );
        }
      } catch (error) {
        console.error("Site verisi alınamadı:", error);

        if (active) {
          setMessage("Veri yüklenemedi. Lütfen tekrar deneyin.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSiteContent();

    return () => {
      active = false;
    };
  }, [authenticated]);

  function handleFieldChange(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateListItem(fieldName, index, key, value) {
    setForm((current) => ({
      ...current,
      [fieldName]: current[fieldName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addListItem(fieldName, item) {
    setForm((current) => ({
      ...current,
      [fieldName]: [...current[fieldName], { ...item }],
    }));
  }

  function removeListItem(fieldName, index) {
    setForm((current) => ({
      ...current,
      [fieldName]: current[fieldName].filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function moveListItem(fieldName, index, direction) {
    setForm((current) => {
      const nextItems = [...current[fieldName]];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= nextItems.length) {
        return current;
      }

      [nextItems[index], nextItems[targetIndex]] = [
        nextItems[targetIndex],
        nextItems[index],
      ];

      return {
        ...current,
        [fieldName]: nextItems,
      };
    });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthMessage("");

    try {
      const { response, payload } = await requestAdmin("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        setAuthMessage(
          buildApiErrorMessage("Giriş başarısız oldu.", response, payload)
        );
        return;
      }

      setCredentials(initialCredentials);
      setAuthenticated(true);
      setUser(payload.user ?? null);
    } catch (error) {
      console.error("Admin girişi başarısız:", error);
      setAuthMessage("Giriş isteği sırasında bir hata oluştu.");
    }
  }

  async function handleLogout() {
    try {
      await requestAdmin("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Admin çıkışı başarısız:", error);
    } finally {
      setAuthenticated(false);
      setUser(null);
      setAuthMessage("");
      setMessage("");
    }
  }

  async function handleSave() {
    if (!db) {
      setMessage("Firestore bağlantısı bulunamadığı için kaydedilemedi.");
      return;
    }

    setValidationVisible(true);
    if (validation.errorMessages.length > 0) {
      setMessage("");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const { response, payload: result } = await requestAdmin(
        "/api/admin/save-content",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: form }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false);
          setUser(null);
          setAuthMessage(
            result?.message || "Oturum süresi doldu, lütfen tekrar giriş yapın."
          );
          setMessage("");
          return;
        }

        setMessage(
          buildApiErrorMessage(
            "Kayıt sırasında bir hata oluştu.",
            response,
            result
          )
        );
        return;
      }

      const nextForm = createAdminFormValues(result?.payload ?? form);
      setForm(nextForm);
      setSavedSnapshot(serializeFormSnapshot(nextForm));
      setMessage("İçerik başarıyla kaydedildi.");
    } catch (error) {
      console.error("Site verisi kaydedilemedi:", error);
      setMessage("Kayıt sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  const isDirty = useMemo(
    () => serializeFormSnapshot(form) !== savedSnapshot,
    [form, savedSnapshot]
  );
  const validation = useMemo(() => validateAdminForm(form), [form]);
  const statusTone = statusBannerTone(message);
  const statusSummary = useMemo(() => {
    if (saving) {
      return "Kaydediliyor...";
    }

    if (loading) {
      return "İçerik yükleniyor...";
    }

    if (message) {
      return message;
    }

    if (isDirty) {
      return "Kaydedilmemiş değişiklikler var.";
    }

    return "Tüm değişiklikler kaydedildi.";
  }, [saving, loading, message, isDirty]);
  const visibleErrors = validationVisible ? validation.errors : {};
  const visibleWarnings = validationVisible ? validation.warnings : {};

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">
          Oturum kontrol ediliyor...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#1e1e1e_0%,#080808_55%)] px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">
            Salon Tuğba
          </p>
          <h1 className="mt-4 font-heading text-3xl">Admin Girişi</h1>
          <p className="mt-3 text-sm leading-7 text-white/65">
            Yönetim paneline erişmek için sunucu tarafında doğrulanan hesap
            bilgilerinizi girin.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleLogin}>
            <Field
              label="Kullanıcı adı"
              htmlFor="admin-username"
              hint="Yönetici hesabınızın kullanıcı adını girin."
            >
              <input
                id="admin-username"
                type="text"
                value={credentials.username}
                onChange={(event) =>
                  setCredentials((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                className={inputClassName()}
                autoComplete="username"
                placeholder="Örnek: admin"
              />
            </Field>

            <Field
              label="Şifre"
              htmlFor="admin-password"
              hint="Güvenli oturum için mevcut yönetici şifrenizi kullanın."
            >
              <input
                id="admin-password"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className={inputClassName()}
                autoComplete="current-password"
                placeholder="Şifrenizi girin"
              />
            </Field>

            <button type="submit" className="btn-primary mt-2">
              Giriş Yap
            </button>

            {authMessage ? (
              <p className="rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                {authMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl pb-28">
        <div className="mb-6 grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:grid-cols-[1.3fr_auto] lg:items-center">
          <div className="grid gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold">
                Admin Panel
              </p>
              <h1 className="mt-3 font-heading text-3xl">Site İçerik Yönetimi</h1>
            </div>
            <div className="grid gap-1 text-sm text-white/60">
              <p>Oturum sahibi: {user?.username || "admin"}</p>
              <p>
                İçeriği bölüm bölüm düzenleyin, son durumu sayfa altındaki aksiyon
                alanından takip edin.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading || !isDirty}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className={cardClassName()}>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              Form Durumu
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {isDirty ? "Kaydedilmemiş değişiklikler var" : "İçerik güncel"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Kaydetmeden çıkarsanız mevcut yayındaki içerik değişmez.
            </p>
          </div>

          <div className={cardClassName()}>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              Kullanım Notu
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              Bölüm bölüm ilerlemek daha rahat
            </p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Önce temel bilgiler ve hero alanını, sonra hizmetler ve galeriyi
              düzenlemek daha temiz bir akış sağlar.
            </p>
          </div>

          <div className={cardClassName()}>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              Kayıt Güveni
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              Mevcut veri akışı korunur
            </p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Bu panel yalnızca içerik alanlarını günceller; kayıt mantığı ve
              veri yapısı aynı kalır.
            </p>
          </div>
        </div>

        {validationVisible && validation.errorMessages.length > 0 ? (
          <div className="mb-6 rounded-[24px] border border-red-400/25 bg-red-400/10 px-5 py-4 text-sm text-red-100">
            <div className="flex flex-col gap-2">
              <strong className="font-semibold">
                Kaydetmeden önce düzeltilmesi gereken alanlar var
              </strong>
              <ul className="grid gap-1 leading-6">
                {validation.errorMessages.map((errorMessage, index) => (
                  <li key={`${errorMessage}-${index}`}>{errorMessage}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {validationVisible &&
        validation.errorMessages.length === 0 &&
        validation.warningMessages.length > 0 ? (
          <div className="mb-6 rounded-[24px] border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm text-amber-50">
            <div className="flex flex-col gap-2">
              <strong className="font-semibold">
                Kaydetme devam etti, ama gözden geçirmenizi önerdiğimiz alanlar var
              </strong>
              <ul className="grid gap-1 leading-6">
                {validation.warningMessages.map((warningMessage, index) => (
                  <li key={`${warningMessage}-${index}`}>{warningMessage}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {message ? (
          <div className={bannerClassName(statusTone)}>
            <div className="flex flex-col gap-1">
              <strong className="font-semibold">
                {statusTone === "success"
                  ? "Kayıt durumu"
                  : statusTone === "error"
                    ? "Bir sorun oluştu"
                    : "Bilgilendirme"}
              </strong>
              <span className="leading-6">{message}</span>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className={cardClassName()}>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">
              İçerik yükleniyor...
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="Genel Bilgiler"
                title="Marka ve temel içerik"
                description="Salon adı, kısa açıklama ve genel görünümde kullanılan temel alanları buradan düzenleyin."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="Salon adı"
                  htmlFor="salonName"
                  description="Sitede marka adı olarak görünen ana metin."
                  error={visibleErrors.salonName}
                >
                  <input
                    id="salonName"
                    type="text"
                    value={form.salonName}
                    onChange={(event) =>
                      handleFieldChange("salonName", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.salonName),
                    })}
                    placeholder="Örnek: Salon Tuğba"
                  />
                </Field>

                <Field
                  label="Tagline / kısa açıklama"
                  htmlFor="tagline"
                  description="Markanın ilk hissini veren kısa açıklama."
                  error={visibleErrors.tagline}
                >
                  <input
                    id="tagline"
                    type="text"
                    value={form.tagline}
                    onChange={(event) =>
                      handleFieldChange("tagline", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.tagline),
                    })}
                    placeholder="Örnek: Denizli'de özenli ve güven veren salon deneyimi"
                  />
                </Field>

                <Field
                  label="Logo URL"
                  htmlFor="logoUrl"
                  description="İsteğe bağlıdır. Boş kalırsa mevcut varsayılan logo kullanılır."
                  error={visibleErrors.logoUrl}
                >
                  <input
                    id="logoUrl"
                    type="url"
                    value={form.logoUrl}
                    onChange={(event) =>
                      handleFieldChange("logoUrl", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.logoUrl),
                    })}
                    placeholder="https://ornek.com/logo.png"
                  />
                </Field>

                <Field
                  label="Footer metni"
                  htmlFor="footerText"
                  description="Sayfanın alt kısmında salonu özetleyen açıklama."
                >
                  <textarea
                    id="footerText"
                    value={form.footerText}
                    onChange={(event) =>
                      handleFieldChange("footerText", event.target.value)
                    }
                    className={inputClassName()}
                    rows={4}
                    placeholder="Salonunuzu birkaç cümleyle anlatın"
                  />
                </Field>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="İletişim Bilgileri"
                title="Telefon, adres ve rezervasyon"
                description="Müşterinin size hızlıca ulaşmasını sağlayan temel bilgiler bu bölümde yer alır."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="Telefon 1"
                  htmlFor="phone1"
                  description="Ana iletişim numarası."
                  hint="Boşluklu veya boşluksuz girebilirsiniz."
                  error={visibleErrors.phone1}
                >
                  <input
                    id="phone1"
                    type="text"
                    value={form.phone1}
                    onChange={(event) =>
                      handleFieldChange("phone1", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.phone1),
                    })}
                    placeholder="0555 123 45 67"
                  />
                </Field>

                <Field
                  label="Telefon 2"
                  htmlFor="phone2"
                  description="İsteğe bağlı ikinci iletişim numarası."
                >
                  <input
                    id="phone2"
                    type="text"
                    value={form.phone2}
                    onChange={(event) =>
                      handleFieldChange("phone2", event.target.value)
                    }
                    className={inputClassName()}
                    placeholder="0500 123 45 67"
                  />
                </Field>

                <Field
                  label="Adres"
                  htmlFor="address"
                  description="Salonun açık adresini net şekilde yazın."
                  error={visibleErrors.address}
                >
                  <textarea
                    id="address"
                    value={form.address}
                    onChange={(event) =>
                      handleFieldChange("address", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.address),
                    })}
                    rows={4}
                    placeholder="Mahalle, cadde ve bina bilgisi"
                  />
                </Field>

                <Field
                  label="Çalışma saatleri"
                  htmlFor="workingHours"
                  description="Kapalı gün bilgisini de ekleyerek net saat aralığı verin."
                  error={visibleErrors.workingHours}
                >
                  <textarea
                    id="workingHours"
                    value={form.workingHours}
                    onChange={(event) =>
                      handleFieldChange("workingHours", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.workingHours),
                    })}
                    rows={4}
                    placeholder="Örnek: Salı hariç her gün 09:00 - 20:00"
                  />
                </Field>

                <Field
                  label="WhatsApp numarası"
                  htmlFor="whatsappNumber"
                  description="Rezervasyon butonlarının kullanacağı numara."
                  hint="Ülke koduyla veya yerel formatla girebilirsiniz."
                  error={visibleErrors.whatsappNumber}
                >
                  <input
                    id="whatsappNumber"
                    type="text"
                    value={form.whatsappNumber}
                    onChange={(event) =>
                      handleFieldChange("whatsappNumber", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.whatsappNumber),
                    })}
                    placeholder="90555..."
                  />
                </Field>

                <Field
                  label="WhatsApp hazır mesajı"
                  htmlFor="whatsappMessage"
                  description="Müşteri butona tıkladığında hazır açılan ilk mesaj."
                >
                  <input
                    id="whatsappMessage"
                    type="text"
                    value={form.whatsappMessage}
                    onChange={(event) =>
                      handleFieldChange("whatsappMessage", event.target.value)
                    }
                    className={inputClassName()}
                    placeholder="Merhaba, hizmetleriniz hakkında bilgi almak istiyorum."
                  />
                </Field>

                <Field
                  label="Google Maps embed linki"
                  htmlFor="googleMapsEmbedUrl"
                  description="İletişim bölümündeki harita için kullanılacak bağlantı."
                  error={visibleErrors.googleMapsEmbedUrl}
                >
                  <input
                    id="googleMapsEmbedUrl"
                    type="url"
                    value={form.googleMapsEmbedUrl}
                    onChange={(event) =>
                      handleFieldChange("googleMapsEmbedUrl", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.googleMapsEmbedUrl),
                    })}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </Field>

                <Field
                  label="Google yorum linki"
                  htmlFor="googleReviewsUrl"
                  description="Yorumlar butonunun yönleneceği bağlantı."
                  error={visibleErrors.googleReviewsUrl}
                >
                  <input
                    id="googleReviewsUrl"
                    type="url"
                    value={form.googleReviewsUrl}
                    onChange={(event) =>
                      handleFieldChange("googleReviewsUrl", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.googleReviewsUrl),
                    })}
                    placeholder="https://www.google.com/maps/place/..."
                  />
                </Field>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="Hero Alanı"
                title="İlk ekranda görünen mesaj"
                description="Ziyaretçinin ilk gördüğü başlık, açıklama ve hero görseli bu bölümden düzenlenir."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="Hero üst küçük başlık"
                  htmlFor="heroEyebrow"
                  description="Ana başlığın üstündeki kısa vurgu metni."
                >
                  <input
                    id="heroEyebrow"
                    type="text"
                    value={form.heroEyebrow}
                    onChange={(event) =>
                      handleFieldChange("heroEyebrow", event.target.value)
                    }
                    className={inputClassName()}
                    placeholder="Örnek: Denizli'de özenli salon deneyimi"
                  />
                </Field>

                <Field
                  label="Hero ana başlık"
                  htmlFor="heroHeadline"
                  description="Ana ekranda en büyük şekilde görünen mesaj."
                  error={visibleErrors.heroHeadline}
                >
                  <input
                    id="heroHeadline"
                    type="text"
                    value={form.heroHeadline}
                    onChange={(event) =>
                      handleFieldChange("heroHeadline", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.heroHeadline),
                    })}
                    placeholder="İlk bakışta net bir mesaj verin"
                  />
                </Field>

                <Field
                  label="Hero alt açıklama"
                  htmlFor="heroSubheadline"
                  description="Başlığı destekleyen kısa açıklama metni."
                  error={visibleErrors.heroSubheadline}
                >
                  <textarea
                    id="heroSubheadline"
                    value={form.heroSubheadline}
                    onChange={(event) =>
                      handleFieldChange("heroSubheadline", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.heroSubheadline),
                    })}
                    rows={4}
                    placeholder="Ziyaretçiye hizmet yaklaşımınızı birkaç cümleyle anlatın"
                  />
                </Field>

                <div className="grid gap-5">
                  <Field
                  label="Hero görseli"
                  htmlFor="heroImage"
                  description="Ana ekranda kullanılacak görsel bağlantısı."
                  error={visibleErrors.heroImage}
                >
                  <input
                    id="heroImage"
                      type="url"
                      value={form.heroImage}
                      onChange={(event) =>
                        handleFieldChange("heroImage", event.target.value)
                      }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.heroImage),
                    })}
                    placeholder="https://ornek.com/hero.jpg"
                  />
                </Field>

                  <Field
                    label="Hero görsel alt metni"
                    htmlFor="heroImageAlt"
                    description="Erişilebilirlik ve SEO için kısa görsel açıklaması."
                  >
                    <input
                      id="heroImageAlt"
                      type="text"
                      value={form.heroImageAlt}
                      onChange={(event) =>
                        handleFieldChange("heroImageAlt", event.target.value)
                      }
                      className={inputClassName()}
                      placeholder="Örnek: Salon içinde saç uygulaması"
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="CTA / Buton Metinleri"
                title="Eylem çağrılarını yönetin"
                description="Buton metinleri kısa ve net olduğunda kullanıcı ne yapacağını daha rahat anlar."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="CTA buton metni"
                  htmlFor="ctaButtonText"
                  description="Hero içindeki ikinci butonda görünür."
                  error={visibleErrors.ctaButtonText}
                >
                  <input
                    id="ctaButtonText"
                    type="text"
                    value={form.ctaButtonText}
                    onChange={(event) =>
                      handleFieldChange("ctaButtonText", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.ctaButtonText),
                    })}
                    placeholder="Örnek: Hizmetleri İncele"
                  />
                </Field>

                <Field
                  label="Rezervasyon buton metni"
                  htmlFor="bookingButtonText"
                  description="WhatsApp ve rezervasyon aksiyonlarında kullanılır."
                  error={visibleErrors.bookingButtonText}
                >
                  <input
                    id="bookingButtonText"
                    type="text"
                    value={form.bookingButtonText}
                    onChange={(event) =>
                      handleFieldChange("bookingButtonText", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.bookingButtonText),
                    })}
                    placeholder="Örnek: WhatsApp'tan Randevu Al"
                  />
                </Field>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="Instagram / Sosyal Alan"
                title="Sosyal görünürlük ve güven mesajı"
                description="Instagram alanı ve güven metinleri bir arada yönetildiğinde içerik dili daha tutarlı kalır."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="Instagram bölüm başlığı"
                  htmlFor="instagramTitle"
                  description="Sosyal alanın ana başlığı."
                >
                  <input
                    id="instagramTitle"
                    type="text"
                    value={form.instagramTitle}
                    onChange={(event) =>
                      handleFieldChange("instagramTitle", event.target.value)
                    }
                    className={inputClassName()}
                    placeholder="Örnek: Instagram'da Çalışmalarımız"
                  />
                </Field>

                <Field
                  label="Instagram linki"
                  htmlFor="instagramUrl"
                  description="Profilinize yönlendiren bağlantı."
                  error={visibleErrors.instagramUrl}
                >
                  <input
                    id="instagramUrl"
                    type="url"
                    value={form.instagramUrl}
                    onChange={(event) =>
                      handleFieldChange("instagramUrl", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.instagramUrl),
                    })}
                    placeholder="https://instagram.com/kullaniciadi"
                  />
                </Field>

                <Field
                  label="Instagram açıklaması"
                  htmlFor="instagramDescription"
                  description="Kullanıcıyı profile yönlendiren kısa açıklama."
                >
                  <textarea
                    id="instagramDescription"
                    value={form.instagramDescription}
                    onChange={(event) =>
                      handleFieldChange("instagramDescription", event.target.value)
                    }
                    className={inputClassName()}
                    rows={4}
                    placeholder="Profilinizde neler göreceklerini anlatın"
                  />
                </Field>

                <Field
                  label="Trust / güven metni"
                  htmlFor="trustText"
                  description="Neden sizi tercih etmeleri gerektiğini anlatan kısa açıklama."
                >
                  <textarea
                    id="trustText"
                    value={form.trustText}
                    onChange={(event) =>
                      handleFieldChange("trustText", event.target.value)
                    }
                    className={inputClassName()}
                    rows={4}
                    placeholder="Güven veren kısa bir açıklama yazın"
                  />
                </Field>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="SEO"
                title="Arama görünürlüğü"
                description="Arama motorlarında görünen başlık ve açıklamayı sade, net ve yerel aramalara uygun tutun."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="SEO title"
                  htmlFor="seoTitle"
                  description="Tarayıcı sekmesinde ve arama sonuçlarında görünen başlık."
                  hint="Yaklaşık 50-60 karakter aralığı genelde daha dengeli görünür."
                  error={visibleErrors.seoTitle}
                >
                  <input
                    id="seoTitle"
                    type="text"
                    value={form.seoTitle}
                    onChange={(event) =>
                      handleFieldChange("seoTitle", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.seoTitle),
                    })}
                    placeholder="Örnek: Salon Tuğba | Denizli Kuaför"
                  />
                </Field>

                <Field
                  label="SEO description"
                  htmlFor="seoDescription"
                  description="Arama sonuçlarında görünen kısa açıklama."
                  hint="Yaklaşık 140-160 karakter aralığı okunabilirliği artırır."
                  error={visibleErrors.seoDescription}
                >
                  <textarea
                    id="seoDescription"
                    value={form.seoDescription}
                    onChange={(event) =>
                      handleFieldChange("seoDescription", event.target.value)
                    }
                    className={inputClassName({
                      invalid: Boolean(visibleErrors.seoDescription),
                    })}
                    rows={4}
                    placeholder="Salonunuzu ve öne çıkan hizmetleri kısa şekilde anlatın"
                  />
                </Field>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="Duyuru / Özel Not"
                title="Kısa bilgilendirme alanları"
                description="Kampanya, kapalı gün veya kısa not gibi dikkat çekmesini istediğiniz metinleri buradan yönetin."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
                  <label
                    htmlFor="announcementEnabled"
                    className="flex items-center gap-3 text-sm font-medium text-white/78"
                  >
                    <input
                      id="announcementEnabled"
                      type="checkbox"
                      checked={form.announcementEnabled}
                      onChange={(event) =>
                        handleFieldChange(
                          "announcementEnabled",
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-[#C8A96A]"
                    />
                    Kampanya / duyuru barını aktif et
                  </label>

                  <div className="mt-4">
                    <Field
                      label="Duyuru metni"
                      htmlFor="announcementText"
                      description="Aktif olduğunda üst alanda kısa bilgi olarak görünür."
                    >
                      <input
                        id="announcementText"
                        type="text"
                        value={form.announcementText}
                        onChange={(event) =>
                          handleFieldChange("announcementText", event.target.value)
                        }
                        className={inputClassName()}
                        placeholder="Örnek: Salı günü kapalıyız"
                      />
                    </Field>
                  </div>
                </div>

                <Field
                  label="Kapalı gün / özel bilgi"
                  htmlFor="specialNotice"
                  description="Hero veya menü çevresinde kısa not olarak kullanılabilir."
                >
                  <input
                    id="specialNotice"
                    type="text"
                    value={form.specialNotice}
                    onChange={(event) =>
                      handleFieldChange("specialNotice", event.target.value)
                    }
                    className={inputClassName()}
                    placeholder="Örnek: Pazar günü randevu ile çalışıyoruz"
                  />
                </Field>
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="Hizmetler"
                title="Hizmet listesini düzenleyin"
                description="Her hizmet kendi bloğunda yer alır. Başlık ve açıklamayı net tutarak ziyaretçinin karar vermesini kolaylaştırın."
              />

              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl">Hizmetler Listesi</h2>
                  <p className="text-sm text-white/55">
                    Ekleyin, silin ve sıralayın.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addListItem("services", emptyServiceItem)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold/30 px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-black"
                >
                  Hizmet Ekle
                </button>
              </div>

              <div className="grid gap-4">
                {form.services.map((service, index) => (
                  <div
                    key={`service-${index}`}
                    className="grid gap-5 rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5 lg:grid-cols-[1fr_1.4fr_auto]"
                  >
                    <Field
                      label={`Hizmet ${index + 1} başlık`}
                      htmlFor={`service-title-${index}`}
                      description="Kartta görünen hizmet adı."
                      error={visibleErrors[`services.${index}.title`]}
                    >
                      <input
                        id={`service-title-${index}`}
                        type="text"
                        value={service.title}
                        onChange={(event) =>
                          updateListItem(
                            "services",
                            index,
                            "title",
                            event.target.value
                          )
                        }
                        className={inputClassName({
                          invalid: Boolean(visibleErrors[`services.${index}.title`]),
                        })}
                        placeholder="Örnek: Saç Kesimi"
                      />
                    </Field>

                    <Field
                      label="Açıklama"
                      htmlFor={`service-desc-${index}`}
                      description="Müşteriye bu hizmetin faydasını kısa şekilde anlatın."
                      error={visibleErrors[`services.${index}.desc`]}
                    >
                      <textarea
                        id={`service-desc-${index}`}
                        value={service.desc}
                        onChange={(event) =>
                          updateListItem(
                            "services",
                            index,
                            "desc",
                            event.target.value
                          )
                        }
                        className={inputClassName({
                          invalid: Boolean(visibleErrors[`services.${index}.desc`]),
                        })}
                        rows={4}
                        placeholder="Bu hizmeti birkaç cümleyle açıklayın"
                      />
                    </Field>

                    <div className="flex flex-wrap items-end gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => moveListItem("services", index, -1)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-gold hover:text-gold"
                      >
                        Yukarı
                      </button>
                      <button
                        type="button"
                        onClick={() => moveListItem("services", index, 1)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-gold hover:text-gold"
                      >
                        Aşağı
                      </button>
                      <button
                        type="button"
                        onClick={() => removeListItem("services", index)}
                        className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/10"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={cardClassName()}>
              <SectionHeader
                eyebrow="Galeri"
                title="Görsel ve video öğelerini yönetin"
                description="Galeri tipini, bağlantısını ve alt metnini ayrı alanlarda düzenleyerek daha temiz bir içerik akışı sağlayın."
              />

              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl">Galeri Öğeleri</h2>
                  <p className="text-sm text-white/55">
                    Görsel veya video alanlarını yönetin.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addListItem("galleryItems", emptyGalleryItem)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold/30 px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-black"
                >
                  Öğe Ekle
                </button>
              </div>

              <div className="grid gap-4">
                {form.galleryItems.map((item, index) => (
                  <div
                    key={`gallery-${index}`}
                    className="grid gap-5 rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5 lg:grid-cols-[180px_1fr_1fr_auto]"
                  >
                    <Field
                      label={`Galeri ${index + 1} tipi`}
                      htmlFor={`gallery-type-${index}`}
                      description="Bu öğenin görsel mi video mu olduğunu seçin."
                    >
                      <select
                        id={`gallery-type-${index}`}
                        value={item.type}
                        onChange={(event) =>
                          updateListItem(
                            "galleryItems",
                            index,
                            "type",
                            event.target.value
                          )
                        }
                        className={inputClassName()}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </Field>

                    <Field
                      label="Kaynak URL"
                      htmlFor={`gallery-src-${index}`}
                      description="Görsel veya videonun tam bağlantısı."
                      error={visibleErrors[`galleryItems.${index}.src`]}
                    >
                      <input
                        id={`gallery-src-${index}`}
                        type="url"
                        value={item.src}
                        onChange={(event) =>
                          updateListItem(
                            "galleryItems",
                            index,
                            "src",
                            event.target.value
                          )
                        }
                        className={inputClassName({
                          invalid: Boolean(visibleErrors[`galleryItems.${index}.src`]),
                        })}
                        placeholder="https://ornek.com/media.jpg"
                      />
                    </Field>

                    <Field
                      label="Alt metin"
                      htmlFor={`gallery-alt-${index}`}
                      description="İçeriği kısa şekilde tanımlayan açıklama."
                      warning={visibleWarnings[`galleryItems.${index}.alt`]}
                    >
                      <input
                        id={`gallery-alt-${index}`}
                        type="text"
                        value={item.alt}
                        onChange={(event) =>
                          updateListItem(
                            "galleryItems",
                            index,
                            "alt",
                            event.target.value
                          )
                        }
                        className={inputClassName({
                          warning: Boolean(visibleWarnings[`galleryItems.${index}.alt`]),
                        })}
                        placeholder="Örnek: Saç boyama sonrası görünüm"
                      />
                    </Field>

                    <div className="flex flex-wrap items-end gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => moveListItem("galleryItems", index, -1)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-gold hover:text-gold"
                      >
                        Yukarı
                      </button>
                      <button
                        type="button"
                        onClick={() => moveListItem("galleryItems", index, 1)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:border-gold hover:text-gold"
                      >
                        Aşağı
                      </button>
                      <button
                        type="button"
                        onClick={() => removeListItem("galleryItems", index)}
                        className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/10"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="pointer-events-auto mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-[#0e0e0e]/95 p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                Kayıt Durumu
              </p>
              <p className="text-sm font-medium text-white">{statusSummary}</p>
              <p className="text-xs text-white/45">
                {isDirty
                  ? "Değişiklikler henüz kayıt edilmedi."
                  : "Paneldeki içerik son kaydedilen sürümle uyumlu."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading || !isDirty}
                className="btn-primary disabled:opacity-60"
              >
                {saving ? "Kaydediliyor..." : isDirty ? "Kaydet" : "Kaydedildi"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
