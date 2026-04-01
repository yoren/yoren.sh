import { describe, it, expect, vi } from "vitest";
import { sleep, createSpan } from "../src/modules/utils";

describe("utils", () => {
  describe("sleep", () => {
    it("resolves after the specified delay", async () => {
      vi.useFakeTimers();
      let resolved = false;
      sleep(100).then(() => {
        resolved = true;
      });
      expect(resolved).toBe(false);
      await vi.advanceTimersByTimeAsync(100);
      expect(resolved).toBe(true);
      vi.useRealTimers();
    });
  });

  describe("createSpan", () => {
    it("creates a span element with the given text and class", () => {
      const span = createSpan("hello", "test-class");
      expect(span.tagName).toBe("SPAN");
      expect(span.textContent).toBe("hello");
      expect(span.className).toBe("test-class");
    });

    it("handles empty text", () => {
      const span = createSpan("", "cls");
      expect(span.textContent).toBe("");
    });

    it("handles empty class", () => {
      const span = createSpan("text", "");
      expect(span.className).toBe("");
    });
  });
});
