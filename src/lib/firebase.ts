// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: This is a public configuration and is safe to expose on the client-side.
// Security is enforced by Firebase Security Rules.
const firebaseConfig = {
  "projectId": "alquilafacil-9w9o4",
  "appId": "1:119765542237:web:4f6827cdee5c338fa9f4b4",
  "storageBucket": "alquilafacil-9w9o4.firebasestorage.app",
  "apiKey": "AIzaSyBQJo9RCUCpVogDV4F5hurgPyXfIWdXyLg",
  "authDomain": "alquilafacil-9w9o4.firebaseapp.com",
  "messagingSenderId": "119765542237"
};

// Initialize Firebase for client-side usage
// Using getApps() and getApp() to prevent re-initialization during hot-reloads in development
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
