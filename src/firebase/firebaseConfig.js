import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyBfbcxMYE3PpW-BlcXLAQdb9BKgjnCgkUQ",
  authDomain: "realtime-notepad-90251.firebaseapp.com",
  projectId: "realtime-notepad-90251",
  storageBucket: "realtime-notepad-90251.firebasestorage.app",
  messagingSenderId: "1053545408242",
  appId: "1:1053545408242:web:97999f95540b5c1768526b",
  measurementId: "G-0ND81C5089"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
