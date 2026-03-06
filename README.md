# Mixtape 🎶

A single-page web app that blends the top tracks of up to 3 artists into one shuffled Spotify playlist. Artist discovery is powered by Last.fm; playback and playlist saving use the Spotify Web API.

**Live app → [manuelmatheu.github.io/mixtape](https://manuelmatheu.github.io/mixtape/)**

---

## How it works

1. Search for up to 3 artists (results merged from Spotify + Last.fm)
2. Choose a track mode: **Top Hits**, **Deep Cuts**, or **Mix**
3. Set how many tracks per artist (1–10)
4. Hit **Generate Mixtape** — Last.fm fetches the tracks, Spotify matches them
5. Save the result as a Spotify playlist or add it directly to your queue

### Track modes

| Mode | Source |
|------|--------|
| Top Hits | Last.fm ranks 1–10 by scrobble count |
| Deep Cuts | Last.fm ranks 11–50 by scrobble count |
| Mix | Half top hits, half deep cuts |

---

## Stack

- **Vanilla HTML/JS** — no framework, no build step
- **Spotify Web API** — PKCE OAuth, playlist creation, queue management
- **Last.fm API** — artist search, top track data
- **GitHub Pages** — static hosting

---

## Setup

### 1. Spotify app

- Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
- Create an app (or reuse an existing one)
- Add your GitHub Pages URL as a Redirect URI: `https://YOURUSERNAME.github.io/mixtape/`
- Copy the Client ID

### 2. Configuration

Open `index.html` and update the two constants near the top of the `<script>` block:

```js
const SPOTIFY_CLIENT_ID = 'your_spotify_client_id';
const LASTFM_API_KEY    = 'your_lastfm_api_key';
```

Get a free Last.fm API key at [last.fm/api](https://www.last.fm/api/account/create).

### 3. Deploy

Push `index.html` to a GitHub repo with Pages enabled (Settings → Pages → Deploy from `main` branch root).

---

## Notes

- Requires a **Spotify Premium** account for queue management
- Deep Cuts quality depends on how well-scrobbled an artist is on Last.fm — niche artists may have sparse data beyond rank 10
- Spotify matching can occasionally miss tracks with non-standard characters or alternate titles; unmatched tracks are skipped with a warning shown in the UI

---

## Changelog

See the in-app changelog (footer → version link) or [CHANGELOG](#changelog) below.

### v0.2
- Switched to Last.fm for artist track discovery
- Deep Cuts defined as Last.fm ranks 11–50 by scrobble count
- Dual artist search: Spotify + Last.fm results merged and deduplicated
- Optional Last.fm play count display per track
- Source badges in autocomplete dropdown (Spotify / Last.fm)
- Spotify track matching with exact artist name preference
- Unmatched track warning shown in results

### v0.1
- Initial build
- Spotify PKCE OAuth
- 3 artist slots with live search autocomplete
- Top Hits / Deep Cuts / Mix track modes
- Shuffled playlist generation
- Save to Spotify playlist + Add to Queue
- Configurable tracks per artist (1–10)

---

Built with [Claude](https://claude.ai) by Anthropic
