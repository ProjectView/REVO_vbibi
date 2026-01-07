
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpTyTEeMvX9eDPEu3whUU5-0Fojg886Fs",
  authDomain: "revo-7904e.firebaseapp.com",
  projectId: "revo-7904e",
  storageBucket: "revo-7904e.firebasestorage.app",
  messagingSenderId: "121851170164",
  appId: "1:121851170164:web:8e0b877f17922796893021",
  measurementId: "G-RBR0SXHEMV"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export des services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
