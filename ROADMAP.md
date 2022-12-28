# ROADMAP

## Plan

1. Organize app common stuff: settings manager (localStorage/cookie/session/db), toast interface, layout API - show/hide footer, global drawer(?)
2. UI framework branches - port from 2022-0525
3. Auth?
4. Backend Server (non-SvelteKit)?
5. Push Notifications?
6. Explore turborepo <https://www.npmjs.com/package/turbo>

## Package Updates

1. @sveltejs/kit 1.0.1 (first update to @sveltejs/kit@1.0.0-next.588)
2. @storybook/svelte 6.5.x -> @storybook/sveltekit 7.0.0 <https://www.npmjs.com/package/@storybook/sveltekit>
3. Migrate to Histoire? <https://histoire.dev/guide/svelte3/getting-started.html>

## Ideas

### Auth

SvelteKit-Auth <https://www.npmjs.com/package/sk-auth> is dead as of 2022-06, all latest SvelteKit breaking changes killed it.

See progress in <https://github.com/nextauthjs/next-auth/tree/main/apps/playground-sveltekit> (yes, @next-auth/sveltekit).

### Settings Manager

All apps need global state, settings and data stores.

Persistent data can be saved in:

- client: localStorage
- server: client cookie
- server: session
- server: db

To create a powerful abstraction... declare settings by record (define all property types), and define for this record how to implement it, instead of boilerplate code, declare it's scope, lifetime and persistence backend. Settings Manager will implement all client/server code and place to hook up the backend.

Data marshalling (serialization) is a big obstacle. This is very enlightening post: <https://medium.com/@dorontohar/a-simple-type-safe-http-client-wrapper-edb7df9317db>.

```ts
import { ApisauceInstance } from 'apisauce'; // https://www.npmjs.com/package/apisauce
import { plainToClass } from 'class-transformer'; // https://www.npmjs.com/package/class-transformer
import { CachedApiClientFactory } from '../common/cache';

type Unboxed<T> = T extends (infer U)[] ? U : T;

export class Api {
  api: ApisauceInstance;

  constructor(url: string, name: string) {
    const factory = new CachedApiClientFactory();
    this.api = factory.createClient(url, name);
  }

  async get<T = any>(
    url: string,
    params?: Record<string, unknown>,
    objectType?: { new (): Unboxed<T> }
  ): Promise<T> {
    const res = await this.api.get<T>(url, params, {
      transformResponse: objectType && ((res) => plainToClass(objectType, res))
    });

    if (!res.ok) {
      throw new Error(`Failed to GET ${url} - ${res.problem}`);
    }
    return res.data;
  }
}
```

```bash
pnpm i --save uuid class-transformer
pnpm i -D @types/uuid
```
