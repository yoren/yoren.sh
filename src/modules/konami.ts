import { playBeep } from "./sound";

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

let konamiIndex = 0;

export function handleKonamiKey(code: string): boolean {
  if (code === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      return true;
    }
  } else {
    konamiIndex = 0;
  }
  return false;
}

export function triggerKonamiEffect(): void {
  document.body.style.animation = "rainbow 0.5s linear 3";
  playBeep(523, 0.1, 0.2);
  setTimeout(() => playBeep(659, 0.1, 0.2), 100);
  setTimeout(() => playBeep(784, 0.1, 0.2), 200);
  setTimeout(() => playBeep(1047, 0.2, 0.2), 300);
  setTimeout(() => {
    document.body.style.animation = "";
  }, 1500);
}

export function injectRainbowStyle(): void {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export function initKonami(): void {
  injectRainbowStyle();

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (handleKonamiKey(e.code)) {
      triggerKonamiEffect();
    }
  });
}

export function resetKonamiState(): void {
  konamiIndex = 0;
}
