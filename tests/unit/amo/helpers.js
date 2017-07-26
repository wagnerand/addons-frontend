import { normalize } from 'normalizr';

import createStore from 'amo/store';
import {
  setClientApp, setLang, setAuthToken, setUserAgent,
} from 'core/actions';
import { addon as addonSchema } from 'core/api';
import { searchLoad } from 'core/actions/search';

import {
  userAuthToken, sampleUserAgent, signedInApiState as coreSignedInApiState,
} from '../helpers';

export const fakeAddon = Object.freeze({
  id: 1234,
  guid: '1234@my-addons.firefox',
  name: 'Chill Out',
  icon_url: 'https://addons.cdn.mozilla.net/webdev-64.png',
  slug: 'chill-out',
  average_daily_users: 100,
  authors: [{
    name: 'Krupa',
    url: 'http://olympia.dev/en-US/firefox/user/krupa/',
  }],
  current_version: {
    id: 123,
    license: { name: 'tofulicense', url: 'http://license.com/' },
    version: '2.0.0',
    files: [],
  },
  previews: [],
  ratings: {
    count: 10,
    average: 3.5,
  },
  summary: 'This is a summary of the chill out add-on',
  description: 'This is a longer description of the chill out add-on',
  has_privacy_policy: true,
  has_eula: true,
  homepage: 'http://hamsterdance.com/',
  support_url: 'http://support.hampsterdance.com/',
  type: 'extension',
});

export const fakeReview = Object.freeze({
  id: 8876,
  // The API only provides a minimal add-on representation.
  addon: {
    id: fakeAddon.id,
    slug: fakeAddon.slug,
  },
  created: '2017-01-09T21:49:14Z',
  rating: 3,
  version: fakeAddon.current_version,
  user: {
    id: 1234,
    name: 'fred',
    url: 'http://some.com/link/to/profile',
  },
  is_latest: false,
  body: 'It is Okay',
  title: 'Review Title',
});

/*
 * Redux store state for when a user has signed in.
 */
export const signedInApiState = Object.freeze({
  ...coreSignedInApiState,
  clientApp: 'firefox',
});

export function dispatchClientMetadata({
  store = createStore().store,
  clientApp = 'android',
  lang = 'en-US',
  userAgent = sampleUserAgent,
} = {}) {
  store.dispatch(setClientApp(clientApp));
  store.dispatch(setLang(lang));
  store.dispatch(setUserAgent(userAgent));

  return {
    store,
    state: store.getState(),
  };
}

export function dispatchSignInActions({
  authToken = userAuthToken(),
  ...otherArgs
} = {}) {
  const { store } = dispatchClientMetadata(otherArgs);

  store.dispatch(setAuthToken(authToken));

  return {
    store,
    state: store.getState(),
  };
}

export function dispatchSearchResults({
  addons = {
    [fakeAddon.slug]: fakeAddon,
    'some-other-slug': { ...fakeAddon, slug: 'some-other-slug' },
  },
  filters = { query: 'test' },
  store = dispatchClientMetadata().store,
} = {}) {
  store.dispatch(searchLoad({
    entities: { addons },
    filters,
    result: {
      count: Object.keys(addons).length,
      results: Object.keys(addons),
    },
  }));

  return { store };
}

export function createFeaturedApiResult(results) {
  // Return a normalized result just like core.api.featured() does.
  return normalize({ results }, { results: [addonSchema] });
}
