import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ItemType } from '../lib/types';
import { RootState } from '../store';
import { setItems } from '../store/reducer/items';

const GET_ITEMS = gql`
  query GetItems {
    constants {
      items {
        id
        displayName
        shortName
      }
    }
  }
`;

export const useGetItems = (skip = false) => {
  const res = useQuery(GET_ITEMS, { skip });

  return { ...res, data: res.data?.constants.items };
}

/**
 * Items from the Redux store, populating them once if empty. Mirrors
 * useHeroesCatalog: the fetch is skipped while the store already holds them.
 */
export const useItemsCatalog = (): ItemType[] => {
  const items = useSelector((state: RootState) => state.items.value);
  const dispatch = useDispatch();
  const { data } = useGetItems(items.length > 0);

  useEffect(() => {
    if (data && items.length === 0) {
      dispatch(setItems(Object.values(data)));
    }
  }, [data, items.length, dispatch]);

  return items;
}
