let tearIntervalId: ReturnType<typeof setInterval> | null = null;

export function triggerTear(): void {
  const screenTear = document.getElementById("screenTear");
  if (!screenTear) return;
  screenTear.style.top = Math.random() * 100 + "%";
  screenTear.classList.add("active");
  setTimeout(() => screenTear.classList.remove("active"), 150);
}

export function initEffects(): void {
  tearIntervalId = setInterval(() => {
    if (Math.random() < 0.1) triggerTear();
  }, 3000);
}

export function destroyEffects(): void {
  if (tearIntervalId !== null) {
    clearInterval(tearIntervalId);
    tearIntervalId = null;
  }
}
