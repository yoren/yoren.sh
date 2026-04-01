let mouseX = 0;
let mouseY = 0;
let trailX = 0;
let trailY = 0;
let animationId: number | null = null;

export function initCursor(): void {
  const cursor = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");
  if (!cursor || !cursorTrail) return;

  document.addEventListener("mousemove", (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
  document.addEventListener("mouseup", () =>
    cursor.classList.remove("clicking"),
  );

  const trail = cursorTrail;
  function animateTrail(): void {
    trailX += (mouseX - trailX) * 0.2;
    trailY += (mouseY - trailY) * 0.2;
    trail.style.left = trailX + "px";
    trail.style.top = trailY + "px";
    animationId = requestAnimationFrame(animateTrail);
  }

  animateTrail();
}

export function destroyCursor(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

export { mouseX, mouseY };
