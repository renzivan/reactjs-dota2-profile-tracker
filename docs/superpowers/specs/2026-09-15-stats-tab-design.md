# Stats tab design

Status: approved for planning.
Date: 2026-09-15.

## Goal

Add a Stats tab beside Overview on the profile page.
It shows how a player performs in ranked matches over a chosen window: overall summary, winrate by side, lane, role, party status, game length and hour of day, winrate over time, and a sortable hero table.
The default window is the last 30 days.
Presets go up to one year, and a custom range picker allows any window inside the last year.

## Non-goals

- Anything that needs per-match data, such as item or talent statistics.
  Those would require paging raw matches at 100 per request.
- Unranked, turbo, or event modes.
  Stats are ranked only, always.
- Comparing two players or two windows.
- Server-side code.
  The site stays a static single-page app talking to Stratz directly.

## Data source

Everything comes from one Stratz GraphQL field, `player.matchesGroupBy`, called once per aggregation page with aliased fields.
Every alias uses the same request except `groupBy`:

```graphql
request: {
  playerList: SINGLE
  lobbyTypeIds: [7]        # RANKED
  startDateTime: $start    # unix seconds
  endDateTime: $end        # unix seconds, end of the last day
  take: 100
  skip: $skip
  groupBy: <one of below>
}
```

| Alias      | groupBy            | Union member                    | Key field         | Extra fields     |
| ---------- | ------------------ | ------------------------------- | ----------------- | ---------------- |
| `faction`  | `FACTION`          | `MatchGroupByFactionType`       | `isRadiant`       | `avgKDA`         |
| `lane`     | `LANE`             | `MatchGroupByLaneType`          | `lane`            |                  |
| `position` | `POSITION`         | `MatchGroupByPositionType`      | `position`        |                  |
| `hero`     | `HERO`             | `MatchGroupByHeroType`          | `heroId`          | `avgKDA`, `avgImp` |
| `day`      | `DATE_DAY`         | `MatchGroupByDateDayType`       | `dateDay`         |                  |
| `party`    | `IS_PARTY`         | `MatchGroupByIsPartyType`       | `isParty`         |                  |
| `duration` | `DURATION_MINUTES` | `MatchGroupByDurationMinutesType` | `durationMinutes` |                |
| `hour`     | `HOUR`             | `MatchGroupByHourType`          | `hour`            |                  |

Every row carries `matchCount` and `winCount`.

### Verified API behaviour

These were confirmed against the live API during design and the implementation must not assume otherwise:

- `take` caps the number of matches aggregated, not the number of rows returned.
  A request with `take: 100` over a one-year window summed to exactly 100 matches.
- `skip` pages through the underlying matches.
  `skip: 100` returned the next 100 matches' aggregates.
- The maximum `take` is 100.
  Larger values return an error.
- `playerList: SINGLE` is required in the request.
- "Role" in Stratz's `ROLE` grouping is only Core versus Support.
  The five in-game positions come from the `POSITION` grouping, which is what the app calls roles.
- The token is bound to a client IP for a window of time.
  Bursts from a second IP return HTTP 403 with a plain-text body, and quick bursts can return empty bodies.
  Both must surface as a retryable error, never as a blank page.

### Paged aggregation

Because `take` limits matches, a window with more than 100 ranked matches needs several pages.
The loop is:

1. Fetch the page at `skip = 0`.
2. Sum `matchCount` across the `faction` rows.
   That sum is the number of matches this page covered.
3. If the sum is 100, fetch the next page at `skip + 100` and repeat.
4. Stop when a page covers fewer than 100 matches, or when 15 pages have been fetched.
5. Merge all pages.

Merging sums `matchCount` and `winCount` per key.
Averages (`avgKDA`, `avgImp`) merge as a weighted mean by `matchCount`.

The 15-page cap bounds a filter change to 15 requests, or 1,500 matches.
If the cap is hit, the summary strip shows "Based on the 1,500 most recent ranked matches in this window" so the numbers are never silently partial.

Each page is an Apollo `client.query` with `fetchPolicy: 'cache-first'`, so switching back to a range already loaded is instant.
The global default of `network-only` stays for everything else.
A request id guards against stale results: a range change while pages are loading discards the older loop's output.

## Window selection

### URL is the source of truth

The window lives in the query string of `/profile/:playerId/stats`.

| Form                          | Meaning                                    |
| ----------------------------- | ------------------------------------------ |
| no params                     | last 30 days                               |
| `?range=30d`                  | last 30 days                               |
| `?range=90d`                  | last 3 months                              |
| `?range=180d`                 | last 6 months                              |
| `?range=1y`                   | last year                                  |
| `?from=YYYY-MM-DD&to=YYYY-MM-DD` | custom, inclusive of both days          |

Parsing rules:

- `from` and `to` together take precedence over `range`.
- An unknown `range`, a missing partner for `from` or `to`, or an unparseable date falls back to 30 days.
- `from` is clamped to no earlier than one year before today.
- `to` is clamped to no later than today.
- If `from` is after `to` after clamping, they are swapped.
- Times are local: `start` is the start of the `from` day and `end` is the end of the `to` day, both as unix seconds.
- Presets snap to day boundaries too: `start` is the start of the day N days ago and `end` is the end of today.
  Both bounds are therefore stable within a calendar day, so the Apollo cache key does not change between toggles and switching back to a preset is instant.

Changing the window pushes a new history entry so the back button steps through windows.

### Filter bar

A single row above the stats:

- Left: a segmented control with 30D, 3M, 6M, 1Y and a Custom button.
  The active segment uses the gold active tab styling already used for Overview.
- Custom opens a Popover containing a range Calendar showing two months, with days outside the allowed year disabled.
  The popover has Cancel and Apply.
  Apply writes `from` and `to` to the URL and removes `range`.
  Picking a preset writes `range` and removes `from` and `to`.
- Right: the resolved window as text, for example "Aug 16 – Sep 15, 2026", and a small "Ranked only" badge.

On narrow screens the segments wrap and the text drops below them.

## Layout

Everything sits in the existing `container` under the profile header panel.
Section headers use the existing "// Match History" style with the gold rule.

```
[ filter bar                                                  ]
[ summary strip: Games · Wins · Losses · Win % · Avg KDA       ]
[ Side               ] [ Roles                                ]
[ Lanes              ] [ Party vs Solo                        ]
[ Winrate over time                                           ]
[ Game length        ] [ Hour of day                          ]
[ Heroes (table)                                              ]
```

Two columns from the `md` breakpoint up, one column below.
The hero table sits in its own `overflow-x-auto` container, as the match list does.

### Summary strip

Five cells in one `panel brackets`: Games, Wins, Losses, Win %, Avg KDA.
Games, wins and losses come from summing the `faction` rows.
Avg KDA is the `matchCount`-weighted mean of `faction.avgKDA`.
Win % is colour coded: radiant green at 55% or above, gold between 45% and 55%, dire red below 45%.
The same colour rule applies to every winrate on the page.

### Winrate bars

One shared component renders Side, Roles, Lanes, Party vs Solo, Game length and Hour of day.
Input is a list of rows with `label`, optional `icon`, `matches` and `wins`.

Each row shows: icon or label, a horizontal bar filled to the winrate and coloured by the winrate rule, the percentage, and the game count as "21 games".
Rows sort by games descending, except Game length and Hour of day which keep their natural order.
Rows with fewer than 5 games render at reduced opacity with a tooltip "Fewer than 5 games".
They are never hidden, because hiding them would make the totals stop adding up.

Row sources:

- Side: `faction`. Radiant and Dire, with the existing `cdn.stratz.com` square side icons.
- Roles: `position`. Position 1 to 5 mapped to the existing role SVGs: 1 safe lane, 2 mid, 3 offlane, 4 soft support, 5 hard support.
  Labels are Carry, Mid, Offlane, Soft Support, Hard Support.
- Lanes: `lane`. Safe, Mid, Off, Jungle, Roaming as returned, labels title-cased.
- Party vs Solo: `party`.
- Game length: `duration` bucketed into under 25, 25–34, 35–44, 45–59 and 60+ minutes.
- Hour of day: `hour` bucketed into six four-hour blocks, 00–03 through 20–23, shown in the viewer's local time.
  Stratz hours are assumed UTC.
  The implementation verifies this once by comparing one match's `endDateTime` against its `hour` bucket and adjusts if wrong.
  The shift is whole hours; half-hour zones round.

### Winrate over time

A column strip built from the `day` rows.
Granularity is daily when the window is 31 days or shorter and weekly otherwise, with weeks starting Monday in local time.
Every bucket in the window is drawn, including empty ones, so time is not compressed.

Each column's height is proportional to games in that bucket, stacked as wins in radiant green over losses in dire red.
Hovering shows a tooltip such as "Sep 12 · 3W 1L" or "Week of Sep 8 · 7W 5L".
Empty buckets draw a faint baseline tick.
Under the strip, first and last bucket labels and the overall span keep it readable.

### Hero table

Columns: Hero, Games, Wins, Win %, KDA, IMP.
The hero cell shows the icon and display name using the existing heroes store and the existing hero image fallback chain.
Every column header is a button that sorts; clicking the active column flips direction.
Default sort is Games descending, with Win % descending as the tiebreak.
The active header shows a direction glyph and sets `aria-sort`.

Best and worst heroes get a gold "Best" and a dire "Worst" tag on their row.
Eligible heroes have at least 5 games.
Best is the highest winrate, tie broken by more games.
Worst is the lowest winrate, tie broken by more games.
Tags only appear when at least two heroes are eligible and best is not worst.
Rows under 5 games render at reduced opacity, like the bars.

If more than 100 distinct heroes appear in a window, the table still shows them all because the hero rows are merged across pages.

## States

- Loading: the filter bar renders immediately; the summary and panels show Skeleton blocks in the same layout.
  While paging past the first page, a line under the filter bar reads "Aggregating 300 matches…" and updates per page.
- Empty: zero matches in the window shows one panel, "No ranked matches in this window", with a Try last year button that sets `range=1y`.
  A private profile lands here too; the profile page already handles a hidden profile above this tab.
- Error: any page failing shows one panel, "Stats unavailable", with a Retry button that reruns the loop for the same window.
  The plain-text 403 and empty bodies from Stratz surface here.
- Partial: the 1,500-match cap note described above.

## Routing

`/profile/:playerId` becomes a layout route.
The profile header and tab bar stay in `Profile`, which renders an `Outlet`.
Children:

- index: the existing `Matches` component.
- `stats`: the new `Stats` component.

The tab bar has two links, Overview and Stats.
Overview is active only on the exact profile path.
Stats is active on the stats path regardless of query string.
Each child reads `playerId` from `useParams` itself.

## Code structure

New pure modules, each unit tested:

- `src/lib/stats/range.ts`: parse and serialise the URL window, clamp, compute unix bounds, and pick the timeline granularity.
- `src/lib/stats/aggregate.ts`: merge pages, winrate, colour tier, duration and hour bucketing, weekly and daily bucketing, best and worst hero selection, weighted averages.
- `src/lib/stats/types.ts`: row and result types.
- `src/lib/stats/tiers.ts`: the winrate colour rule as class names, shared by every component that shows a winrate.

Data:

- `src/services/stats.service.ts`: the GraphQL document, `fetchStatsPage`, and `usePlayerStats(playerId, window)` which runs the page loop and returns `{ status, data, pagesLoaded, matchesCovered, retry }`, with `capped` carried inside `data`.

UI in `src/components/Stats/`:

- `index.tsx`: the route element.
  Owns the window from the URL, calls the hook, and lays out sections and states.
- `RangeFilter.tsx`, `SummaryStrip.tsx`, `WinrateBars.tsx`, `WinrateTimeline.tsx`, `HeroTable.tsx`, `StatPanel.tsx`.
  `StatPanel` is the section wrapper with the "// Title" header.

Primitives added under `src/components/ui/` following shadcn: `popover.tsx` and `calendar.tsx`.

Dependencies added: `react-day-picker`, `date-fns`, `@radix-ui/react-popover`.
Dev dependency added: `vitest`, with an `npm test` script.
There are no tests in the repo today, so this establishes the harness.

## Testing

Unit tests with Vitest for both pure modules, covering:

- Every URL form in the table above, the fallback cases, clamping, and the swap.
- Preset bounds and custom bounds in local time.
- Merging two pages with overlapping and disjoint keys, including weighted averages.
- Duration and hour bucketing, including the local-time shift across midnight.
- Daily versus weekly bucketing, empty buckets, and Monday week starts.
- Best and worst selection with ties, the 5-game threshold, and the two-eligible rule.

Manual end-to-end pass in the browser against the example player before merge:

- All four presets and a custom range load and show consistent totals.
- Back button steps through windows.
- Deep link with `?from&to` renders the same as choosing it in the picker.
- A window with more than 100 matches shows the aggregation progress and correct totals.
- Empty and error states render, error by temporarily using a bad token.
- Phone width: everything stacks, nothing overflows except the hero table inside its own scroll.

Lint stays at zero warnings and the build passes before merge.

## Open assumptions

- Stratz `hour` is UTC.
  Verified once during implementation as described above.
- Hero icons for the table use the same URL pattern and fallback as the match history hero component.
- Stratz `DATE_DAY` is UTC-based, so the timeline attributes a late-night local game to its UTC date while the hour chart shows it in local time.
  The two panels can therefore disagree about which day a game near midnight belongs to.
  This is accepted because per-match data is a non-goal.
