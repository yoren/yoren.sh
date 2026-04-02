import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initClipboard } from "../src/modules/clipboard";
import * as sound from "../src/modules/sound";

function setupCliCmdDOM(): void {
  const cliCmd = document.createElement("div");
  cliCmd.id = "cliCmd";
  const tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  tooltip.textContent = "click to copy";
  cliCmd.appendChild(tooltip);
  document.body.appendChild(cliCmd);
}

describe("clipboard", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.spyOn(sound, "playBeep").mockImplementation(() => {});
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing if cliCmd element is missing", () => {
    initClipboard(); // should not throw
  });

  it("copies 'npx yoren' to clipboard on click", () => {
    setupCliCmdDOM();
    initClipboard();
    const cliCmd = document.getElementById("cliCmd")!;
    cliCmd.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("npx yoren");
  });

  it("updates tooltip text on click", () => {
    setupCliCmdDOM();
    initClipboard();
    const cliCmd = document.getElementById("cliCmd")!;
    const tooltip = cliCmd.querySelector(".tooltip")!;
    cliCmd.click();
    expect(tooltip.textContent).toBe("copied!");
    expect(cliCmd.classList.contains("copied")).toBe(true);
  });

  it("restores tooltip after 2 seconds", () => {
    vi.useFakeTimers();
    setupCliCmdDOM();
    initClipboard();
    const cliCmd = document.getElementById("cliCmd")!;
    const tooltip = cliCmd.querySelector(".tooltip")!;
    cliCmd.click();
    vi.advanceTimersByTime(2000);
    expect(tooltip.textContent).toBe("click to copy");
    expect(cliCmd.classList.contains("copied")).toBe(false);
    vi.useRealTimers();
  });

  it("plays a beep on click", () => {
    setupCliCmdDOM();
    initClipboard();
    document.getElementById("cliCmd")!.click();
    expect(sound.playBeep).toHaveBeenCalledWith(1000, 0.1, 0.1);
  });

  it("handles Enter keydown", () => {
    setupCliCmdDOM();
    initClipboard();
    const cliCmd = document.getElementById("cliCmd")!;
    cliCmd.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("npx yoren");
  });

  it("handles Space keydown", () => {
    setupCliCmdDOM();
    initClipboard();
    const cliCmd = document.getElementById("cliCmd")!;
    cliCmd.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("npx yoren");
  });

  it("ignores other keydown events", () => {
    setupCliCmdDOM();
    initClipboard();
    const cliCmd = document.getElementById("cliCmd")!;
    cliCmd.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", bubbles: true }),
    );
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("handles missing tooltip gracefully", () => {
    vi.useFakeTimers();
    const cliCmd = document.createElement("div");
    cliCmd.id = "cliCmd";
    document.body.appendChild(cliCmd);
    initClipboard();
    cliCmd.click(); // should not throw even without tooltip
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("npx yoren");
    // Advance past timeout to cover the tooltip-null branch in setTimeout
    vi.advanceTimersByTime(2000);
    expect(cliCmd.classList.contains("copied")).toBe(false);
    vi.useRealTimers();
  });
});
