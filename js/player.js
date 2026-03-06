// ── Now-playing poll ──────────────────────────────────────────────────────────
const POLL_INTERVAL = 2000;

// sessionQueue: Set of all URIs we queued — used to detect if Spotify wandered
// uriToIndices: map of uri → [index, ...] (supports duplicate tracks)
let sessionQueue  = new Set();
let sessionPaused = false;

function registerUri(uri, index) {
  if (!uriToIndices[uri]) uriToIndices[uri] = [];
  if (!uriToIndices[uri].includes(index)) uriToIndices[uri].push(index);
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(pollNowPlaying, POLL_INTERVAL);
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  nowPlayingIndex = -1;
}

async function pollNowPlaying() {
  try {
    const r = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: 'Bearer ' + accessToken },
    });
    if (r.status === 204 || !r.ok) return;
    const data = await r.json();
    if (!data?.item) return;
    const uri = data.item.uri;

    // If Spotify is playing something outside our session, clear highlight
    if (sessionQueue.size > 0 && !sessionQueue.has(uri)) {
      if (!sessionPaused) {
        sessionPaused = true;
        highlightNowPlaying(-1);
      }
      return;
    }
    sessionPaused = false;

    // Find which track index matches — prefer index >= current to handle
    // duplicates correctly when advancing forward through the list
    const candidates = uriToIndices[uri];
    if (!candidates) return;
    let best = candidates[0];
    for (const idx of candidates) {
      if (idx >= nowPlayingIndex) { best = idx; break; }
    }
    highlightNowPlaying(best);

  } catch { /* ignore transient errors */ }
}

function highlightNowPlaying(index) {
  // Always update — don't bail on same index, DOM may need re-applying after reshuffle
  document.querySelectorAll('.track-item.now-playing').forEach(r => r.classList.remove('now-playing'));
  if (index >= 0) {
    const row = document.getElementById('track-' + index);
    if (row) {
      row.classList.add('now-playing');
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  nowPlayingIndex = index;
}

async function playFromTrack(i, silent = false) {
  const uris = generatedTracks.slice(i).map(t => t.uri);
  if (!uris.length) return;
  try {
    const ok = await spotifyPlay(uris);
    if (!ok) throw new Error('no active device');

    // Register all URIs so polling can find them
    uriToIndices = {};
    generatedTracks.forEach((t, j) => registerUri(t.uri, j));
    sessionQueue  = new Set(generatedTracks.map(t => t.uri));
    sessionPaused = false;

    highlightNowPlaying(i);
    startPolling();
    if (!silent) showToast(i === 0
      ? `Playing ${generatedTracks.length} tracks`
      : `Playing from track ${i + 1}`);
  } catch {
    if (!silent) showError('Playback failed. Open Spotify on any device first, then try again.');
  }
}

async function autoPlay() {
  if (!generatedTracks.length) return;
  setTimeout(() => playFromTrack(0, true), 150);
}
