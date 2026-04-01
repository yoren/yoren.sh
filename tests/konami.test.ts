import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  handleKonamiKey,
  triggerKonamiEffect,
  injectRainbowStyle,
  initKonami,
  resetKonamiState,
} from "../src/modules/konami";
import * as sound from "../src/modules/sound";

describe("konami", () => {
  beforeEach(() => {
    resetKonamiState();
    document.body.style.animation = "";
    vi.spyOn(sound, "playBeep").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("handleKonamiKey", () => {
    it("returns false for partial sequence", () => {
      expect(handleKonamiKey("ArrowUp")).toBe(false);
      expect(handleKonamiKey("ArrowUp")).toBe(false);
    });

    it("returns true when full konami code is entered", () => {
      const sequence = [
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
      for (let i = 0; i < sequence.length - 1; i++) {
        expect(handleKonamiKey(sequence[i])).toBe(false);
      }
      expect(handleKonamiKey(sequence[sequence.length - 1])).toBe(true);
    });

    it("resets on wrong key", () => {
      handleKonamiKey("ArrowUp");
      handleKonamiKey("ArrowUp");
      handleKonamiKey("ArrowLeft"); // wrong - should be ArrowDown
      // Now try again from start
      expect(handleKonamiKey("ArrowUp")).toBe(false); // position 1
    });
  });

  describe("triggerKonamiEffect", () => {
    it("sets rainbow animation on body", () => {
      vi.useFakeTimers();
      triggerKonamiEffect();
      expect(document.body.style.animation).toContain("rainbow");
      expect(sound.playBeep).toHaveBeenCalled();

      vi.advanceTimersByTime(1500);
      expect(document.body.style.animation).toBe("");
      vi.useRealTimers();
    });

    it("plays multiple beeps", () => {
      vi.useFakeTimers();
      triggerKonamiEffect();
      vi.advanceTimersByTime(300);
      expect(sound.playBeep).toHaveBeenCalledTimes(4);
      vi.useRealTimers();
    });
  });

  describe("injectRainbowStyle", () => {
    it("adds a style element to head", () => {
      const countBefore = document.head.querySelectorAll("style").length;
      injectRainbowStyle();
      const countAfter = document.head.querySelectorAll("style").length;
      expect(countAfter).toBe(countBefore + 1);
    });
  });

  describe("initKonami", () => {
    it("injects style, ignores wrong keys, and triggers on full sequence", () => {
      vi.useFakeTimers();
      initKonami();

      // Check style injection
      const styles = document.head.querySelectorAll("style");
      expect(styles.length).toBeGreaterThan(0);

      // Non-matching key should not trigger
      document.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyZ" }));
      expect(document.body.style.animation).not.toContain("rainbow");

      // Full sequence should trigger
      const sequence = [
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
      for (const code of sequence) {
        document.dispatchEvent(new KeyboardEvent("keydown", { code }));
      }
      expect(document.body.style.animation).toContain("rainbow");
      vi.advanceTimersByTime(1500);
      vi.useRealTimers();
    });
  });

  describe("resetKonamiState", () => {
    it("resets the konami index", () => {
      handleKonamiKey("ArrowUp");
      handleKonamiKey("ArrowUp");
      resetKonamiState();
      // After reset, first ArrowUp starts from 0
      expect(handleKonamiKey("ArrowUp")).toBe(false);
    });
  });
});
