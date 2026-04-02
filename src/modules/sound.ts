let audioCtx: AudioContext | null = null;
let soundEnabled = false;

export function initAudio(): void {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function playBeep(
  freq = 800,
  duration = 0.05,
  volume = 0.1,
): void {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  osc.type = "square";
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration,
  );
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playKeySound(): void {
  playBeep(600 + Math.random() * 200, 0.03, 0.05);
}

export function playEnterSound(): void {
  playBeep(400, 0.1, 0.08);
  setTimeout(() => playBeep(600, 0.1, 0.08), 50);
}

export function playBootSound(): void {
  playBeep(200, 0.2, 0.1);
  setTimeout(() => playBeep(400, 0.15, 0.1), 100);
  setTimeout(() => playBeep(800, 0.3, 0.1), 200);
}

export function initSoundToggle(): void {
  const soundToggle = document.getElementById("soundToggle");
  if (!soundToggle) return;

  soundToggle.addEventListener("click", () => {
    initAudio();
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? "[SOUND: ON]" : "[SOUND: OFF]";
    soundToggle.classList.toggle("active", soundEnabled);
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    if (soundEnabled) playBeep(800, 0.1, 0.1);
  });
}

export function resetSoundState(): void {
  audioCtx = null;
  soundEnabled = false;
}
