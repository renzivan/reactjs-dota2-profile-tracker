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

export const useGetHeroes = () => {
  const res = useQuery(GET_HEROES);

  return { ...res, data: res.data?.constants.heroes };
}

/**
 * Heroes from the Redux store, fetching and populating them once if empty.
 * The Matches component does the same inline; this is the reusable form.
 */
export const useHeroesCatalog = (): HeroType[] => {
  const heroes = useSelector((state: RootState) => state.heroes.value);
  const dispatch = useDispatch();
  const { data } = useGetHeroes();

  useEffect(() => {
    if (data && heroes.length === 0) {
      dispatch(setHeroes(Object.values(data)));
    }
  }, [data, heroes.length, dispatch]);

  return heroes;
}
