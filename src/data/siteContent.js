export function buildWhatsAppUrl(message = "Merhaba, randevu almak istiyorum") {
  return `https://wa.me/905558739174?text=${encodeURIComponent(message)}`;
}

const base = import.meta.env.BASE_URL;

export const siteContent = {
  name: "Salon Tuğba",
  tagline: "Güzelliğinize değer katan profesyonel salon deneyimi",

  address: "Sırakapılar, Mimar Sinan Cd. No:22 ",

  phoneDisplay: "0555 873 91 74",
  phoneHref: "tel:+905558739174",

  phoneDisplay2: "0507 935 71 54",
  phoneHref2: "tel:+905079357154",

  instagramUrl: "https://instagram.com/salonntugba",

  whatsappUrl: buildWhatsAppUrl("Merhaba, randevu almak istiyorum"),

  heroImage: `${base}hero.jpg`,
  heroImageAlt: "Salon Tuğba'da profesyonel saç uygulaması",

  workingHours: "Salı günü kapalıdır. Diğer günler 09:00 - 20:00",

  hero: {
    eyebrow: "Denizli'de premium bakım",
    headline: "Kendinizi iyi hissettiren saç ve bakım uygulamaları",
    subheadline:
      "Uzman ekibimizle kesimden renklendirmeye kadar size özel, güven veren ve randevuya dönüşen profesyonel salon deneyimi.",
  },

  services: [
    {
      title: "Saç Kesimi",
      desc: "Yüzünüze ve stilinize uygun modern kesimler.",
    },
    {
      title: "Boya",
      desc: "Kalıcı ve profesyonel saç renklendirme uygulamaları.",
    },
    {
      title: "Ombre & Sombre",
      desc: "Doğal geçişli modern renk teknikleri.",
    },
    {
      title: "Gelin Saçı & Makyajı",
      desc: "Özel gününüz için profesyonel saç ve makyaj hizmeti.",
    },
    {
      title: "Manikür & Pedikür",
      desc: "Temiz ve bakımlı eller ve ayaklar için uygulamalar.",
    },
    {
      title: "Kalıcı Oje",
      desc: "Uzun süre dayanıklı ve estetik oje uygulaması.",
    },
    {
      title: "Kaş & Bıyık",
      desc: "Yüzünüze uygun profesyonel bakım işlemleri.",
    },
    {
      title: "Ağda",
      desc: "Hijyenik ve etkili epilasyon hizmeti.",
    },
  ],

  galleryItems: [
    {
      type: "video",
      src: `${base}instagram/1.mp4`,
      label: "Saç dönüşüm videosu",
    },
    {
      type: "image",
      src: `${base}instagram/2.jpg`,
      alt: "Salon Tuğba saç tasarımı örneği",
    },
    {
      type: "video",
      src: `${base}instagram/3.mp4`,
      label: "Saç bakım uygulaması videosu",
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
      label: "Salon çalışmasından kısa video",
    },
  ],

  trust: {
    googleUrl:
      "https://www.google.com/maps/place/Salon+Tu%C4%9Fba/@37.7755948,29.0835913,17z/data=!4m18!1m9!3m8!1s0x14c73faf26e65acf:0x992b77c0e62a5be4!2sSalon+Tu%C4%9Fba!8m2!3d37.7755948!4d29.0835913!9m1!1b1!16s%2Fg%2F11c1tfjgfq!3m7!1s0x14c73faf26e65acf:0x992b77c0e62a5be4!8m2!3d37.7755948!4d29.0835913!9m1!1b1!16s%2Fg%2F11c1tfjgfq",
  },
};