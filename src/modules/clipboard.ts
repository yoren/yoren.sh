import { playBeep } from "./sound";

export function initClipboard(): void {
  const cliCmd = document.getElementById("cliCmd");
  if (!cliCmd) return;

  const handleCopy = (): void => {
    navigator.clipboard.writeText("npx yoren");
    const tooltip = cliCmd.querySelector(".tooltip");
    if (tooltip) {
      tooltip.textContent = "copied!";
    }
    cliCmd.classList.add("copied");
    playBeep(1000, 0.1, 0.1);
    setTimeout(() => {
      if (tooltip) {
        tooltip.textContent = "click to copy";
      }
      cliCmd.classList.remove("copied");
    }, 2000);
  };

  cliCmd.addEventListener("click", handleCopy);

  cliCmd.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCopy();
    }
  });
}
