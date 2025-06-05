
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDVu7KzPVA_9rGtysBCxoexj_BzJy8siQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lovable-phone-auth-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lovable-phone-auth-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lovable-phone-auth-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "589562446261",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:589562446261:web:f588294e703be6aa9d547a"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

// Enable persistence for better user experience
firebaseAuth.useDeviceLanguage();
