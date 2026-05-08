import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlq2_7mlRnTq0c_bQyja_7y1LzKxq8Mc4",
  authDomain: "crelante-expense-tracker.firebaseapp.com",
  projectId: "crelante-expense-tracker",
  storageBucket: "crelante-expense-tracker.firebasestorage.app",
  messagingSenderId: "947230641652",
  appId: "1:947230641652:web:f6c2fdc9c0a149ce447da1",
  measurementId: "G-133MYT45ZE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);