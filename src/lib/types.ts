export type AbilityType = {
  abilityId: number
  id: number
  name?: string
  isTalent?: boolean
  language?: {
    displayName: string
  }
}

/** An item as the constants catalog returns it. */
export type ItemType = {
  id: number
  shortName: string
  displayName: string
}

/** An ability as the constants catalog returns it. */
export type AbilityConstantType = {
  id: number
  name: string
  isTalent: boolean
  language: {
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
  lane: string
  role: string
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
  /** A LobbyTypeEnum value, e.g. "RANKED" — not the numeric constant id. */
  lobbyType: string
  gameMode: string
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

export type MatchAbilityEventType = {
  abilityId: number
  /** Seconds relative to the horn, so pre-game picks are negative. */
  time: number
  /** Rank of the ability after this point, 0-indexed. */
  level: number
  isTalent: boolean
}

export type MatchItemPurchaseType = {
  time: number
  itemId: number
}

export type MatchWardEventType = {
  time: number
  /** 0 is an observer, 1 a sentry. */
  type: number
}

export type MatchDamageTotalsType = {
  physicalDamage: number | null
  magicalDamage: number | null
  pureDamage: number | null
}

/** Only present once Stratz has parsed the replay — null on a fresh match. */
export type MatchPlayerStatsType = {
  itemPurchases: MatchItemPurchaseType[] | null
  wards: MatchWardEventType[] | null
  /** A running total of camps stacked, so only the last entry is the count. */
  campStack: number[] | null
  actionsPerMinute: number[] | null
  heroDamageReport: {
    dealtTotal: MatchDamageTotalsType | null
    receivedTotal: MatchDamageTotalsType | null
  } | null
}

export type MatchDetailPlayerType = {
  steamAccountId: number | null
  steamAccount: {
    name: string | null
    isAnonymous: boolean | null
    seasonRank: number | null
  } | null
  isRadiant: boolean
  isVictory: boolean
  heroId: number
  playerSlot: number
  partyId: number | null
  kills: number
  deaths: number
  assists: number
  numLastHits: number
  numDenies: number
  goldPerMinute: number
  experiencePerMinute: number
  networth: number
  gold: number
  goldSpent: number
  heroDamage: number
  towerDamage: number
  heroHealing: number
  level: number
  lane: string
  role: string
  position: string
  /** Stratz's impact score for the game, relative to the bracket. Can be negative. */
  imp: number | null
  award: string
  isRandom: boolean
  leaverStatus: string
  item0Id: number | null
  item1Id: number | null
  item2Id: number | null
  item3Id: number | null
  item4Id: number | null
  item5Id: number | null
  backpack0Id: number | null
  backpack1Id: number | null
  backpack2Id: number | null
  abilities: MatchAbilityEventType[] | null
  stats: MatchPlayerStatsType | null
}

export type MatchDetailType = {
  id: number
  didRadiantWin: boolean
  durationSeconds: number
  startDateTime: number
  endDateTime: number
  firstBloodTime: number | null
  lobbyType: string
  gameMode: string
  rank: number | null
  bracket: number | null
  towerStatusRadiant: number | null
  towerStatusDire: number | null
  barracksStatusRadiant: number | null
  barracksStatusDire: number | null
  topLaneOutcome: string | null
  midLaneOutcome: string | null
  bottomLaneOutcome: string | null
  /** Kills per minute, one entry per game minute. */
  radiantKills: number[] | null
  direKills: number[] | null
  /** Radiant's lead per minute — negative means Dire is ahead. */
  radiantNetworthLeads: number[] | null
  radiantExperienceLeads: number[] | null
  players: MatchDetailPlayerType[]
}
