import { gql, useQuery } from '@apollo/client';

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

export const useGetItems = () => {
  const res = useQuery(GET_ITEMS);
  
  return { ...res, data: res.data?.constants.items };
}
