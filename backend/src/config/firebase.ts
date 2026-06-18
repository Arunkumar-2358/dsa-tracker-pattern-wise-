import admin from 'firebase-admin';

let app: admin.app.App | null = null;

/**
 * Lazily initialize the Firebase Admin SDK.
 *
 * The service account is provided as a base64-encoded JSON string in the
 * FIREBASE_SERVICE_ACCOUNT env var (base64 avoids newline/quote issues that
 * break multi-line env vars on Vercel). Generate it with:
 *   base64 -i serviceAccountKey.json | pbcopy   (macOS)
 */
export function getFirebaseAdmin(): admin.app.App {
  if (app) return app;

  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!encoded) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env var is not set');
  }

  const json = Buffer.from(encoded, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(json) as Record<string, string>;

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    // Set explicitly so verifyIdToken never falls back to the GCP metadata
    // server for project discovery (which hangs in non-GCP environments).
    projectId: serviceAccount.project_id,
  });
  return app;
}
