import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isMatrixRunning,
  startMatrix,
  stopMatrix,
} from "../src/modules/matrix";

function setupMatrixDOM(): void {
  const matrixMode = document.createElement("div");
  matrixMode.id = "matrixMode";
  const canvas = document.createElement("canvas");
  canvas.id = "matrixCanvas";
  matrixMode.appendChild(canvas);
  document.body.appendChild(matrixMode);
}

describe("matrix", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    stopMatrix();
  });

  afterEach(() => {
    stopMatrix();
    vi.restoreAllMocks();
  });

  describe("isMatrixRunning", () => {
    it("returns false initially", () => {
      expect(isMatrixRunning()).toBe(false);
    });
  });

  describe("startMatrix", () => {
    it("does nothing if DOM elements are missing", () => {
      startMatrix(); // should not throw
      expect(isMatrixRunning()).toBe(false);
    });

    it("activates matrix mode", () => {
      setupMatrixDOM();
      const mockCtx = {
        fillStyle: "",
        font: "",
        fillRect: vi.fn(),
        fillText: vi.fn(),
      };
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
      vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

      startMatrix();

      const matrixMode = document.getElementById("matrixMode")!;
      expect(matrixMode.classList.contains("active")).toBe(true);
      expect(isMatrixRunning()).toBe(true);
    });

    it("does nothing if canvas context is null", () => {
      setupMatrixDOM();
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(null);

      startMatrix();
      // matrixRunning gets set to true before ctx check, but no drawing happens
      expect(isMatrixRunning()).toBe(true);
    });

    it("drawing function handles drops and resets", () => {
      setupMatrixDOM();
      const mockCtx = {
        fillStyle: "",
        font: "",
        fillRect: vi.fn(),
        fillText: vi.fn(),
      };
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);

      const rafCallbacks: FrameRequestCallback[] = [];
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });

      // Make canvas have a size
      Object.defineProperty(HTMLCanvasElement.prototype, "width", {
        get: () => 140,
        set: () => {},
        configurable: true,
      });
      Object.defineProperty(HTMLCanvasElement.prototype, "height", {
        get: () => 100,
        set: () => {},
        configurable: true,
      });

      startMatrix();

      // Run multiple frames to get drops values high enough to trigger reset
      // drops[i] * fontSize (14) needs to exceed height (100), so drops[i] > ~7
      for (let frame = 0; frame < 10; frame++) {
        if (rafCallbacks.length > 0) {
          // Use 0.99 to trigger the drops[i] = 0 reset branch (> 0.975)
          vi.spyOn(Math, "random").mockReturnValue(0.99);
          rafCallbacks[rafCallbacks.length - 1](0);
        }
      }
      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.fillText).toHaveBeenCalled();
    });

    it("drawing stops when matrixRunning is false", () => {
      setupMatrixDOM();
      const mockCtx = {
        fillStyle: "",
        font: "",
        fillRect: vi.fn(),
        fillText: vi.fn(),
      };
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);

      const rafCallbacks: FrameRequestCallback[] = [];
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });

      startMatrix();
      stopMatrix();

      // Run a frame after stopping - should do nothing
      mockCtx.fillRect.mockClear();
      if (rafCallbacks.length > 0) {
        rafCallbacks[rafCallbacks.length - 1](0);
      }
      expect(mockCtx.fillRect).not.toHaveBeenCalled();
    });

    it("sets up exit handlers after 500ms", () => {
      vi.useFakeTimers();
      setupMatrixDOM();
      const mockCtx = {
        fillStyle: "",
        font: "",
        fillRect: vi.fn(),
        fillText: vi.fn(),
      };
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
      vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

      startMatrix();
      vi.advanceTimersByTime(500);

      // Click to exit
      const matrixMode = document.getElementById("matrixMode")!;
      matrixMode.click();
      expect(isMatrixRunning()).toBe(false);
      expect(matrixMode.classList.contains("active")).toBe(false);
      vi.useRealTimers();
    });

    it("exits on keydown after 500ms", () => {
      vi.useFakeTimers();
      setupMatrixDOM();
      const mockCtx = {
        fillStyle: "",
        font: "",
        fillRect: vi.fn(),
        fillText: vi.fn(),
      };
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
      vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

      startMatrix();
      vi.advanceTimersByTime(500);

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(isMatrixRunning()).toBe(false);
      vi.useRealTimers();
    });
  });

  describe("stopMatrix", () => {
    it("stops matrix and removes active class", () => {
      setupMatrixDOM();
      const mockCtx = {
        fillStyle: "",
        font: "",
        fillRect: vi.fn(),
        fillText: vi.fn(),
      };
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "getContext",
      ).mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);
      vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);

      startMatrix();
      stopMatrix();

      expect(isMatrixRunning()).toBe(false);
      const matrixMode = document.getElementById("matrixMode")!;
      expect(matrixMode.classList.contains("active")).toBe(false);
    });

    it("handles missing DOM elements", () => {
      stopMatrix(); // should not throw
    });
  });
});
