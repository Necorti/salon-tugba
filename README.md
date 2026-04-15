# Salon Tugba

Denizli'deki Salon Tugba icin hazirlanmis React + Vite tabanli premium kuafor sitesi.

## Teknoloji

- React 19
- Vite 8
- Tailwind CSS 3
- Firebase Firestore
- Vercel Serverless Functions

## Ortam Degiskenleri

`.env` dosyanizda asagidaki alanlar bulunmalidir:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Ornek admin degerleri:

- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=salontugba`
- `ADMIN_SESSION_SECRET=supersecret123`

Firebase Admin SDK icin server-side degerler:

- `FIREBASE_PROJECT_ID`: Firebase projesinin ID'si
- `FIREBASE_CLIENT_EMAIL`: Service account icindeki `client_email`
- `FIREBASE_PRIVATE_KEY`: Service account icindeki `private_key`

`FIREBASE_PRIVATE_KEY` degerini `.env` veya Vercel ortamina tek satir olarak girerken newline karakterlerini `\n` olarak yazin. Serverless route bu degeri runtime'da gercek satir sonlarina cevirir.

Deger basta/sonda tek ya da cift quote ile gelirse server tarafı bu quote'lari temizler, `trim` uygular ve private key'i production ortaminda kullanilabilir hale getirir.

## Local Gelistirme

Ana site arayuzunu hizli gelistirmek icin:

- `npm run dev`

Admin login ve `/api/admin/*` endpoint'lerini local ortamda gercekten calistirmak icin kullanilmasi gereken komut:

- `npm run dev:vercel`

Bu komut Vercel serverless route'larini da actigi icin admin auth testi icin dogru akistir.

## Diger Komutlar

- `npm run build` uretim build'ini olusturur
- `npm run lint` ESLint kontrolunu calistirir
- `npm run preview` build ciktisini yerelde acar

## Icerik Akisi

- Ana icerik kaynagi Firestore'daki `site/main` belgesidir.
- Varsayilan ve fallback icerikler `src/lib/siteContent.js` icinde tutulur.
- `src/backup/siteContent.backup.js` sadece referans kaynaktir; runtime import edilmez.
- Backup icerikle aktif icerik cakisırsa backup verisi esas alinır.
- Site okumalari client-side Firestore read ile devam eder.
- Admin paneldeki kaydetme akisi `/api/admin/save-content` endpoint'i uzerinden server-side Firebase Admin SDK ile `site/main` belgesine `merge: true` olarak yazilir.

## Admin Girisi

- Giris dogrulamasi server-side yapilir.
- Oturum `HttpOnly` cookie ile tutulur.
- Sifre frontend icine gomulmez ve `localStorage` kullanilmaz.
- Local ve production ortamlarinda ayni endpoint yapisi korunur.

## SEO ve Yayin Dosyalari

- Statik SEO meta etiketleri `index.html` icindedir.
- Runtime SEO guncellemeleri `src/App.jsx` icinde yapilir.
- Admin route noindex ayari `src/admin.jsx` icindedir.
- Arama motoru dosyalari `public/robots.txt` ve `public/sitemap.xml` altindadir.

Domain degisirse asagidaki alanlari birlikte guncelleyin:

- `index.html` icindeki `canonical`, `og:url`, `og:image`, `twitter:url`, `twitter:image`
- `src/App.jsx` icindeki `SITE_URL`
- `src/admin.jsx` icindeki admin canonical adresi
- `public/robots.txt` icindeki sitemap adresi
- `public/sitemap.xml` icindeki `loc` alanlari
