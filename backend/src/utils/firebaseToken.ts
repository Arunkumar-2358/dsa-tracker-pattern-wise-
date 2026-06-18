import { createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Verify a Firebase phone-auth ID token WITHOUT the firebase-admin SDK.
 *
 * firebase-admin's verifyIdToken hangs on Vercel serverless, so we verify the
 * JWT directly against Google's public keys (proven reachable in ~100ms). We
 * only need the project ID — no service-account private key required.
 */
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
  { timeoutDuration: 5000 }
);

function getProjectId(): string {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  // Fall back to the project_id inside the existing service-account env var.
  const enc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (enc) {
    const sa = JSON.parse(Buffer.from(enc, 'base64').toString('utf-8')) as { project_id?: string };
    if (sa.project_id) return sa.project_id;
  }
  throw new Error('FIREBASE_PROJECT_ID (or FIREBASE_SERVICE_ACCOUNT) not set');
}

export interface VerifiedFirebaseToken {
  uid: string;
  phone?: string;
}

export async function verifyFirebaseToken(idToken: string): Promise<VerifiedFirebaseToken> {
  const projectId = getProjectId();
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  return {
    uid: (payload.sub as string) ?? (payload.user_id as string),
    phone: payload.phone_number as string | undefined,
  };
}
