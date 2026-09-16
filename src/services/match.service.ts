import { gql, useQuery } from '@apollo/client';
import { MatchDetailType } from '../lib/types';

const GET_MATCH = gql`
  query GetMatch($matchId: Long!) {
    match(id: $matchId) {
      id
      didRadiantWin
      durationSeconds
      startDateTime
      endDateTime
      firstBloodTime
      lobbyType
      gameMode
      rank
      bracket
      towerStatusRadiant
      towerStatusDire
      barracksStatusRadiant
      barracksStatusDire
      topLaneOutcome
      midLaneOutcome
      bottomLaneOutcome
      radiantKills
      direKills
      radiantNetworthLeads
      radiantExperienceLeads
      players {
        steamAccountId
        steamAccount {
          name
        }
        isRadiant
        isVictory
        heroId
        playerSlot
        partyId
        kills
        deaths
        assists
        numLastHits
        numDenies
        goldPerMinute
        experiencePerMinute
        networth
        gold
        goldSpent
        heroDamage
        towerDamage
        heroHealing
        level
        lane
        role
        position
        item0Id
        item1Id
        item2Id
        item3Id
        item4Id
        item5Id
        backpack0Id
        backpack1Id
        backpack2Id
        abilities {
          abilityId
          time
          level
          isTalent
        }
        stats {
          actionsPerMinute
          campStack
          wards {
            time
            type
          }
          itemPurchases {
            time
            itemId
          }
          heroDamageReport {
            dealtTotal {
              physicalDamage
              magicalDamage
              pureDamage
            }
            receivedTotal {
              physicalDamage
              magicalDamage
              pureDamage
            }
          }
        }
      }
    }
  }
`;

/**
 * One match in full. A match id is a Long, so anything that is not a positive
 * whole number is a bad URL rather than a query worth sending.
 */
export const useGetMatch = (matchId?: string) => {
  const id = Number(matchId);
  const isValidId = Number.isInteger(id) && id > 0;

  const res = useQuery(GET_MATCH, {
    variables: { matchId: id },
    skip: !isValidId,
  });

  return {
    ...res,
    data: res.data?.match as MatchDetailType | undefined,
    isValidId,
  };
}
