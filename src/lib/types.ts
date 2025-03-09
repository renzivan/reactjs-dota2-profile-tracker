export type AbilityType = {
  abilityId: number
  id: number
  name?: string
  isTalent?: boolean
  language?: {
    displayName: string
  }
}

export type PlayerType = {
  id: number
  steamAccount: {
    avatar: string
    profileUri: string
    name: string
    seasonRank: number
    seasonLeaderboardRank: number
  }
}

export type MatchPlayerType = {
  isRadiant: boolean
  heroId: number
  lane: number
  role: number
  position: number
  item0Id: number
  item1Id: number
  item2Id: number
  item3Id: number
  item4Id: number
  item5Id: number
  level: number
  isVictory: boolean
  kills: number
  deaths: number
  assists: number
  abilities: AbilityType[]
}

export type MatchType = {
  id: number
  lobbyType: number
  gameMode: number
  players: MatchPlayerType[]
  rank: number
  bracket: number
  durationSeconds: number
  endDateTime: number
  abilities: {
    id: number
    language: {
      displayName: string
      name: string
    }
  }
}

export type TalentType = {
  abilityId: number,
  slot: number
}

export type HeroType = {
  id: number,
  talents: TalentType[],
  shortName: string,
  displayName: string
}

export type HeroNameType = {
  displayName: string
  shortName: string
}
