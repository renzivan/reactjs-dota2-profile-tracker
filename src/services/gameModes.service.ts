import { gql, useQuery } from '@apollo/client';

const GET_GAME_MODES = gql`
  query GetGameModes {
    constants {
      gameModes {
        id
        name
      }
    }
  }
`;

export const useGetGameModes = () => {
  const res = useQuery(GET_GAME_MODES);
  
  return { ...res, data: res.data?.constants.gameModes };
}
