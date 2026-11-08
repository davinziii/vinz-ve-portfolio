type AudioPreference = { volume: number; muted: boolean };
const storageKey = "vinz-video-audio";
let preference: AudioPreference | undefined;
const players = new Set<HTMLVideoElement>();
const temporaryMutes = new WeakSet<HTMLVideoElement>();

function currentPreference(): AudioPreference {
  if (preference) return preference;
  preference = { volume: 1, muted: false };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (
      saved &&
      Number.isFinite(saved.volume) &&
      saved.volume >= 0 &&
      saved.volume <= 1 &&
      typeof saved.muted === "boolean"
    ) {
      preference = { volume: saved.volume, muted: saved.muted };
    }
  } catch {
    /* The in-memory preference still works when storage is unavailable. */
  }
  return preference;
}

function applyPreference(player: HTMLVideoElement) {
  const saved = currentPreference();
  if (player.volume !== saved.volume) player.volume = saved.volume;
  const muted = temporaryMutes.has(player) || saved.muted;
  if (player.muted !== muted) player.muted = muted;
}

/** Connect native controls to the shared preference before playback begins. */
export function connectVideoAudio(player: HTMLVideoElement): () => void {
  players.add(player);
  applyPreference(player);
  const changed = () => {
    if (!player.muted) temporaryMutes.delete(player);
    const previous = currentPreference();
    const next = {
      volume: player.volume,
      muted: temporaryMutes.has(player) ? previous.muted : player.muted,
    };
    if (next.volume === previous.volume && next.muted === previous.muted)
      return;
    preference = next;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* Optional persistence. */
    }
    players.forEach((other) => {
      if (other !== player) applyPreference(other);
    });
  };
  player.addEventListener("volumechange", changed);
  return () => {
    player.removeEventListener("volumechange", changed);
    players.delete(player);
    temporaryMutes.delete(player);
  };
}

/** Browser-required autoplay muting must not overwrite the viewer's choice. */
export function muteForAutoplay(player: HTMLVideoElement) {
  temporaryMutes.add(player);
  player.muted = true;
}
