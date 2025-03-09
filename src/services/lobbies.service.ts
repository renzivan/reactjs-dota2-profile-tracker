import { gql, useQuery } from '@apollo/client';
// import { http } from "./config.service"

const GET_LOBBIES = gql`
  query GetLobbies {
    constants {
      lobbyTypes {
        id
        name
      }
    }
  }
`;

export const useGetLobbies = () => {
  const res = useQuery(GET_LOBBIES);
  
  return { ...res, data: res.data?.constants.lobbies };
}
