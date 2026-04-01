let matrixRunning = false;

export function isMatrixRunning(): boolean {
  return matrixRunning;
}

export function startMatrix(): void {
  const matrixMode = document.getElementById("matrixMode");
  const matrixCanvas = document.getElementById(
    "matrixCanvas",
  ) as HTMLCanvasElement | null;

  if (!matrixMode || !matrixCanvas) return;

  matrixMode.classList.add("active");
  matrixRunning = true;
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const ctx = matrixCanvas.getContext("2d");
  if (!ctx) return;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
  const fontSize = 14;
  const columns = matrixCanvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1) as number[];

  function drawMatrix(): void {
    if (!matrixRunning) return;
    ctx!.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx!.fillRect(0, 0, matrixCanvas!.width, matrixCanvas!.height);
    ctx!.fillStyle = "#0f0";
    ctx!.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx!.fillText(char, i * fontSize, drops[i] * fontSize);
      if (
        drops[i] * fontSize > matrixCanvas!.height &&
        Math.random() > 0.975
      ) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  const exitMatrix = (): void => {
    matrixRunning = false;
    matrixMode!.classList.remove("active");
    matrixMode!.removeEventListener("click", exitMatrix);
    document.removeEventListener("keydown", exitMatrix);
  };
  setTimeout(() => {
    matrixMode!.addEventListener("click", exitMatrix);
    document.addEventListener("keydown", exitMatrix);
  }, 500);
}

export function stopMatrix(): void {
  matrixRunning = false;
  const matrixMode = document.getElementById("matrixMode");
  if (matrixMode) matrixMode.classList.remove("active");
}
