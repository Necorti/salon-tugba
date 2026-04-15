import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyCfG5hRyfwNAo_LeAmjtB2onSFaHr3gjfe0",
  authDomain: "salon-tugba.firebaseapp.com",
  projectId: "salon-tugba",
  storageBucket: "salon-tugba.firebasestorage.app",
  messagingSenderId: "121508474546",
  appId: "1:121508474546:web:defffc2c41b3c565be63ab",
};

const envFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredFirebaseConfigEntries = [
  ["apiKey", "VITE_FIREBASE_API_KEY"],
  ["authDomain", "VITE_FIREBASE_AUTH_DOMAIN"],
  ["projectId", "VITE_FIREBASE_PROJECT_ID"],
  ["storageBucket", "VITE_FIREBASE_STORAGE_BUCKET"],
  ["messagingSenderId", "VITE_FIREBASE_MESSAGING_SENDER_ID"],
  ["appId", "VITE_FIREBASE_APP_ID"],
];

function logFirebaseClient(level, message, details) {
  const logger = console[level] ?? console.warn;

  if (details) {
    logger(`[firebase-client] ${message}`, details);
    return;
  }

  logger(`[firebase-client] ${message}`);
}

function resolveFirebaseConfig() {
  const missingEnvKeys = requiredFirebaseConfigEntries
    .filter(([configKey]) => !envFirebaseConfig[configKey])
    .map(([, envKey]) => envKey);

  if (missingEnvKeys.length === 0) {
    return envFirebaseConfig;
  }

  if (!import.meta.env.DEV) {
    logFirebaseClient(
      "warn",
      "PROD ortaminda VITE Firebase config eksik. Firestore disabled.",
      { missingEnvKeys }
    );
    return null;
  }

  logFirebaseClient(
    "warn",
    "DEV ortaminda VITE Firebase config eksik. Fallback Firebase config kullanildi.",
    { missingEnvKeys }
  );

  const mergedConfig = {
    ...fallbackFirebaseConfig,
    ...Object.fromEntries(
      Object.entries(envFirebaseConfig).filter(([, value]) => Boolean(value))
    ),
  };

  return mergedConfig;
}

let app = null;
let db = null;

try {
  const firebaseConfig = resolveFirebaseConfig();

  if (firebaseConfig) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  logFirebaseClient(
    "warn",
    "Firebase client baslatilamadi. Firestore okunabilir durumda olmayacak.",
    error
  );
}

export { app, db };
