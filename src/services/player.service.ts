import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

const GET_PLAYER = gql`
  query GetPlayer($playerId: Long!) {
    player(steamAccountId: $playerId) {
      steamAccount {
        id
        profileUri
        avatar
        name
        seasonRank
        seasonLeaderboardRank
      }
    }
  }
`;

const GET_PLAYER_MATCHES = gql`
  query GetPlayerMatches($playerId: Long!, $skip: Int!, $take: Int!) {
    player(steamAccountId: $playerId) {
      matches(request: { skip: $skip, take: $take }) {
        id
        lobbyType
        gameMode
        players(steamAccountId: $playerId) {
          abilities {
            abilityId
            isTalent
            abilityType {
              name
              language {
                displayName
              }
            }
          }
          heroId
          isRadiant
          lane
          role
          level
          isVictory
          kills
          deaths
          assists
          item0Id
          item1Id
          item2Id
          item3Id
          item4Id
          item5Id
        }
        rank
        bracket
        durationSeconds
        endDateTime
      }
    }
  }
`;

export const useGetPlayer = (playerId: number) => {
  const res = useQuery(GET_PLAYER, {
    variables: { playerId: Number(playerId) }
  });

  return {...res, data: res.data?.player};
}

export const useGetMatches = (playerId: string) => {
  const [isNothingMore, setIsNothingMore] = useState(false);

  const res = useQuery(GET_PLAYER_MATCHES, {
    variables: { 
      playerId: Number(playerId),
      skip: 0,
      take: 10
    },
    notifyOnNetworkStatusChange: true
  });

  const loadMore = () => {
    if (res.loading || isNothingMore) return;

    res.fetchMore({
      variables: {
        playerId: Number(playerId),
        skip: res.data?.player.matches.length || 0,
        take: 10
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        
        const newMatches = fetchMoreResult.player.matches;
        const existingMatches = prev.player.matches;

        // If we get no new matches, mark that we've reached the end
        if (newMatches.length === 0) {
          setIsNothingMore(true);
          return prev;
        }

        const mergedMatches = [
          ...existingMatches,
          ...newMatches.filter(
            (match) => !existingMatches.some((m) => m.id === match.id)
          ),
        ];

        return {
          player: {
            ...prev.player,
            matches: mergedMatches,
          },
        };
      },
    });
  };
  
  return { 
    ...res, 
    data: res.data?.player?.matches,
    loadMore,
    isNothingMore 
  };
}
