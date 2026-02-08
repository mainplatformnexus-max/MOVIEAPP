import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBAnK_DfXl3A29MK6gWh5jkBird81I5gVs",
  authDomain: "luo-movies.firebaseapp.com",
  databaseURL: "https://luo-movies-default-rtdb.firebaseio.com",
  projectId: "luo-movies",
  storageBucket: "luo-movies.firebasestorage.app",
  messagingSenderId: "949104157796",
  appId: "1:949104157796:web:f3c87eabd306c46ec06b71",
  measurementId: "G-NSGXF3N91S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only if supported (not in SSR)
isSupported().then(yes => yes && getAnalytics(app));

export default app;
