import { gql, useQuery } from '@apollo/client';

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
