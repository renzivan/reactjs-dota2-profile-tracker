import { gql, useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { mergePages, summarize } from '../lib/stats/aggregate'
import type { StatsData, StatsPage, StatsWindow } from '../lib/stats/types'

export const RANKED_LOBBY_TYPE = 7
/** Stratz caps `take` at 100 and it bounds matches aggregated, not rows returned. */
export const PAGE_SIZE = 100
/** Bounds a filter change to 15 requests, or 1,500 matches. */
export const MAX_PAGES = 15

// Every alias shares the same request except `groupBy`. `playerList: SINGLE`
// is required. The union members carry matchCount and winCount each.
// The literal 7 (RANKED) and 100 (PAGE_SIZE) are written out because gql
// tagged templates only accept fragments or strings as interpolations.
const GET_PLAYER_STATS_PAGE = gql`
  query GetPlayerStatsPage($playerId: Long!, $start: Long!, $end: Long!, $skip: Int!) {
    player(steamAccountId: $playerId) {
      faction: matchesGroupBy(request: { playerList: SINGLE, groupBy: FACTION, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByFactionType { isRadiant matchCount winCount avgKDA }
      }
      lane: matchesGroupBy(request: { playerList: SINGLE, groupBy: LANE, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByLaneType { lane matchCount winCount }
      }
      position: matchesGroupBy(request: { playerList: SINGLE, groupBy: POSITION, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByPositionType { position matchCount winCount }
      }
      hero: matchesGroupBy(request: { playerList: SINGLE, groupBy: HERO, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByHeroType { heroId matchCount winCount avgKDA avgImp }
      }
      day: matchesGroupBy(request: { playerList: SINGLE, groupBy: DATE_DAY, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByDateDayType { dateDay matchCount winCount }
      }
      party: matchesGroupBy(request: { playerList: SINGLE, groupBy: IS_PARTY, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByIsPartyType { isParty matchCount winCount }
      }
      duration: matchesGroupBy(request: { playerList: SINGLE, groupBy: DURATION_MINUTES, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByDurationMinutesType { durationMinutes matchCount winCount }
      }
      hour: matchesGroupBy(request: { playerList: SINGLE, groupBy: HOUR, lobbyTypeIds: [7], startDateTime: $start, endDateTime: $end, take: 100, skip: $skip }) {
        ... on MatchGroupByHourType { hour matchCount winCount }
      }
    }
  }
`

type RawPage = { [K in keyof StatsPage]: StatsPage[K] | null } | null

/** Stratz returns null instead of [] for a grouping with no matches. */
function normalisePage(raw: RawPage): StatsPage {
  return {
    faction: raw?.faction ?? [],
    lane: raw?.lane ?? [],
    position: raw?.position ?? [],
    hero: raw?.hero ?? [],
    day: raw?.day ?? [],
    party: raw?.party ?? [],
    duration: raw?.duration ?? [],
    hour: raw?.hour ?? [],
  }
}

const matchesIn = (page: StatsPage) => page.faction.reduce((n, r) => n + r.matchCount, 0)

export type StatsStatus = 'loading' | 'ready' | 'empty' | 'error'

type State = {
  status: StatsStatus
  data: StatsData | null
  pagesLoaded: number
  matchesCovered: number
}

const initial: State = { status: 'loading', data: null, pagesLoaded: 0, matchesCovered: 0 }

/**
 * Pages `matchesGroupBy` until a page covers fewer than PAGE_SIZE matches or
 * MAX_PAGES is reached, then merges. Each page is cache-first so a window
 * already seen this session resolves without a request. A window change
 * while paging discards the older loop's results via the `cancelled` flag.
 */
export function usePlayerStats(playerId: number, window: StatsWindow) {
  const client = useApolloClient()
  const [state, setState] = useState<State>(initial)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setState(initial)

    const run = async () => {
      const pages: StatsPage[] = []
      let covered = 0
      let capped = false

      for (let i = 0; i < MAX_PAGES; i++) {
        const result = await client.query<{ player: RawPage }>({
          query: GET_PLAYER_STATS_PAGE,
          variables: { playerId, start: window.start, end: window.end, skip: i * PAGE_SIZE },
          fetchPolicy: 'cache-first',
        })
        if (cancelled) return

        const page = normalisePage(result.data?.player ?? null)
        pages.push(page)
        covered += matchesIn(page)
        setState((s) => ({ ...s, pagesLoaded: pages.length, matchesCovered: covered }))

        if (matchesIn(page) < PAGE_SIZE) break
        if (i === MAX_PAGES - 1) capped = true
      }

      const merged = mergePages(pages)
      const data: StatsData = { ...merged, matchesCovered: covered, pages: pages.length, capped }
      setState({
        status: summarize(data.faction).games === 0 ? 'empty' : 'ready',
        data,
        pagesLoaded: pages.length,
        matchesCovered: covered,
      })
    }

    run().catch(() => {
      // Covers GraphQL errors, the plain-text 403 the token-IP guard returns,
      // and empty bodies from rate limiting. All are retryable.
      if (!cancelled) setState((s) => ({ ...s, status: 'error' }))
    })

    return () => {
      cancelled = true
    }
  }, [client, playerId, window.start, window.end, attempt])

  return { ...state, retry }
}
