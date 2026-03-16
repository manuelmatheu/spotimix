# SpotiMix — Roadmap

A phased plan for evolving SpotiMix from a playlist generator into a standalone music discovery app.

---

## Phase 1: Genre Tag Browser ✅ **SHIPPED**

- "Browse genres" toggle as alternative entry point
- Multi-genre selection (up to 3 tags)
- Last.fm tag discovery → Spotify artist lookup
- Clickable context tags in "About this mix" panel

---

## Phase 2: Smart Suggest (Tag-Based 3rd Artist) ✅ **SHIPPED**

- "Suggest from:" bar appears when 1–2 artists selected with empty slots
- Fetches and ranks tags from selected artists (shared tags first)
- Click a tag → Last.fm top artists → Spotify lookup → fills next empty slot
- Filters out already-selected artists
- Refreshes suggestions as artists are added/removed

---

## Phase 3: Mood Presets ✅ **SHIPPED**

- 10 curated mood cards: Melancholy, Late Night, Sunday Morning, Raw Energy, Dreamy, Soul Kitchen, Deep Focus, Midnight Jazz, Headbanger, Tropicália
- Each mood maps to 2–3 Last.fm tags + auto-sets track mode
- One click: sets mode → selects tags → finds artists → fills slots

---

## Phase 4: Tag Mix / Genre Radio ✅ **SHIPPED**

- Tag Mix: parallel mix creation flow independent from Artist Mix
- Tracks fetched directly from `tag.getTopTracks` per selected tag
- Mood presets generate Tag Mix directly (no artist slot step)
- Tracks-per-tag slider (1–10)
- "Find artists instead" option preserved for artist-based flow
- Tag-specific liner notes with dedicated template pool

---

## Phase 5: Embedded Player ✅ **SHIPPED**

- Spotify Web Playback SDK creates a Connect device in the browser
- Audio streams directly in-tab (no external Spotify app needed on desktop)
- Player bar: album art, track/artist, prev/play-pause/next, seekable progress, volume
- SDK `player_state_changed` events replace polling (real-time updates)
- Automatic remote-control fallback for mobile/unsupported browsers
- Progress bar animated smoothly via `requestAnimationFrame`
- `streaming` scope added to OAuth

---

## Phase 6: Cloud-Synced Combos (Supabase) ← **UP NEXT**

**Goal:** Saved artist combos persist across devices and sessions, tied to the user's Spotify account.

**Approach:** Supabase JS client called directly from the browser — no backend needed.

- Use the Spotify `user_id` (already available from `/me`) as the row identifier
- Supabase JS client (`@supabase/supabase-js`) loaded from CDN, initialized with project URL + anon key
- Combos stored as a JSON column in a single `user_combos` table
- On login: fetch combos from Supabase, merge with any localStorage combos, deduplicate
- On save/delete combo: update both localStorage (instant) and Supabase (async)
- localStorage remains the primary read source for speed; Supabase is the sync layer

**Table schema (draft):**

```
user_combos
├── spotify_id  TEXT PRIMARY KEY  — from /me endpoint
├── combos      JSONB            — [{artists: [{name, image, sub}, ...]}, ...]
├── updated_at  TIMESTAMPTZ      — auto-updated
```

**Row Level Security:**
- Users can only read/write their own row (`spotify_id = auth.uid()` or match against a custom claim)
- Since we're using Spotify ID (not Supabase Auth), RLS can use a simpler policy: allow all operations where `spotify_id` matches the value passed in the request, validated client-side
- Alternatively: use Supabase anon key with a service-role insert policy, since the data is non-sensitive (just artist names)

**Sync logic:**
1. On app init (after Spotify login): `SELECT combos FROM user_combos WHERE spotify_id = ?`
2. Merge remote combos with local (deduplicate by artist-name set)
3. On combo save/delete: update localStorage immediately, then `UPSERT` to Supabase
4. Conflict resolution: last-write-wins (simple, combos are low-conflict)

**Migration from localStorage:**
- First login after this feature ships: local combos are pushed to Supabase
- After sync, both sources stay in agreement
- If Supabase is unreachable, app works normally with localStorage only

**Cost:** Supabase free tier (500MB database, 50K monthly active users) — more than enough

---

## Design Principles

- **Tags as the connective tissue** — they're what makes "David Bowie + Nick Cave" make sense (shared: art rock, post-punk) and what makes the suggestion of a 3rd artist feel natural
- **Progressive disclosure** — the genre browser is an entry point, not a replacement. Artist search stays for users who know what they want
- **Last.fm is the brain** — all tag intelligence comes from community-driven Last.fm data, no AI API needed
- **Each phase builds on the last** — tag fetching, artist-from-tag logic, and UI patterns are reused across phases
- **Play everywhere** — embedded player for the full experience, remote control as a reliable fallback

---

*Built with [Claude](https://claude.ai) by Anthropic*
