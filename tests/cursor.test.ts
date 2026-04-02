import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initCursor, destroyCursor } from "../src/modules/cursor";

function setupCursorDOM(): void {
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  const trail = document.createElement("div");
  trail.id = "cursorTrail";
  document.body.appendChild(cursor);
  document.body.appendChild(trail);
}

describe("cursor", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    destroyCursor();
  });

  afterEach(() => {
    destroyCursor();
    vi.restoreAllMocks();
  });

  it("does nothing if cursor elements are missing", () => {
    initCursor(); // should not throw
  });

  it("updates cursor position on mousemove", () => {
    setupCursorDOM();
    initCursor();
    const cursor = document.getElementById("cursor")!;
    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 200 }),
    );
    expect(cursor.style.left).toBe("100px");
    expect(cursor.style.top).toBe("200px");
  });

  it("adds clicking class on mousedown and removes on mouseup", () => {
    setupCursorDOM();
    initCursor();
    const cursor = document.getElementById("cursor")!;
    document.dispatchEvent(new MouseEvent("mousedown"));
    expect(cursor.classList.contains("clicking")).toBe(true);
    document.dispatchEvent(new MouseEvent("mouseup"));
    expect(cursor.classList.contains("clicking")).toBe(false);
  });

  it("animates cursor trail toward mouse position", () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    setupCursorDOM();
    initCursor();
    const cursorTrail = document.getElementById("cursorTrail")!;

    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 100, clientY: 100 }),
    );

    // Run a few animation frames
    if (rafCallbacks.length > 0) rafCallbacks[rafCallbacks.length - 1](0);
    if (rafCallbacks.length > 1) rafCallbacks[rafCallbacks.length - 1](0);

    const left = parseFloat(cursorTrail.style.left);
    expect(left).toBeGreaterThan(0);
  });

  it("destroyCursor cancels animation frame", () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(42);
    setupCursorDOM();
    initCursor();
    destroyCursor();
    expect(cancelSpy).toHaveBeenCalledWith(42);
  });

  it("destroyCursor does nothing if no animation is running", () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
    destroyCursor();
    expect(cancelSpy).not.toHaveBeenCalled();
  });
});
