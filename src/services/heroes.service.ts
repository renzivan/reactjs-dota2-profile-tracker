import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeroType } from '../lib/types';
import { RootState } from '../store';
import { setHeroes } from '../store/reducer/heroes';

const GET_HEROES = gql`
  query GetHeroes {
    constants {
      heroes {
        id
        displayName
        shortName
        talents {
          abilityId
          slot
        }
      }
    }
  }
`;

export const useGetHeroes = (skip = false) => {
  const res = useQuery(GET_HEROES, { skip });

  return { ...res, data: res.data?.constants.heroes };
}

/**
 * Heroes from the Redux store, populating them once if empty. The fetch is
 * skipped while the store already holds them, so a remount does not
 * re-download the constants under the client's network-only default.
 * The Matches component does the same inline; this is the reusable form.
 */
export const useHeroesCatalog = (): HeroType[] => {
  const heroes = useSelector((state: RootState) => state.heroes.value);
  const dispatch = useDispatch();
  const { data } = useGetHeroes(heroes.length > 0);

  useEffect(() => {
    if (data && heroes.length === 0) {
      dispatch(setHeroes(Object.values(data)));
    }
  }, [data, heroes.length, dispatch]);

  return heroes;
}
