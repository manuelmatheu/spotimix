# Product

## Register

product

## Users

People who already know what they like and want a playlist that reflects a specific blend of it. They have Spotify Premium, they can name three artists that go together, and they have an opinion about which era of an artist is the good one. Last.fm literacy is common but not required.

Context of use: a desktop browser, one focused session of two or three minutes. Pick artists or a mood, generate, then listen, with the tab left open. Mobile is a real but secondary surface (the Web Playback SDK does not run there, so mobile becomes a remote control for a Spotify session playing elsewhere).

Job to be done: turn an intuition ("Bowie plus Nick Cave", "late night, electronic") into a shuffled, listenable playlist without hand-curating it, and understand afterward why those tracks belong together.

## Product Purpose

SpotiMix blends tracks from artists, genres and moods into a shuffled Spotify playlist, then explains the blend. Last.fm supplies the musical intelligence (tags, similar artists, catalog depth, bios); Spotify supplies identity, current popularity, playback and persistence.

Success is a mix the user keeps: they hit save, or they let it play to the end. The liner notes are the second half of the product, not decoration. A mix that plays well but cannot be explained has only half shipped.

## Brand Personality

**Crafted, nostalgic, knowing.**

Crafted: every surface looks made rather than generated. Nostalgic: the mixtape is the governing object, with sides, liner notes and a hand-labelled feel. Knowing: the voice is a friend with deep shelves who does not show off, so the liner notes name the shared tag rather than praising the taste.

Voice: second person, declarative, dry. "The radio only you could build." Never enthusiastic on the user's behalf, never explains the obvious back to them.

## Anti-references

**Generic SaaS dashboard.** No gradient hero metric (big number, small label, supporting stats). No identical icon-plus-heading-plus-text card grids. No purple-to-blue gradients. No glassmorphic floating panels. SpotiMix is a printed object, not a control plane.

## Design Principles

1. **Tags are the connective tissue.** They are what makes "Bowie plus Nick Cave" make sense (art rock, post-punk) and what makes a suggested third artist feel inevitable rather than random. Surface them everywhere: suggestions, liner notes, the genre browser.
2. **Progressive disclosure, two front doors.** Artist search and genre browsing are peer entry points, not a primary and a fallback. Once a mix exists, the inputs collapse and the mix takes the screen.
3. **Explain the mix.** Any generated result carries its own reasoning. Generation without narrative is incomplete work.
4. **Last.fm is the brain, Spotify is the voice.** Discovery intelligence comes from community scrobble data, never from an AI model in the loop. Spotify handles identity, playback and persistence.
5. **Play everywhere.** The embedded player is the full experience; remote control of another device is a first-class fallback, not a degraded mode.

## Accessibility & Inclusion

Target: **WCAG 2.1 AA** for text and control contrast in both themes.

- Both themes are first-class. Neither is the default, and neither may fall below AA.
- **Reduced motion is a requirement, not a nicety.** There is currently no `prefers-reduced-motion` guard, and results animate in as a staggered per-row cascade. That gap is a known defect to close.
- Color is never the sole carrier of meaning: the now-playing row, selected chips and liked hearts each pair color with a second signal (icon swap, fill, background shift).
- The app is keyboard-driven by design (single-key shortcuts, arrow navigation in autocomplete, Escape closes everything). Keep every new control reachable and give it a visible focus state.
