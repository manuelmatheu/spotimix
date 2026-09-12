---
name: SpotiMix
description: A letterpress mixtape for blending artists, genres and moods into Spotify playlists.
colors:
  cream-stock: "#F5F0E8"
  ink: "#1A1208"
  rust: "#C84B1F"
  rust-press: "#B0421A"
  gold: "#D4A843"
  sage: "#5A7A5C"
  tape-label: "#E8DFC8"
  surface-paper: "#FFFFFF"
  error-wash: "#FFF0EC"
  spotify-green: "#1DB954"
  ink-ground-dark: "#141010"
  parchment-dark: "#E8E0D4"
  surface-dark: "#1E1A16"
  input-dark: "#252018"
  rust-dark: "#E0663A"
  gold-dark: "#E4B850"
  sage-dark: "#6E9470"
  error-wash-dark: "#2A1610"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(42px, 8vw, 72px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  marker:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "13px"
    fontWeight: 400
    fontStyle: "italic"
    lineHeight: 1
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-quiet:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
    fontWeight: 300
    lineHeight: 1.6
  label:
    fontFamily: "DM Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
  label-loud:
    fontFamily: "DM Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.12em"
  meta:
    fontFamily: "DM Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  full: "50%"
spacing:
  xs: "6px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  page: "52px"
components:
  button-primary:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream-stock}"
    typography: "{typography.label-loud}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.rust-press}"
  button-secondary:
    backgroundColor: "{colors.cream-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.label-loud}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.label-loud}"
    padding: "8px 12px"
  button-spotify:
    backgroundColor: "{colors.spotify-green}"
    textColor: "{colors.surface-paper}"
    typography: "{typography.label-loud}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  chip:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label-loud}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  chip-selected:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream-stock}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  artist-slot:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 14px 12px"
    height: "80px"
  panel-tape:
    backgroundColor: "{colors.tape-label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  track-item:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink}"
    padding: "10px 14px"
  text-input:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  segment-active:
    backgroundColor: "{colors.cream-stock}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "6px 12px"
  player-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream-stock}"
    padding: "10px 20px"
    height: "62px"
  badge-top:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.cream-stock}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
  badge-deep:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.surface-paper}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
  badge-discovery:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream-stock}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
---

# Design System: SpotiMix

## 1. Overview

**Creative North Star: "The Letterpress Mixtape"**

Every surface in SpotiMix is a printed object. Cards sit on cream stock with ink pressed into them: shadows have a blur radius of zero, offset three pixels down and right, the exact signature of a plate struck into paper. Hover lifts an element one pixel toward the light and grows the shadow to match; pressing it returns it flat. Nothing glows, nothing floats, nothing frosts. A fixed scanline overlay at 1.8% opacity sits above the whole page, the faint texture of a photocopied sleeve.

The type carries the rest. Playfair Display holds the masthead and the section titles, and its italic is reserved for a handwritten layer: the numbers beside each artist slot, the progress percentage, the initials in an empty avatar. DM Mono in wide uppercase tracking handles every small label, the way a printed sleeve captions its panels. DM Sans carries prose at a light weight. Three typefaces, three jobs, no overlap.

The system is compact and single-column, 780px at most, and it rejects the generic SaaS dashboard outright: no gradient hero metric, no identical icon-plus-heading-plus-text card grid, no purple-to-blue gradients, no glassmorphic floating panels. Density comes from small type on tight rows, not from cards inside cards. When a mix is generated the inputs collapse to zero height and the result takes the page.

**Key Characteristics:**

- Hard offset shadows (`3px 3px 0`), never blurred
- Cream and ink, both tinted warm, never neutral grey
- Rust as the single voice of state: live, selected, loved
- Playfair for structure, Playfair italic for the handwritten layer, DM Mono for every label, DM Sans for prose
- 4px radius throughout, near-square, the corner of a card stock
- One 580px breakpoint, single-column at rest
- A scanline texture over the entire page

## 2. Colors: The Letterpress Palette

Warm throughout. Every neutral is tinted toward the ink hue, so the system never reads as grey. Both themes are first-class and neither is the default.

### Primary

- **Rust** (`#C84B1F` light, `#E0663A` dark): the single accent, and the only color permitted to claim a whole surface. It fills a selected genre chip, the primary button, the progress fill in the player bar, the now-playing track name and its row wash (`rgba(200,75,31,0.07)`), a liked heart, the italic logo fragment, and emphasis inside liner-notes prose. Its pressed state is **Rust Press** (`#B0421A`), used only on primary button hover.

### Secondary

- **Faded Gold** (`#D4A843` light, `#E4B850` dark): progress and provenance. The generation progress bar with its italic percentage, and the "top" track badge. Gold means work in flight or a popularity claim, never interaction.

### Tertiary

- **Dusty Sage** (`#5A7A5C` light, `#6E9470` dark): the counterweight to gold. Used only on the "deep" track badge, marking a catalog pull rather than a hit. A third color that earns its place by classifying exactly one thing.

### Neutral

- **Cream Stock** (`#F5F0E8`): the light ground. Warm paper, never white.
- **Ink** (`#1A1208`): the light-theme foreground, a warm near-black brown. Also the fill of the player bar and the toast, which invert the page.
- **Surface Paper** (`#FFFFFF`): card and chip faces in light theme only, one step brighter than the ground so cards read as stock laid on stock.
- **Tape Label** (`#E8DFC8`): the recessed panel tone. Option rows, the liner-notes header, and row hover. Darker than the ground, so panels sink rather than lift.
- **Ink Ground** (`#141010`) and **Parchment** (`#E8E0D4`): the dark theme ground and foreground. **Surface Dark** (`#1E1A16`) serves as both card face and tape panel, collapsing the light theme two-tone layering into one.
- **Error Wash** (`#FFF0EC` light, `#2A1610` dark): the only tinted status background, paired with a rust border and rust text.
- **Spotify Green** (`#1DB954`): borrowed, not owned. See the rule below.

### Named Rules

**The One Voice Rule.** Rust is the only accent that signals state. If a new element needs to say live, selected, or loved, it says it in rust. Gold and sage classify content and must never become interactive colors.

**The Borrowed Green Rule.** Spotify Green appears in exactly two places: the connect button and the 7px live-session dot. It is Spotify's color, not SpotiMix's. Introducing it anywhere else makes the app look like a Spotify clone, which is the one identity confusion this palette exists to prevent.

**The Warm Neutral Rule.** No pure grey, ever. Borders are ink at 12% and 6% alpha (`rgba(26,18,8,0.12)` and `rgba(26,18,8,0.06)`), never a grey hex. A neutral that does not carry the ink hue is a bug.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif) at 700, plus 400 italic
**Body Font:** DM Sans (sans-serif) at 300, 400, 500
**Label/Mono Font:** DM Mono (monospace) at 400, 500

**Character:** A high-contrast transitional serif against a neutral geometric sans and a monospace: the pairing of a record sleeve, with an engraved title, plain liner text, and typewritten credits. The serif never appears small, the mono never appears large, and the sans never appears uppercase.

### Hierarchy

- **Display** (Playfair 700, `clamp(42px, 8vw, 72px)`, line-height 0.95, tracking -0.02em): the masthead only. One per page.
- **Headline** (Playfair 700, 26px, tracking -0.02em): the results title, the one heading inside the mix itself.
- **Title** (Playfair 700, 22px): modal titles.
- **Marker** (Playfair 400 italic, 10px to 22px): the handwritten layer. Slot numbers bleeding over the top border of an artist card, the gold progress percentage, initials in an empty avatar. Never body copy, never a label.
- **Body** (DM Sans 400, 14px, line-height 1.7): liner-notes prose and input text. Set at 300 weight and 13px for quieter supporting copy, between 0.55 and 0.8 opacity. Cap the measure at 65 to 75ch; the 780px column already holds this.
- **Label** (DM Mono 500, 9px to 10px, tracking 0.14em to 0.20em, uppercase): section labels, field labels, option groups. Always at reduced opacity, 0.4 to 0.5.
- **Label Loud** (DM Mono 500, 11px, tracking 0.12em, uppercase): buttons.
- **Meta** (DM Mono 400, 10px to 11px, sentence case): track artist lines, durations, timestamps, artist subtitles. Mono for data, at 0.35 to 0.45 opacity.

### Named Rules

**The Mono Label Rule.** Every uppercase label in the system is DM Mono with at least 0.08em tracking. DM Sans is never uppercased and never tracked out. A new label that is uppercase and sans is wrong.

**The Italic Marker Rule.** Playfair italic marks human annotation, never structure and never prose. It appears where a person would have written on the object by hand.

**The Opacity Ladder Rule.** Hierarchy below body size is carried by opacity, not by color: 1.0 for primary text, 0.7 for supporting, 0.55 for tagline and status, 0.4 to 0.5 for labels, 0.25 to 0.35 for row numbers and durations. Do not introduce a new grey to make text quieter; lower the opacity of the foreground.

## 4. Elevation

The system is letterpress, not material. Elevation is a hard ink offset with **zero blur**, so a lifted element reads as a plate struck into paper rather than an object casting light. Depth runs in two directions: cards lift off the ground with an offset shadow and a full-opacity foreground border, while panels sink into it by taking the darker Tape Label background with a hairline 6% border and no shadow at all. In dark theme the offset becomes `rgba(0,0,0,0.5)` and reads as depth rather than ink.

### Shadow Vocabulary

- **Rest** (`box-shadow: 3px 3px 0 var(--card-shadow)`): a filled artist slot, any primary or secondary button, a saved combo at rest. The default struck state.
- **Lift** (`box-shadow: 4px 4px 0 var(--card-shadow)` with `transform: translate(-1px,-1px)`): hover. The element moves toward the light and the shadow grows by the same pixel it moved.
- **Press** (`box-shadow: none` with `transform: translateY(0)` or `translateY(1px)`): active. Flat against the page.
- **Small Lift** (`box-shadow: 2px 2px 0 var(--card-shadow)`): chips, mood cards, combo cards, and every lifted surface at mobile width, where 3px is too loud.
- **Dialog** (`box-shadow: 6px 6px 0 var(--card-shadow)` with a 2px foreground border): modals only. The heaviest strike in the system.
- **Seated Tab** (`box-shadow: 0 1px 3px var(--shadow)`): the one soft shadow, on the active segment of a toggle. It reads as a key seated in a slot.
- **Player Lift** (`box-shadow: 0 -2px 12px rgba(0,0,0,0.25)`): the fixed player bar, throwing shadow upward onto the page it overlays.

### Named Rules

**The No-Blur Rule.** Elevation shadows have a blur radius of zero. The two soft shadows in the system, Seated Tab and Player Lift, are the complete documented set of exceptions. A new blurred shadow is prohibited.

**The Press Rule.** Every interactive surface completes the cycle: rest at 3px, lift to 4px and move `-1px,-1px` on hover, flatten to no shadow on active. Hover without the matching press is an incomplete component.

**The Sink Rule.** Grouping containers (option rows, tag controls, liner-notes headers) sink: Tape Label background, 1px 6%-alpha border, no shadow. Only content surfaces lift. If everything lifts, nothing does.

## 5. Components

### Buttons

- **Shape:** near-square, 4px radius, 12px by 20px padding. DM Mono 500 at 11px, uppercase, 0.12em tracking.
- **Primary:** rust fill, cream text, Rest shadow. Hover moves to Rust Press with Lift.
- **Secondary:** ground-colored fill with a 1.5px full-opacity foreground border and Rest shadow. Hover takes Lift with no color change, so the border alone carries the identity.
- **Ghost:** transparent, no shadow, 0.45 opacity rising to 0.9 on hover, tighter 8px by 12px padding. For retreating actions such as "New Mix".
- **Spotify:** borrowed green with white text, Rest shadow. Only for connecting the account.
- **Active and disabled:** every button presses to `translateY(1px)`. Disabled drops to 0.35 opacity and forcibly clears transform and shadow.
- **Contextual promotion:** in hero mode the Save button is promoted from secondary to primary styling in place, rather than the layout reshuffling to give it prominence.

### Chips

- **Style:** Surface Paper face, 1.5px 12%-alpha border, 4px radius, DM Mono at 10px to 11px with 0.04em tracking. Genre chips take 8px by 14px, suggestion chips a tighter 5px by 10px.
- **State:** hover borders in the foreground color and takes Small Lift. Selected inverts completely to a rust fill with cream text and a rust border. There is no intermediate selected state.
- **Suggestion variant:** an artist suggestion pre-borders and pre-colors itself rust to read as recommended, then fills rust on hover. A tag suggestion stays neutral until hovered. The resting color states what kind of thing the chip will insert.
- **Context tag:** the smallest chip, 9px uppercase mono on an 8%-alpha wash at 2px radius, 0.6 opacity. Clickable ones fill rust on hover; static ones do not move.

### Cards / Containers

- **Corner Style:** 4px, uniformly. The only 50% radii in the system are avatars and the live dot.
- **Background:** Surface Paper for content that lifts, Tape Label for containers that sink.
- **Shadow Strategy:** see Elevation. Content lifts at Rest and Lift; containers never carry a shadow.
- **Border:** 1.5px at 12% alpha at rest. A card that is filled or focused promotes its border to full-opacity foreground, which is a stronger signal than any shadow change.
- **Internal Padding:** 16px by 14px for artist slots, 16px by 18px for sunken panels, 10px by 14px for list rows, 28px for modals.

### Inputs / Fields

- **Search field:** chromeless. No border, no background, transparent, sitting inside the artist slot so the card is the input. Placeholder at 0.3 opacity in DM Sans 300.
- **Text input:** 1.5px 12%-alpha border on `--input-bg`, 4px radius, 10px by 12px padding. Focus promotes the border to full-opacity foreground with no ring and no glow.
- **Stepper:** an 8%-alpha track at 3px radius holding two 28px square buttons around a 28px mono value. Hover lightens only the button cell.
- **Segment control:** an 8%-alpha track at 3px radius with 2px inset padding. Inactive segments are transparent at 0.45 opacity; the active segment takes the page ground with the Seated Tab shadow. In dark theme it inverts to a foreground fill with ground-colored text.
- **Autocomplete dropdown:** offset 6px below the field, full-opacity foreground border, `4px 4px 0` shadow, rows divided by 6%-alpha hairlines, with hover and keyboard-active rows both washing to Tape Label.

### Navigation

There is no persistent nav. Two peer entry tabs ("Search artists", "Browse genres") sit in a segment control at the top of the app, styled exactly as the option segment controls because they are the same kind of choice. The masthead doubles as the way back out of a generated mix. On mobile the tabs tighten to 9px type and 6px by 10px padding but keep the same structure.

### Player Bar (signature component)

A fixed full-bleed bar that inverts the page: Ink background, cream foreground, Player Lift shadow thrown upward. It is the only inverted surface besides the toast, and the inversion is what makes it read as hardware below the page rather than a card on it. 42px album art at 3px radius, name in DM Sans 500 at 13px over artist in DM Mono at 11px and 0.6 opacity, transport controls at 0.7 opacity rising to 1, and a 4px progress track that grows to 6px on hover with a rust fill. Mobile wraps the progress track to its own full-width row via `order: 10` and drops the volume control entirely. The body takes 72px of bottom padding while the bar is visible, and the toast lifts from 28px to 84px to clear it.

### Track List (signature component)

A single bordered block with 6%-alpha hairline dividers and no per-row cards. Each row is a fixed 22px number column, a 36px album thumbnail at 2px radius, a name over a mono artist line, an optional provenance badge (gold "top", sage "deep", ink "discovery"), a duration, and a heart. Two behaviors carry the whole interaction model: the row number cross-fades to a play icon on hover inside the same 22px box, so the row never reflows; and the now-playing row washes rust at 7% with its name in rust and its play icon permanently visible. The heart rests at 0.15 opacity, reaches 0.35 on row hover, and goes rust at 0.8 when liked.

## 6. Do's and Don'ts

### Do:

- **Do** use hard offset shadows with zero blur: `3px 3px 0` at rest, `4px 4px 0` with `translate(-1px,-1px)` on hover, nothing on active. Complete the whole cycle.
- **Do** keep rust as the only color that signals state. Live, selected, loved: all rust.
- **Do** sink grouping containers into Tape Label with a 1px 6%-alpha border and no shadow, and let only content surfaces lift.
- **Do** write every uppercase label in DM Mono with at least 0.08em tracking, at 0.4 to 0.5 opacity.
- **Do** reserve Playfair italic for the handwritten layer: slot numbers, the progress percentage, empty-avatar initials.
- **Do** quiet text by lowering foreground opacity down the established ladder, not by reaching for a new grey.
- **Do** promote a border to full-opacity foreground to signal filled, focused, or hovered. The border is the primary state channel; the shadow is secondary.
- **Do** drop to `2px 2px 0` shadows and tighter type at the 580px breakpoint, and keep the single-column layout.
- **Do** hold WCAG AA contrast in both themes, and add a `prefers-reduced-motion` guard for the staggered track cascade, the 400ms hero-mode collapse, and the spinner.
- **Do** pair color with a second signal for every meaningful state: the now-playing row gets an icon swap as well as a wash, a selected chip fully inverts, a liked heart fills.

### Don't:

- **Don't** build a **generic SaaS dashboard**. No gradient hero metric (big number, small label, supporting stats). No identical icon-plus-heading-plus-text card grids. No purple-to-blue gradients. No glassmorphic floating panels.
- **Don't** add a blurred elevation shadow. The two soft shadows that exist, the active segment tab and the player bar, are the complete set of exceptions.
- **Don't** introduce Spotify Green beyond the connect button and the live dot. Borrowed green spreading across the UI turns SpotiMix into a Spotify clone.
- **Don't** use a neutral grey anywhere. Tint every neutral toward the ink hue, and write borders as ink alpha.
- **Don't** extend `#FFFFFF` beyond the existing light-theme card and chip faces. New surfaces take Cream Stock or Tape Label.
- **Don't** make gold or sage interactive. They classify content, work in flight versus hit versus deep cut, and nothing else.
- **Don't** uppercase or track out DM Sans. Uppercase belongs to DM Mono.
- **Don't** set Playfair below 13px or above 26px outside the masthead, and never as body copy.
- **Don't** wrap list rows in individual cards, and never nest a card inside a card. The track list is one bordered block with hairline dividers.
- **Don't** add a second radius scale. 4px, with 2px and 3px for small inset chrome and 50% for avatars.
- **Don't** animate layout properties. The hero-mode collapse animates `max-height` and `opacity` deliberately and is the documented exception; new motion belongs on `transform` and `opacity`.
- **Don't** add a persistent sidebar or top nav. The system is one 780px column with two peer entry tabs.
- **Don't** raise the scanline overlay above 2% opacity or animate it. It is texture, not an effect.
