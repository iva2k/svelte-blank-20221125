import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import website from '$lib/config/website';
const { PUBLIC_FIREBASE_PROJECT_ID } = website;

const useEmulator = true;

if (useEmulator) {
  process.env['FIREBASE_AUTH_EMULATOR_HOST'] = '127.0.0.1:9099';
}

// this is the server-side firebase client
export const app = initializeApp({ projectId: PUBLIC_FIREBASE_PROJECT_ID });
export const auth = getAuth(app);
/* TODO: (when needed) Add firebase mock:
export const app = {};
export const auth = {
  verifySessionCookie: (session: string) => {
    let user = {
      uid: '0',
      email: 'user@example.com',
      name: 'Example User',
      email_verified: true,
      roles: []
    };
    const decoded = JSON.parse(session);
    if (decoded?.user) {
      user = decoded.user;
    }
    return user;
  }
};
*/
