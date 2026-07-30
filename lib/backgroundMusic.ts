// Single shared <audio> instance (not tied to any component's lifecycle) so
// the music keeps playing across the whole site regardless of which section
// scrolls in/out or re-renders — starting it lives outside React entirely.
let audio: HTMLAudioElement | null = null;

export function playBackgroundMusic() {
  if (typeof window === "undefined") return;
  if (!audio) {
    audio = new Audio("/audio/wedding-music.mp3");
    audio.loop = true;
  }
  void audio.play();
}
