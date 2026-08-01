import { cert, getApps, initializeApp } from "firebase-admin/app";
import { env } from "./env.js";

export function initFirebaseAdmin(): boolean {
  if (getApps().length) return true;
  try {
    if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      initializeApp();
    }
    return true;
  } catch {
    return false;
  }
}
