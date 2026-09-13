# CLAUDE.md — SpotiMix Development Guide

## What is SpotiMix?

SpotiMix is a single-page web app that generates Spotify playlists by blending tracks from artists, genres, and moods. It uses Last.fm for music discovery (tags, similar artists, track data) and the Spotify Web API + Web Playback SDK for authentication, search, playback, and playlist management. There is no backend — everything runs client-side, deployed as static files on Vercel.

**Live:** https://spotimix-app.vercel.app/
**Repo:** https://github.com/manuelmatheu/spotimix (renamed to lowercase; the old `SpotiMix` URL still redirects)

---

## Commands

**No build, no bundler, no test suite.** Edit a file, reload the browser.

- **Syntax check — do this before every commit:** `node --check js/ui.js` (run on each changed JS file)
- **Local dev:** serve statically, e.g. `python -m http.server 8000`, then open `http://localhost:8000`. Opening `index.html` over `file://` breaks PKCE auth, since `REDIRECT_URI = window.location.origin + window.location.pathname`. Any local port must also be registered as a Redirect URI in the Spotify Developer Dashboard.
- **Deploy:** push to `main` → Vercel auto-deploys. No build step.

---

## Architecture

### File structure

```
SpotiMix/
├── index.html        — HTML structure, player bar, modals (changelog, save, shortcuts)
├── CLAUDE.md         — This file
├── README.md         — User-facing docs
├── ROADMAP.md        — Feature roadmap with shipped/planned phases
├── docs/
│   └── superpowers/  — dated design docs: plans/ and specs/ (cloud-synced-combos, share-mix)
├── css/
│   └── style.css     — All styles: dark/light theme via CSS vars, player bar, responsive
└── js/
    ├── config.js     — API keys, OAuth scopes, all global state variables
    ├── spotify.js    — PKCE OAuth, token refresh, Spotify API helpers, SDK init, remote controls
    ├── lastfm.js     — All Last.fm API calls: tracks, tags, similar artists, bios, matching
    ├── supabase.js   — Supabase client init, cloud combo sync (fetch, upsert, merge)
    ├── player.js     — SDK event handling, polling fallback, player bar UI, playback controls, liked songs
    └── ui.js         — The big one: search, slots, combos, genres, moods, suggest, generate, results, narrative
```

### Script load order (matters — no modules)

```html
<script src="https://sdk.scdn.co/spotify-player.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="js/config.js"></script>     <!-- globals first -->
<script src="js/spotify.js"></script>    <!-- auth + API helpers -->
<script src="js/lastfm.js"></script>    <!-- Last.fm API -->
<script src="js/supabase.js"></script>  <!-- cloud sync -->
<script src="js/player.js"></script>    <!-- playback + player bar -->
<script src="js/ui.js"></script>        <!-- everything else + init() -->
```

All functions and variables are global. No modules, no build step, no bundler.

`index.html` reaches ~22 distinct global functions through inline `onclick` attributes, so **renaming a global function means grepping `index.html` too**. That coupling is why the all-globals rule can't be relaxed one file at a time.

### View state machine (ui.js:359–404)

One page, three visual states, all driven by CSS classes:

- `setEntry('search' | 'browse')` — switches the entry tabs (`#entry-search` / `#entry-browse`); calls `exitHeroMode()` first
- `enterHeroMode()` — adds `.mix-active` to `#app-section`, results take over the viewport. Called at the end of both generate flows
- `exitHeroMode()` — removes `.mix-active`, back to the picker. Wired to the logo
- `toggleMixView()` — the one button in `.results-actions` flips between the two: `#mix-view-toggle` reads
  "← New Mix" in hero mode and "↑ Back to mix" once the picker is open, so an existing mix can be
  re-collapsed instead of being stranded below the picker. `enterHeroMode()` / `exitHeroMode()` each call
  `setMixViewLabel()`, which is why `setEntry()` and the logo stay correct without knowing about the toggle.
  The button shows whenever `#results-section` has `.visible`; it no longer hides itself outside hero mode
- `body.has-player` — added on first playback, reserves bottom padding for the player bar

### Theme system

CSS variables in `:root` (light) and `[data-theme="dark"]` (dark). Theme toggle stored in `localStorage('mixtape_theme')`. The toggle script runs inline before other JS to prevent flash.

Key semantic vars: `--bg`, `--fg`, `--surface`, `--border`, `--border-s`, `--tape-bg`, `--rust`, `--gold`, `--sage`, `--card-shadow`, `--input-bg`, `--num-bg`, `--error-bg`.

---

## Two independent mix flows

### Artist Mix (Search artists tab)
1. User searches Spotify for up to 3 artists → fills `artists[0..2]`
2. Smart Suggest shows similar artists + genre tags to auto-fill remaining slots
3. User picks track mode: `top`, `deep`, `mix`, `discovery`
4. `generate()` → source per mode (see Track sourcing below) → `matchToSpotify()` for Last.fm-sourced tracks only → `interleaveShuffle()` → `renderResults()` → `enterHeroMode()` → `autoPlay()`

### Tag Mix (Browse genres tab)
1. User clicks mood preset or selects 1–3 genre tags
2. `generateTagMix()` → `getTopTracksForTag()` per tag → `matchToSpotify()` → `interleaveShuffle()` → `renderResults()` → `autoPlay()`
3. Never touches `artists[]` — completely independent

Both flows share: `matchToSpotify()`, `interleaveShuffle()`, `renderResults()`, `playFromTrack()`, `autoPlay()`, `reshuffle()`, save playlist, add to queue, liked songs. All of these read `generatedTracks`, so they are flow-agnostic by construction.

### Track sourcing (hybrid — shipped, ROADMAP Phase 9)

`generate()` picks its source per mode. Last.fm stays the *discovery* brain (tags, similar artists, bios); Spotify supplies *current* popularity.

| Mode (`trackMode`) | Source |
|---|---|
| `top` | `getSpotifyTopTracks()` only — tracks already carry URIs, so `matchToSpotify()` is skipped |
| `deep` | Last.fm `getTracksForArtist(a, 'deep')` (ranks 11–50) → `matchToSpotify()` |
| `mix` | `ceil(n/2)` Spotify top + `floor(n/2)` Last.fm deep cuts, fetched in one `Promise.all` |
| `discovery` | Main artists' Spotify top tracks + 2 each from `getSimilarArtists()`, all via Spotify |

`getSpotifyTopTracks(artistName)` (spotify.js:93) uses `GET /search?type=track&q=artist:{name}&limit=10` and prefers exact artist-name matches. It deliberately does **not** use `GET /artists/{id}/top-tracks` — that endpoint was removed in the February 2026 API update (see commits a57c202, dd8219e). Its output shape matches `matchToSpotify()`, so the two paths merge freely.

Artist objects are `{ name, image, sub, spotifyId }` — `selectArtist()` stores the Spotify artist ID straight from the search result. (The `config.js:29` comment listing only `{name, image, sub}` is stale.)

---

## Spotify integration

### OAuth (PKCE, no backend)
- `startAuth()` → redirects to Spotify with code challenge
- `exchangeCode(code)` → exchanges for access + refresh tokens
- Tokens stored in `localStorage` (`spotify_token`, `spotify_refresh`)
- `refreshAccessToken()` → uses refresh token to get new access token silently
- `spGet(path)`, `spPut(path, body)`, `spDelete(path, body)` → retry once with a token refresh on 401, then `logout()`. **`spPost()` does not** — see gotchas

### Scopes
```
user-read-private, user-read-email,
user-modify-playback-state, user-read-playback-state, user-read-currently-playing,
playlist-modify-public, playlist-modify-private,
streaming, user-library-modify, user-library-read
```
**Any scope change requires users to disconnect and reconnect Spotify.**

### Web Playback SDK
- Loaded from `https://sdk.scdn.co/spotify-player.js`
- `initSDKPlayer()` creates a Spotify Connect device named "SpotiMix"
- `onSpotifyWebPlaybackSDKReady` callback initializes after SDK loads
- `player_state_changed` events drive real-time player bar updates + track highlighting
- `getOAuthToken` callback provides current `accessToken`; on `authentication_error`, refreshes token and reconnects
- `spotifyPlay(uris)` prefers SDK device when `sdkReady`, falls back to remote control

### Playback device targeting
- Always transfer playback to target device before sending play command
- SDK device: transfer → 300ms delay → play with `device_id`
- Remote: find active device → transfer if needed → play with `device_id`
- URIs capped at 100 per play call (Spotify API limit)

### Liked Songs — use `/me/library`, NOT `/me/tracks`

`/me/tracks` and `/me/tracks/contains` were **removed** in the February 2026 Spotify API update. The replacement takes track **URIs as query params**, not IDs in a JSON body. Do not reintroduce the old endpoints.

- `checkLikedTracks(trackIds)` (spotify.js:166) — `GET /me/library/contains?uris=…` in **chunks of 40** URI-encoded `spotify:track:{id}` values; returns a `Set` of liked IDs. Failed chunks warn and are skipped
- `toggleLikeTrack(trackId, currentlyLiked)` (spotify.js:179) — `PUT /me/library?uris={uri}` to like, `DELETE /me/library?uris={uri}` to unlike; returns the new liked state
- UI handlers live elsewhere: `handleTrackHeart(event, i)` (ui.js:907) for track rows, `playerLike()` (player.js:265) for the player bar. Both flip `likedSet` optimistically and roll back on failure
- `triggerHeartPop(btn)` (player.js:85) — scale pulse via the Web Animations API (`btn.animate`), no CSS keyframe involved
- Heart icons on track rows (`heart-{i}`) and player bar (`pb-heart`); `likedSet` (Set of track IDs) holds client-side state
- `updatePlayerBarHeart()` called on track change via `highlightNowPlaying()`

---

## Last.fm integration

### API key (read-only, no user auth)
- Key: `177b9e8ee70fe2325bfff606cfdaee23`
- All calls go through `lfm(params)` helper which adds key + format

### Endpoints used
| Function | Endpoint | Purpose |
|----------|----------|---------|
| `getTracksForArtist()` | `artist.getTopTracks` | Artist Mix track sourcing |
| `getSimilarArtists()` | `artist.getSimilar` | Discovery mode + Smart Suggest |
| `getTopTags()` | `tag.getTopTags` | Genre browser (cached) |
| `getTopArtistsForTag()` | `tag.getTopArtists` | Genre → artist resolution |
| `getTopTracksForTag()` | `tag.getTopTracks` | Tag Mix track sourcing |
| `getArtistTags()` | `artist.getTopTags` | Smart Suggest + liner notes |
| `getArtistInfo()` | `artist.getInfo` | Bio snippets for liner notes |
| `matchToSpotify()` | (uses Spotify search) | Matches Last.fm tracks to Spotify URIs |

### matchToSpotify() pattern
- Searches Spotify with `track:{name} artist:{artist}` query
- Prefers exact artist name match, falls back to first result
- Returns `{ uri, name, artist, duration, albumArt, _type, _playcount }`
- Returns `null` if no match (track skipped)

---

## Key UI components

### Player bar (`#player-bar`)
- Fixed bottom position, hidden until first playback
- Shows: album art, track name/artist, heart, prev/play-pause/next, progress bar, volume
- Populated by SDK `player_state_changed` events OR `pollNowPlaying()` (remote fallback)
- Progress animated via `requestAnimationFrame` between state updates
- `body.has-player` class adds bottom padding

### Smart Suggest (`#suggest-bar`)
- Appears when 1–2 artists selected with empty slots
- Fetches similar artists + genre tags in parallel
- Similar artists shown as rust-colored `.artist-suggest` chips (one-click fill)
- Genre tags shown as default chips (tag → artist → Spotify lookup)
- `suggestAbort` counter prevents stale results
- Refreshes on every artist add/remove

### Liner notes (`#mix-context`)
- Collapsible "About this mix" panel
- Artist Mix: `generateContext()` → `buildNarrative()` — template pool with ~150+ combinations
- Tag Mix: `generateTagContext()` → `buildTagNarrative()` — separate template pool
- Genre tags shown as clickable chips (click → opens genre browser with that tag)
- Templates randomized at 3 layers: opening (artist/tag connection), mode color, closing

### Saved combos
- `savedCombos` array in `localStorage('mixtape_combos')` — shape `[{ artists: [{ name, image, sub, spotifyId }, …] }]`
- Compact cards with overlapping avatars below artist grid
- Deduplicated by artist names (order-independent)
- `loadCombo(idx)` fills artist slots + triggers suggest update
- Past `COMBOS_PREVIEW` (4) the list collapses to the 4 newest plus a `+N more` chip; `toggleCombos()` flips it
  and remembers the choice in `localStorage('mixtape_combos_expanded')`. `renderCombos()` maps over the **whole**
  array before slicing, so the `ci` baked into `loadCombo(ci)` / `removeCombo(ci)` stays the real `savedCombos`
  index — slicing first would silently rewire clicks in the hidden tail

---

## Important patterns and gotchas

### Spotify API quirks
- Use `/v1/me/playlists` (not `/v1/users/{id}/playlists`) to avoid 403 in Development Mode
- `PUT /me/player/play` with `uris` array — pass all URIs directly, don't queue separately
- `transferPlayback()` with ~300-800ms delay before retrying play on idle devices
- Refresh tokens: Spotify may return a new refresh token — always store it
- SDK `getOAuthToken` is called periodically — must provide current token, not stale one
- **`spPost()` has no 401-refresh retry** (spotify.js:114) — it throws on a stale token while `spGet`/`spPut`/`spDelete` would have recovered, so `savePlaylist()` and `addToQueue()` can fail right after expiry

### Escaping for inline handlers — two functions, not one

Because markup is built as template strings with inline `onclick` attributes, values cross **two** parsers. Use the right helper or clicks die silently:

- `esc(s)` — HTML-escapes `& < > " '`. For text content and double-quoted attribute values.
- `escJsAttr(s)` — for a value landing inside a **JS string literal in an attribute**, i.e. `onclick="f('HERE')"`. Escapes for JS first (`\\`, `\'`), then calls `esc()`.

`esc()` alone is **not** enough there: the HTML parser decodes `&#39;` back to a bare `'` *before* the JS is compiled, so `Guns N' Roses` terminates the string and the handler throws a SyntaxError with no visible error. Five call sites depend on `escJsAttr`: `suggestArtistByName`, `suggestFromTag`, `toggleGenre`, and `browseFromTag` (×2). Don't collapse the two helpers.

### interleaveShuffle()
- Groups tracks by artist, shuffles within groups
- Round-robin picks with randomized group order each round
- Final pass swaps any remaining adjacent same-artist pairs
- Used for both Artist Mix and Tag Mix generation + reshuffle

### State scoping
- `artists[]` — only touched by Artist Mix flow, never by Tag Mix
- `generatedTracks` — shared output, overwritten by whichever flow runs
- `selectedGenres` (Set) — cleared after Tag Mix generation to prevent stale state
- `sessionQueue` (Set) — URIs sent to Spotify, used by polling to detect drift
- `sdkReady` / `sdkDeviceId` — SDK availability, checked before every play command
- `currentMixLabel` — set by both flows (`A × B × C` or `tag, tag`), used to auto-name saved playlists
- `init()` (ui.js:1294) **duplicates its entire post-login path** across two branches (direct auth, then token-refresh retry). Any new login step must be added in **both** — this already bit `mergeAndSync`

### GitHub push protection
- GitHub secret scanning auto-revokes API keys pushed to the repo
- Never hardcode Spotify/Anthropic/OpenAI keys in source
- Current keys (Spotify Client ID, Last.fm API key) are non-secret (client-side app)
- Sensitive keys should use sessionStorage or environment variables

### Deployment
- **Vercel** (production): auto-deploys from `main` branch
- **GitHub Pages** (legacy): gone. Both `manuelmatheu.github.io/SpotiMix/` and the lowercase path return 404 (checked 2026-09-12), so Vercel is the only live deployment
- `REDIRECT_URI = window.location.origin + window.location.pathname` — adapts to any domain
- Must add each deployment URL as redirect URI in Spotify Developer Dashboard
- Hard refresh (Cmd+Shift+R) needed on mobile to see changes after deploy

### Git workflow
- Single `main` branch, direct pushes
- Commit as the repo's configured git user (currently `Manuel`) — do not override `user.name` / `user.email`
- Remote is plain HTTPS (`https://github.com/manuelmatheu/spotimix.git`) and auth comes from the local git credential helper — no PAT embedded in the URL any more
- Always `node --check <file>.js` on every changed JS file before committing

### CSS conventions
- All colors via CSS variables (never hardcode hex in rules)
- Dark mode: `[data-theme="dark"]` selector overrides
- Mobile: single `@media (max-width: 580px)` breakpoint
- `overflow-x: hidden` on both `html` and `body` (mobile Safari fix)
- Animations: `fadeIn` keyframe with staggered `animation-delay` for lists

---

## Current version: v1.9

### What's shipped
1. ✅ Genre Tag Browser — browse genres, multi-select, Spotify artist lookup
2. ✅ Smart Suggest — similar artists + genre tags auto-fill empty slots
3. ✅ Mood Presets — 10 one-click mood cards (Melancholy, Late Night, etc.)
4. ✅ Tag Mix — parallel genre-based mix flow, direct from tags
5. ✅ Embedded Player — Spotify Web Playback SDK with remote fallback
6. ✅ Liked Songs — heart/like on player bar + track rows
7. ✅ Cloud-Synced Combos — Supabase sync, merge+dedup, offline-resilient
8. ✅ Hybrid Track Sourcing — Top Hits/Mix/Discovery use Spotify search (current popularity); Deep Cuts unchanged
9. ✅ Collapsed Combos + Mix View Toggle — combos list collapses past `COMBOS_PREVIEW`; "← New Mix" doubles as "↑ Back to mix"

### What's next

`ROADMAP.md` is the single source of truth for phase status. Current state of the open phases:

- **Phase 7 (UX):** heart animation is **already shipped** (`triggerHeartPop`). Genuinely open: genre-grid loading skeleton, now-playing browser-tab title (nothing writes `document.title` yet), and Tag Mix reshuffle — note `reshuffle()` is already flow-agnostic, so verify before building
- **Phase 8 (Share Mix via URL):** design already written — see `docs/superpowers/specs/2026-03-21-share-mix-design.md` and the matching plan in `docs/superpowers/plans/`

### Known issues / areas for improvement
- SDK playback: some tracks may skip or mute if token refresh timing is off — monitor `authentication_error` events
- Mobile: SDK not supported on all mobile browsers — remote fallback handles this but player bar updates are less smooth (5s polling)
- Liner notes: template pool is good but not AI-quality — Anthropic/OpenAI API integration was explored and deferred (see conversation history)
- `artists[]` is fixed at 3 slots — could be made dynamic
- No scrobbling to Last.fm (would require Last.fm user auth, separate OAuth flow)

---

## Quick reference: key functions

| Function | File | Purpose |
|----------|------|---------|
| `generate()` | ui.js | Artist Mix generation |
| `generateTagMix()` | ui.js | Tag Mix generation |
| `matchToSpotify(lfmTrack)` | lastfm.js | Last.fm → Spotify track matching |
| `interleaveShuffle(tracks)` | ui.js | Artist-separated shuffle |
| `playFromTrack(i, silent)` | player.js | Start playback from track index |
| `spotifyPlay(uris)` | spotify.js | Play URIs (SDK or remote) |
| `initSDKPlayer()` | spotify.js | Initialize Web Playback SDK |
| `pollNowPlaying()` | player.js | Remote fallback: poll current track |
| `onSDKStateChange(state)` | player.js | SDK: handle state changes |
| `updateSuggest()` | ui.js | Refresh Smart Suggest chips |
| `applyMood(idx)` | ui.js | Apply mood preset → Tag Mix |
| `applyGenres()` | ui.js | Genre tags → find artists → fill slots |
| `buildNarrative()` | ui.js | Artist Mix liner notes (template pool) |
| `buildTagNarrative()` | ui.js | Tag Mix liner notes (template pool) |
| `checkLikedTracks(trackIds)` | spotify.js | Batch liked-status check → `Set` of IDs |
| `toggleLikeTrack(trackId, currentlyLiked)` | spotify.js | Like/unlike one track → new state |
| `handleTrackHeart(event, i)` | ui.js | Track-row heart click handler |
| `playerLike()` | player.js | Player-bar heart click handler |
| `getSpotifyTopTracks(artistName)` | spotify.js | Spotify-popularity track source |
| `getDiscoveryTracks(similarNames)` | lastfm.js | Similar-artist track pull (Discovery) |
| `savePlaylist()` | spotify.js | Save to Spotify playlist (auto-named from `currentMixLabel`) |
| `refreshAccessToken()` | spotify.js | Silent token refresh |
| `setEntry(mode)` / `enterHeroMode()` / `exitHeroMode()` / `toggleMixView()` | ui.js | View state machine |
| `toggleCombos()` | ui.js | Expand/collapse the saved-combos list |

---

## Session history

Phase status lives in `ROADMAP.md` — do not duplicate it here. Written designs for planned work live in `docs/superpowers/specs/` with matching execution plans in `docs/superpowers/plans/`.

What past sessions changed, kept here only where it explains a non-obvious decision in the code:

- **SDK token expiry** — proactive refresh + retransfer on reconnect (`sdkNeedsRetransfer`), because the SDK silently mutes rather than erroring when its token goes stale
- **Liked songs** — migrated off the removed `/me/tracks` endpoints to `/me/library` with URI query params (Feb 2026 API)
- **Cloud-synced combos** — `syncInProgress` / `pendingSync` guards exist because `persistCombos()` can fire while `mergeAndSync()` is mid-flight; malformed cloud rows are filtered on read
- **Hybrid track sourcing** — two follow-up fixes after the initial build: `/artists/{id}/top-tracks` was gone (switched to `/search`), and Discovery mode had dropped the main artists' own tracks

---

*This file is for Claude Code / AI-assisted development. Keep it updated when making architectural changes.*
