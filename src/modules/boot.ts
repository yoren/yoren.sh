import { sleep } from "./utils";
import { playKeySound, playBootSound } from "./sound";

export interface BootLine {
  text: string;
  delay: number;
  append?: string;
  appendClass?: string;
}

export const bootLines: BootLine[] = [
  { text: "YOREN SYSTEMS BIOS v3.14.159", delay: 100 },
  { text: "Copyright (C) 2026 Yoren Industries", delay: 80 },
  { text: "", delay: 50 },
  {
    text: "Initializing memory banks... 16384 MB ",
    delay: 120,
    append: "OK",
    appendClass: "ok",
  },
  {
    text: "Loading consciousness matrix... ",
    delay: 200,
    append: "OK",
    appendClass: "ok",
  },
  {
    text: "Mounting /dev/creativity... ",
    delay: 150,
    append: "OK",
    appendClass: "ok",
  },
  {
    text: "Starting neural network daemon... ",
    delay: 180,
    append: "OK",
    appendClass: "ok",
  },
  {
    text: "Syncing caffeine levels... ",
    delay: 100,
    append: "CRITICAL",
    appendClass: "warn",
  },
  {
    text: "Establishing internet presence... ",
    delay: 250,
    append: "OK",
    appendClass: "ok",
  },
  { text: "", delay: 50 },
  { text: "> All systems operational", delay: 100 },
  { text: "> Welcome to yoren.sh", delay: 100 },
  { text: "", delay: 300 },
];

let bootSkipped = false;

export function isBootSkipped(): boolean {
  return bootSkipped;
}

export function skipBoot(): void {
  const bootSequence = document.getElementById("bootSequence");
  const mainContent = document.getElementById("mainContent");
  const cmdInput = document.getElementById("cmdInput") as HTMLInputElement | null;

  bootSkipped = true;
  if (bootSequence) bootSequence.classList.add("boot-done");
  if (mainContent) mainContent.style.visibility = "visible";
  const skipBtn = document.getElementById("skipIntroBtn");
  if (skipBtn) skipBtn.remove();
  if (cmdInput) cmdInput.focus();
}

export async function runBoot(): Promise<void> {
  const bootSequence = document.getElementById("bootSequence");
  const mainContent = document.getElementById("mainContent");
  const cmdInput = document.getElementById("cmdInput") as HTMLInputElement | null;

  if (!bootSequence || !mainContent) return;

  bootSkipped = false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    skipBoot();
    return;
  }

  const skipBtn = document.createElement("button");
  skipBtn.id = "skipIntroBtn";
  skipBtn.className = "skip-intro";
  skipBtn.textContent = "Skip intro [Esc]";
  skipBtn.addEventListener("click", skipBoot);
  bootSequence.appendChild(skipBtn);
  skipBtn.focus();

  const escHandler = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      skipBoot();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  for (const line of bootLines) {
    if (bootSkipped) return;

    const div = document.createElement("div");
    div.className = "boot-line";

    const textSpan = document.createElement("span");
    textSpan.textContent = line.text;
    div.appendChild(textSpan);

    if (line.append) {
      const appendSpan = document.createElement("span");
      appendSpan.className = String(line.appendClass);
      appendSpan.textContent = line.append;
      div.appendChild(appendSpan);
    }

    if (line === bootLines[bootLines.length - 1]) {
      const cursorEl = document.createElement("span");
      cursorEl.className = "boot-cursor";
      div.appendChild(cursorEl);
    }

    bootSequence.appendChild(div);
    await sleep(20);
    div.classList.add("visible");
    playKeySound();
    await sleep(line.delay);
  }

  await sleep(500);
  if (bootSkipped) return;
  playBootSound();
  await sleep(300);

  document.removeEventListener("keydown", escHandler);
  document.getElementById("skipIntroBtn")?.remove();

  bootSequence.classList.add("boot-done");
  mainContent.style.visibility = "visible";
  if (cmdInput) cmdInput.focus();
}

export function resetBootState(): void {
  bootSkipped = false;
}
