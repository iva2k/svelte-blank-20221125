import { derived, type Readable } from 'svelte/store';
import { browser, dev } from '$app/environment';
import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import { app } from './app';

// load the firebase auth client as a store and provide an API to access its methods
// this depends on the app store and will also only be loaded on demand
// so no firebase JS loaded unless the page needs it
const createAuth = () => {
  let auth: Auth;

  const { subscribe } = derived<Readable<FirebaseApp>, Auth>(app, ($app, set) => {
    async function init() {
      if ($app && !auth) {
        const { getAuth, connectAuthEmulator } = await import('firebase/auth');
        auth = getAuth($app);
        if (dev) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
        set(auth);
      }
    }

    if (browser) init();
  });

  async function providerFor(loginService: string) {
    const { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, OAuthProvider } =
      await import('firebase/auth');
    const providerId = 'TODO'; // TODO: (now) Implement providerId for OAuthProvider
    switch (loginService) {
      case 'google': {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        return provider;
      }
      case 'facebook':
        return new FacebookAuthProvider();
      case 'github':
        return new GithubAuthProvider();
      case 'oauth':
        return new OAuthProvider(providerId);
      default:
        throw 'unknown provider ' + loginService;
    }
  }

  async function signInWith(
    loginService: string,
    method = 'redirect',
    email?: string,
    password?: string
  ) {
    try {
      const { signInWithRedirect, signInWithPopup, signInWithEmailAndPassword } = await import(
        'firebase/auth'
      );
      const provider = await providerFor(loginService);
      let fnc;
      let res;
      switch (method) {
        case 'email':
          if (!email || !password) throw 'email and password are required for email method';
          res = await signInWithEmailAndPassword(auth, email, password);
          return;
        case 'redirect':
          fnc = signInWithRedirect;
          break;
        case 'popup':
          fnc = signInWithPopup;
          break;
        default:
          throw 'unknown method ' + method;
      }
      res = await fnc(auth, provider);
      console.log('DEBUG: signInWith() res=%o', res);
    } catch (e) {
      console.error('Error %s logging in with %s', e, loginService);
    }
  }

  async function signOut() {
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (e) {
      console.error('Error %s logging out', e);
    }
  }

  return {
    subscribe,
    signInWith,
    signOut
  };
};

export const auth = createAuth();
