// TypedStore supports restoring data from strore as full object.
// RawLocalStorage provides localStorage for TypedStore.

// For fixing sporadic error "Cannot find name 'window' ts2304" in VSCode, which has something to do with use of <reference no-default-lib="true"/>
// <reference lib="DOM" />

import { browser } from '$app/environment';
// import { writable } from 'svelte/store'; // Instead of Svelte writable, use writable from sandboxedStore:
import { writable } from './sandboxedStore';
import { plainToInstance, instanceToPlain } from 'class-transformer'; // https://www.npmjs.com/package/class-transformer

type Unboxed<T> = T extends (infer U)[] ? U : T;

export interface IRawStorage {
  isHere(): boolean; // Return true if implemented on this environment
  getItem(key: string): string | null;
  setItem(key: string, value: string | undefined): void;
  removeItem(key: string): void;
}
export class RawLocalStorage implements IRawStorage {
  isHere() {
    return browser;
  }
  getItem(key: string) {
    return browser ? window.localStorage.getItem(key) : null;
  }
  setItem(key: string, value: string) {
    browser && window.localStorage.setItem(key, value);
  }
  removeItem(key: string) {
    browser && window.localStorage.removeItem(key);
  }
}
export class RawLocalSessionStorage implements IRawStorage {
  isHere() {
    return browser;
  }
  getItem(key: string) {
    return browser ? window.sessionStorage.getItem(key) : null;
  }
  setItem(key: string, value: string) {
    browser && window.sessionStorage.setItem(key, value);
  }
  removeItem(key: string) {
    browser && window.sessionStorage.removeItem(key);
  }
}

export interface ITypedStorage<T> {
  getItemOrDefault(
    key: string,
    defaultValue: T,
    objectType?: { new (): Unboxed<T> }
  ): T | Unboxed<T>;
  setItem(key: string, value: T, objectType?: { new (): Unboxed<T> }): void;
  removeItem(key: string): void;
}

export class TypedStorage<S extends IRawStorage, T> implements ITypedStorage<T> {
  rawStorage: S;
  constructor(rawStorage: NonNullable<S>) {
    this.rawStorage = rawStorage;
  }

  getItemOrDefault(
    key: string,
    defaultValue: T,
    objectType?: { new (): Unboxed<T> }
  ): T | Unboxed<T> {
    const s: string = this.rawStorage.getItem(key) || '';
    if (s === null) return defaultValue;

    try {
      const r = JSON.parse(s);
      if (objectType) {
        // Restore object
        return plainToInstance(objectType, r);
      }
      return r;
    } catch (e) {
      return defaultValue;
    }
  }

  setItem(key: string, value: T | undefined, objectType?: { new (): Unboxed<T> }): void {
    if (value !== undefined) {
      const v = objectType ? instanceToPlain<T>(value) : (value as Record<string, never>);
      this.rawStorage.setItem(key, JSON.stringify(v));
    } else {
      this.rawStorage.setItem(key, undefined);
    }
  }
  removeItem(key: string) {
    this.rawStorage.removeItem(key);
  }
}

// BEGIN Create a typed store:
// import { TypedStorage, RawLocalStorage } from '$lib/shared/stores/stores';
const STORE_KEY = 'theme';
const defaultValue = 'summer';
const myLocalStorage = new TypedStorage<RawLocalStorage, string>(new RawLocalStorage());
const initialValue = myLocalStorage.getItemOrDefault(STORE_KEY, defaultValue);
const theme = writable<string>(initialValue);
theme.subscribe((value) => {
  myLocalStorage.setItem(STORE_KEY, value);
});

export default theme;
// END Create a typed store

/* Use the store:
<script>
  import { theme } from '$lib/shared/stores/stores';
  $: isSomething = $theme === 'something'; // Reactive value from Observable
  theme.set('something'); // Write to store
  ...
*/
