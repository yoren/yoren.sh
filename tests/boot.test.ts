import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  bootLines,
  isBootSkipped,
  skipBoot,
  runBoot,
  resetBootState,
} from "../src/modules/boot";
import * as sound from "../src/modules/sound";

function setupBootDOM(): void {
  const bootSeq = document.createElement("div");
  bootSeq.id = "bootSequence";
  const mainContent = document.createElement("main");
  mainContent.id = "mainContent";
  mainContent.style.visibility = "hidden";
  const cmdInput = document.createElement("input");
  cmdInput.id = "cmdInput";
  document.body.appendChild(bootSeq);
  document.body.appendChild(mainContent);
  document.body.appendChild(cmdInput);
}

describe("boot", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    resetBootState();
    vi.spyOn(sound, "playKeySound").mockImplementation(() => {});
    vi.spyOn(sound, "playBootSound").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("bootLines", () => {
    it("has 13 boot lines", () => {
      expect(bootLines).toHaveLength(13);
    });

    it("first line is BIOS header", () => {
      expect(bootLines[0].text).toContain("YOREN SYSTEMS BIOS");
    });
  });

  describe("skipBoot", () => {
    it("hides boot sequence and shows main content", () => {
      setupBootDOM();
      skipBoot();
      const bootSeq = document.getElementById("bootSequence")!;
      const mainContent = document.getElementById("mainContent")!;
      expect(bootSeq.classList.contains("hidden")).toBe(true);
      expect(mainContent.style.visibility).toBe("visible");
      expect(isBootSkipped()).toBe(true);
    });

    it("removes skip button if present", () => {
      setupBootDOM();
      const skipBtn = document.createElement("button");
      skipBtn.id = "skipIntroBtn";
      document.getElementById("bootSequence")!.appendChild(skipBtn);
      skipBoot();
      expect(document.getElementById("skipIntroBtn")).toBeNull();
    });

    it("handles missing DOM elements gracefully", () => {
      skipBoot(); // should not throw
      expect(isBootSkipped()).toBe(true);
    });
  });

  describe("runBoot", () => {
    it("skips boot when prefers-reduced-motion is set", async () => {
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: true,
      } as MediaQueryList);
      await runBoot();
      expect(isBootSkipped()).toBe(true);
    });

    it("returns early if DOM elements are missing", async () => {
      await runBoot(); // should not throw
    });

    it("runs boot sequence to completion", async () => {
      vi.useFakeTimers();
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();

      // Advance through all boot lines and delays
      for (let i = 0; i < 50; i++) {
        await vi.advanceTimersByTimeAsync(500);
      }

      await bootPromise;

      // Verify boot was NOT skipped - completed naturally
      expect(isBootSkipped()).toBe(false);
      const bootSeq = document.getElementById("bootSequence")!;
      expect(bootSeq.classList.contains("hidden")).toBe(true);
      const mainContent = document.getElementById("mainContent")!;
      expect(mainContent.style.visibility).toBe("visible");
      // Skip button should be removed after completion
      expect(document.getElementById("skipIntroBtn")).toBeNull();
      vi.useRealTimers();
    });

    it("ignores non-Escape keys during boot", async () => {
      vi.useFakeTimers();
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();
      await vi.advanceTimersByTimeAsync(50);

      // Fire a non-Escape key - should NOT skip boot
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
      await vi.advanceTimersByTimeAsync(50);
      expect(isBootSkipped()).toBe(false);

      // Now actually skip to finish the test
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await vi.advanceTimersByTimeAsync(100);
      await bootPromise;
      vi.useRealTimers();
    });

    it("can be skipped with Escape key", async () => {
      vi.useFakeTimers();
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();
      await vi.advanceTimersByTimeAsync(50);

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      await vi.advanceTimersByTimeAsync(100);

      await bootPromise;
      expect(isBootSkipped()).toBe(true);
      vi.useRealTimers();
    });

    it("can be skipped by clicking skip button", async () => {
      vi.useFakeTimers();
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();
      await vi.advanceTimersByTimeAsync(50);

      const skipBtn = document.getElementById("skipIntroBtn");
      skipBtn?.click();
      await vi.advanceTimersByTimeAsync(100);

      await bootPromise;
      expect(isBootSkipped()).toBe(true);
      vi.useRealTimers();
    });

    it("can be skipped during post-loop sleep", async () => {
      vi.useFakeTimers();
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();

      // Advance well past the loop and into sleep(500)
      for (let i = 0; i < 45; i++) {
        await vi.advanceTimersByTimeAsync(50);
      }

      // Skip boot during the sleep(500) to hit the post-sleep check
      skipBoot();
      await vi.advanceTimersByTimeAsync(2000);

      await bootPromise;
      expect(isBootSkipped()).toBe(true);
      vi.useRealTimers();
    });

    it("creates boot line elements with append text", async () => {
      vi.useFakeTimers();
      setupBootDOM();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();

      for (let i = 0; i < 50; i++) {
        await vi.advanceTimersByTimeAsync(500);
      }
      await bootPromise;

      const bootSeq = document.getElementById("bootSequence")!;
      const okSpans = bootSeq.querySelectorAll(".ok");
      expect(okSpans.length).toBeGreaterThan(0);

      const warnSpans = bootSeq.querySelectorAll(".warn");
      expect(warnSpans.length).toBeGreaterThan(0);

      const bootCursors = bootSeq.querySelectorAll(".boot-cursor");
      expect(bootCursors.length).toBe(1);

      vi.useRealTimers();
    });

    it("runs boot to completion without cmdInput element", async () => {
      vi.useFakeTimers();
      // Set up DOM without cmdInput
      const bootSeq = document.createElement("div");
      bootSeq.id = "bootSequence";
      const mainContent = document.createElement("main");
      mainContent.id = "mainContent";
      mainContent.style.visibility = "hidden";
      document.body.appendChild(bootSeq);
      document.body.appendChild(mainContent);

      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: false,
      } as MediaQueryList);

      const bootPromise = runBoot();
      for (let i = 0; i < 50; i++) {
        await vi.advanceTimersByTimeAsync(500);
      }
      await bootPromise;

      expect(mainContent.style.visibility).toBe("visible");
      vi.useRealTimers();
    });
  });

  describe("resetBootState", () => {
    it("resets boot skipped state", () => {
      setupBootDOM();
      skipBoot();
      expect(isBootSkipped()).toBe(true);
      resetBootState();
      expect(isBootSkipped()).toBe(false);
    });
  });
});
