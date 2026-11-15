import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

let dbInstance: Firestore | undefined;

export async function getFirebaseDb(): Promise<Firestore> {
  if (!dbInstance) {
    const { getFirestore } = await import("firebase/firestore");
    dbInstance = getFirestore(getFirebaseApp());
  }
  return dbInstance;
}

let authInstance: import("firebase/auth").Auth | undefined;

export async function getFirebaseAuth(): Promise<import("firebase/auth").Auth> {
  if (!authInstance) {
    const { getAuth } = await import("firebase/auth");
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

export { getFirebaseApp as app };
export default getFirebaseApp;

