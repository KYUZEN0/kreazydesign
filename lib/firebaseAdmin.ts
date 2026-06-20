import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// PENTING: file ini hanya boleh diimpor dari kode server (API routes).
// Jangan pernah impor file ini dari komponen "use client".
// Kredensial di bawah dibaca dari environment variables yang TIDAK
// memakai prefix NEXT_PUBLIC_, sehingga tidak pernah ikut ter-bundle
// ke kode yang dikirim ke browser pengguna.

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private key disimpan di env var dengan \n literal, perlu di-decode.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Kredensial Firebase Admin belum diset. Cek FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, dan FIREBASE_PRIVATE_KEY di environment variables."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

export function getDb() {
  const app = getAdminApp();
  return getFirestore(app);
}

export function getBucket() {
  const app = getAdminApp();
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error(
      "FIREBASE_STORAGE_BUCKET belum diset di environment variables."
    );
  }
  return getStorage(app).bucket();
}
