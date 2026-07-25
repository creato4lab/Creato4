import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCyY2Olj8xZeRqU6s14yxAgcgygXqihO5k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "creato4lab-10d57.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "creato4lab-10d57",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "creato4lab-10d57.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "865230372106",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:865230372106:web:338f6d0ac365c1f545cef3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3TJ1336E43"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Safe Analytics Initialization
export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics non-fatal initialization error:", err);
  });
}

export default app;
