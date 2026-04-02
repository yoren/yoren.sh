import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  triggerTear,
  initEffects,
  destroyEffects,
} from "../src/modules/effects";

function setupScreenTear(): void {
  const el = document.createElement("div");
  el.id = "screenTear";
  document.body.appendChild(el);
}

describe("effects", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    destroyEffects();
  });

  afterEach(() => {
    destroyEffects();
    vi.restoreAllMocks();
  });

  describe("triggerTear", () => {
    it("sets random top position and adds active class", () => {
      setupScreenTear();
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      triggerTear();
      const el = document.getElementById("screenTear")!;
      expect(el.style.top).toBe("50%");
      expect(el.classList.contains("active")).toBe(true);
    });

    it("removes active class after 150ms", () => {
      vi.useFakeTimers();
      setupScreenTear();
      triggerTear();
      const el = document.getElementById("screenTear")!;
      expect(el.classList.contains("active")).toBe(true);
      vi.advanceTimersByTime(150);
      expect(el.classList.contains("active")).toBe(false);
      vi.useRealTimers();
    });

    it("does nothing if screenTear element is missing", () => {
      triggerTear(); // should not throw
    });
  });

  describe("initEffects / destroyEffects", () => {
    it("triggers tears at random intervals", () => {
      vi.useFakeTimers();
      setupScreenTear();
      vi.spyOn(Math, "random").mockReturnValue(0.05);
      initEffects();
      vi.advanceTimersByTime(3000);
      const el = document.getElementById("screenTear")!;
      expect(el.classList.contains("active")).toBe(true);
      vi.useRealTimers();
    });

    it("does not trigger tear when random > 0.1", () => {
      vi.useFakeTimers();
      setupScreenTear();
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      initEffects();
      vi.advanceTimersByTime(3000);
      const el = document.getElementById("screenTear")!;
      expect(el.classList.contains("active")).toBe(false);
      vi.useRealTimers();
    });

    it("stops interval on destroy", () => {
      vi.useFakeTimers();
      initEffects();
      destroyEffects();
      vi.advanceTimersByTime(6000);
      vi.useRealTimers();
    });

    it("destroyEffects is safe to call multiple times", () => {
      destroyEffects(); // should not throw
    });
  });
});
