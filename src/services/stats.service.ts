import { gql, useApolloClient } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { matchesInPage, mergePages, shouldStopPaging, summarize } from '../lib/stats/aggregate'
import type { StatsData, StatsPage, StatsWindow } from '../lib/stats/types'

export const RANKED_LOBBY_TYPE = 7
/** Stratz caps `take` at 100 and it bounds matches aggregated, not rows returned. */
export const PAGE_SIZE = 100
/** Bounds a filter change to 15 requests, or 1,500 matches. */
export const MAX_PAGES = 15

// Every alias shares the same request except `groupBy`. `playerList: SINGLE`
// is required. The union members carry matchCount and winCount each.
// `take` and `lobbyTypeIds` come through GraphQL variables so PAGE_SIZE and
// RANKED_LOBBY_TYPE are the single source of truth for both the request the
// server applies and the skip arithmetic and stop rule below.
const GET_PLAYER_STATS_PAGE = gql`
  query GetPlayerStatsPage($playerId: Long!, $start: Long!, $end: Long!, $skip: Int!, $take: Int!, $lobbyTypeIds: [Byte!]!) {
    player(steamAccountId: $playerId) {
      faction: matchesGroupBy(request: { playerList: SINGLE, groupBy: FACTION, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByFactionType { isRadiant matchCount winCount avgKDA }
      }
      lane: matchesGroupBy(request: { playerList: SINGLE, groupBy: LANE, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByLaneType { lane matchCount winCount }
      }
      position: matchesGroupBy(request: { playerList: SINGLE, groupBy: POSITION, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByPositionType { position matchCount winCount }
      }
      hero: matchesGroupBy(request: { playerList: SINGLE, groupBy: HERO, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByHeroType { heroId matchCount winCount avgKDA avgImp }
      }
      day: matchesGroupBy(request: { playerList: SINGLE, groupBy: DATE_DAY, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByDateDayType { dateDay matchCount winCount }
      }
      party: matchesGroupBy(request: { playerList: SINGLE, groupBy: IS_PARTY, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByIsPartyType { isParty matchCount winCount }
      }
      duration: matchesGroupBy(request: { playerList: SINGLE, groupBy: DURATION_MINUTES, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
        ... on MatchGroupByDurationMinutesType { durationMinutes matchCount winCount }
      }
      hour: matchesGroupBy(request: { playerList: SINGLE, groupBy: HOUR, lobbyTypeIds: $lobbyTypeIds, startDateTime: $start, endDateTime: $end, take: $take, skip: $skip }) {
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
          variables: {
            playerId,
            start: window.start,
            end: window.end,
            skip: i * PAGE_SIZE,
            take: PAGE_SIZE,
            lobbyTypeIds: [RANKED_LOBBY_TYPE],
          },
          fetchPolicy: 'cache-first',
        })
        if (cancelled) return

        const page = normalisePage(result.data?.player ?? null)
        pages.push(page)
        const pageCovered = matchesInPage(page)
        covered += pageCovered
        setState((s) => ({ ...s, pagesLoaded: pages.length, matchesCovered: covered }))

        if (shouldStopPaging(pageCovered, i, PAGE_SIZE, MAX_PAGES)) {
          capped = pageCovered >= PAGE_SIZE && i === MAX_PAGES - 1
          break
        }
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

    run().catch((err: unknown) => {
      // Covers GraphQL errors, the plain-text 403 the token-IP guard returns,
      // and empty bodies from rate limiting. All are retryable.
      console.error('stats page fetch failed', err)
      if (!cancelled) setState((s) => ({ ...s, status: 'error' }))
    })

    return () => {
      cancelled = true
    }
  }, [client, playerId, window.start, window.end, attempt])

  return { ...state, retry }
}
