import { gql, useQuery } from '@apollo/client';

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

export const useGetAbilities = () => {
  const res = useQuery(GET_ABILITIES);
  
  return { ...res, data: res.data?.constants.abilities };
}
