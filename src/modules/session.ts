const moods = [
  "CAFFEINATED",
  "FOCUSED",
  "CURIOUS",
  "BUILDING",
  "DEBUGGING",
  "SHIPPING",
];

let sessionSeconds = 0;
let moodIndex = 0;
let sessionIntervalId: ReturnType<typeof setInterval> | null = null;
let moodIntervalId: ReturnType<typeof setInterval> | null = null;

export function formatTime(totalSeconds: number): string {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function getMoods(): string[] {
  return moods;
}

export function initSession(): void {
  const sessionEl = document.getElementById("sessionTime");
  const moodEl = document.getElementById("moodStatus");

  if (sessionEl) {
    sessionIntervalId = setInterval(() => {
      sessionSeconds++;
      sessionEl.textContent = formatTime(sessionSeconds);
    }, 1000);
  }

  if (moodEl) {
    moodIntervalId = setInterval(() => {
      moodIndex = (moodIndex + 1) % moods.length;
      moodEl.textContent = moods[moodIndex];
    }, 8000);
  }
}

export function destroySession(): void {
  if (sessionIntervalId !== null) {
    clearInterval(sessionIntervalId);
    sessionIntervalId = null;
  }
  if (moodIntervalId !== null) {
    clearInterval(moodIntervalId);
    moodIntervalId = null;
  }
  sessionSeconds = 0;
  moodIndex = 0;
}
