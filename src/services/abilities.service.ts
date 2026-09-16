import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AbilityConstantType } from '../lib/types';
import { RootState } from '../store';
import { setAbilities } from '../store/reducer/abilities';

const GET_ABILITIES = gql`
  query GetAbilities {
    constants {
      abilities {
        id
        isTalent
        name
        language {
          displayName
        }
      }
    }
  }
`;

export const useGetAbilities = (skip = false) => {
  const res = useQuery(GET_ABILITIES, { skip });

  return { ...res, data: res.data?.constants.abilities };
}

/**
 * Abilities from the Redux store, populating them once if empty. Mirrors
 * useHeroesCatalog: the fetch is skipped while the store already holds them.
 */
export const useAbilitiesCatalog = (): AbilityConstantType[] => {
  const abilities = useSelector((state: RootState) => state.abilities.value);
  const dispatch = useDispatch();
  const { data } = useGetAbilities(abilities.length > 0);

  useEffect(() => {
    if (data && abilities.length === 0) {
      dispatch(setAbilities(Object.values(data)));
    }
  }, [data, abilities.length, dispatch]);

  return abilities;
}
