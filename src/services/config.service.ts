import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      'User-Agent': 'STRATZ_API'
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      // No query selects an id on PlayerType, so it is never normalised. Merging
      // instead of replacing lets the stats pages, the profile and the match
      // history coexist under ROOT_QUERY.player without evicting each other.
      PlayerType: { keyFields: false, merge: true },
      // Same story for the constants root: heroes, items and abilities are
      // separate queries writing different fields under ROOT_QUERY.constants.
      ConstantQuery: { keyFields: false, merge: true },
    },
  }),
  // Cache-first everywhere: a profile, its match history and its stats are
  // fetched once per session and served from the cache on every later visit.
  // Reload the page to pull fresh data.
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  }
});
