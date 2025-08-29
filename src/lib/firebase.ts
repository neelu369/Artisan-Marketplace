// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your config (same as yours)
const firebaseConfig = {
  apiKey: "AIzaSyCTSE2m1vmgEIz-jOSzH-Au-MFyWdy_yBU",
  authDomain: "artisan-marketplace-ai-b31cf.firebaseapp.com",
  projectId: "artisan-marketplace-ai-b31cf",
  storageBucket: "artisan-marketplace-ai-b31cf.appspot.com",
  messagingSenderId: "1098354854044",
  appId: "1:1098354854044:web:6954e13acb8c0502b10559",
  measurementId: "G-FG8ZPC53GG"
};

// Initialize once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;