// sandboxedStore.ts
// From https://github.com/sveltejs/kit/discussions/4339#discussioncomment-3258927

/** Usage:
 *   import { writable } from 'sandboxedStore';
 *   const foo = writable();
 *   const bar = writable('initial value');
 */

import { browser } from '$app/environment';
import { getStores } from '$app/stores';
import { v4 as uuidv4 } from 'uuid';
import { get, writable as svelteWritable } from 'svelte/store';

const storesKey = `sandbox_${uuidv4()}`;

/**
 * Creates a façade for a writable store that is a sandboxed store that may be used as a
 * global variable. It must be initialized during component initialization.
 *
 * This store is contextual since it is added to the context of the root component. This means that
 * it is unique to each request on the server rather than shared across multiple requests handled
 * by the same server at the same time, allowing it to be used as a global variable while also
 * holding user-specific data.
 *
 * We must subscribe to this store during component initialization before we can use it. It is
 * utilized in the same way as [SvletKit's app stores](https://kit.svelte.dev/docs/modules#$app-stores).
 *
 * _NB: In async methods, set the store before any `await`—otherwise, the context will be lost once
 * the promise is fulfilled._
 *
 * @param {any} initialValue An initial value to set the store to
 * @param {string} [key] An optional key name for the store
 */
export function writable<T>(initialValue?: T | undefined, key?: string | undefined) {
  const non_null_key = key ? `${key}_${uuidv4()}` : uuidv4();

  function getSession() {
    const { page: sessionStore } = getStores();
    const { data: session } = get(sessionStore);
    return session;
  }
  function setStore(value?: T | undefined) {
    try {
      const session = getSession();
      const store = session?.[storesKey]?.[non_null_key];
      const currentValue = store ? store.value : initialValue;

      if (!store || value !== currentValue) {
        if (!session[storesKey]) session[storesKey] = {};
        session[storesKey][non_null_key] = {
          value,
          subscribers: store?.subscribers || []
        };

        // alert subscribers
        if (store) {
          store.subscribers.forEach((fn: (v: T | undefined) => void) => {
            fn(value);
          });

          // return the updated value
          return value;
        }
      }
    } catch (error) {
      // if we reached this exception, it meant that the store had not yet been initialized
      return value;
    }
  }

  const sandboxedWritable = {
    set: setStore,
    subscribe: (fn: (v: T | undefined) => void) => {
      try {
        const session = getSession();
        const store = session?.[storesKey]?.[non_null_key];
        const currentValue = store ? store.value : initialValue;

        // call the subscription function with the current value
        fn(currentValue);

        // register the subscriber
        if (!session[storesKey]) session[storesKey] = {};
        session[storesKey][non_null_key] = {
          value: store?.value || initialValue,
          subscribers: [...(store?.subscribers || []), fn]
        };
      } catch (error) {
        // if we reached this exception, it meant that the store had not yet been initialized
        // call the subscription function with the initial value
        fn(initialValue);
      }

      // return the unsubscribe function
      return function unsubscribe() {
        try {
          const session = getSession();
          // unregister the subscriber
          const { subscribers } = session[storesKey][non_null_key];
          subscribers.splice(subscribers.indexOf(fn), 1);
        } catch (error) {
          // if we reached this exception, it meant that the store had not yet been initialized
          // ignore
        }
      };
    },
    update: (fn: (v: T | undefined) => T | undefined) => {
      try {
        const session = getSession();
        const store = session?.[storesKey]?.[non_null_key];
        const currentValue = store ? store?.value : initialValue;
        setStore(fn(currentValue));
      } catch (error) {
        // if we reached this exception, it meant that the store had not yet been initialized
        setStore(fn(initialValue));
      }
    }
  };

  return browser ? svelteWritable(initialValue) : sandboxedWritable;
}
