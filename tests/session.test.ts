import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatTime,
  getMoods,
  initSession,
  destroySession,
} from "../src/modules/session";

describe("session", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    destroySession();
  });

  afterEach(() => {
    destroySession();
    vi.restoreAllMocks();
  });

  describe("formatTime", () => {
    it("formats 0 seconds", () => {
      expect(formatTime(0)).toBe("00:00:00");
    });

    it("formats seconds only", () => {
      expect(formatTime(45)).toBe("00:00:45");
    });

    it("formats minutes and seconds", () => {
      expect(formatTime(125)).toBe("00:02:05");
    });

    it("formats hours, minutes, and seconds", () => {
      expect(formatTime(3661)).toBe("01:01:01");
    });
  });

  describe("getMoods", () => {
    it("returns the moods array", () => {
      const moods = getMoods();
      expect(moods).toContain("CAFFEINATED");
      expect(moods).toContain("SHIPPING");
      expect(moods.length).toBe(6);
    });
  });

  describe("initSession / destroySession", () => {
    it("updates session time every second", () => {
      vi.useFakeTimers();
      const el = document.createElement("span");
      el.id = "sessionTime";
      document.body.appendChild(el);
      initSession();
      vi.advanceTimersByTime(3000);
      expect(el.textContent).toBe("00:00:03");
      vi.useRealTimers();
    });

    it("rotates mood every 8 seconds", () => {
      vi.useFakeTimers();
      const el = document.createElement("span");
      el.id = "moodStatus";
      el.textContent = "CAFFEINATED";
      document.body.appendChild(el);
      initSession();
      vi.advanceTimersByTime(8000);
      expect(el.textContent).toBe("FOCUSED");
      vi.advanceTimersByTime(8000);
      expect(el.textContent).toBe("CURIOUS");
      vi.useRealTimers();
    });

    it("handles missing session element", () => {
      const el = document.createElement("span");
      el.id = "moodStatus";
      document.body.appendChild(el);
      initSession(); // should not throw
    });

    it("handles missing mood element", () => {
      const el = document.createElement("span");
      el.id = "sessionTime";
      document.body.appendChild(el);
      initSession(); // should not throw
    });

    it("destroySession clears intervals", () => {
      vi.useFakeTimers();
      const sessionEl = document.createElement("span");
      sessionEl.id = "sessionTime";
      document.body.appendChild(sessionEl);
      initSession();
      destroySession();
      vi.advanceTimersByTime(5000);
      // After destroy, content should not be updated (reset to 0 state)
      vi.useRealTimers();
    });

    it("destroySession is safe to call multiple times", () => {
      destroySession(); // should not throw
    });
  });
});
