import type { LayoutServerLoad } from './$types';
import { _getSession } from './session/+server';

export const load: LayoutServerLoad = async ({ locals }) => {
  // session consists of just the user object, but could contain other preferences
  const { user } = locals;
  const session = _getSession({
    aud: '',
    iat: 0,
    iss: '',
    sub: '',
    exp: 0,
    auth_time: 0,
    firebase: {
      identities: [],
      sign_in_provider: ''
    },
    uid: '',
    ...user
  });

  // layout data could also return additional data other than the session, such as site config
  return { session };
};
