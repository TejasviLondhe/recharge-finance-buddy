
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDVu7KzPVA_9rGtysBCxoexj_BzJy8siQ",
  authDomain: "lovable-phone-auth-demo.firebaseapp.com",
  projectId: "lovable-phone-auth-demo",
  storageBucket: "lovable-phone-auth-demo.appspot.com",
  messagingSenderId: "589562446261",
  appId: "1:589562446261:web:f588294e703be6aa9d547a"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
