import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  initAudio,
  isSoundEnabled,
  setSoundEnabled,
  playBeep,
  playKeySound,
  playEnterSound,
  playBootSound,
  initSoundToggle,
  resetSoundState,
} from "../src/modules/sound";

function createMockAudioContext() {
  const gainNode = {
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  };
  const oscillatorNode = {
    connect: vi.fn(),
    frequency: { value: 0 },
    type: "sine" as OscillatorType,
    start: vi.fn(),
    stop: vi.fn(),
  };
  const mockCtx = {
    destination: {},
    currentTime: 0,
    createOscillator: vi.fn(() => oscillatorNode),
    createGain: vi.fn(() => gainNode),
  };
  return { mockCtx, gainNode, oscillatorNode };
}

// Note: innerHTML usage in tests is safe - static test fixture strings only
function setupSoundToggle(): void {
  const btn = document.createElement("button");
  btn.id = "soundToggle";
  btn.setAttribute("aria-pressed", "false");
  btn.textContent = "[SOUND: OFF]";
  document.body.appendChild(btn);
}

describe("sound", () => {
  beforeEach(() => {
    resetSoundState();
    document.body.replaceChildren();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initAudio", () => {
    it("creates an AudioContext", () => {
      const { mockCtx } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      expect(AudioContext).toHaveBeenCalled();
    });

    it("does not create a second AudioContext if already initialized", () => {
      const { mockCtx } = createMockAudioContext();
      const ctor = vi.fn(function () { return mockCtx; });
      vi.stubGlobal("AudioContext", ctor);
      initAudio();
      initAudio();
      expect(ctor).toHaveBeenCalledTimes(1);
    });
  });

  describe("isSoundEnabled / setSoundEnabled", () => {
    it("defaults to false", () => {
      expect(isSoundEnabled()).toBe(false);
    });

    it("can be toggled", () => {
      setSoundEnabled(true);
      expect(isSoundEnabled()).toBe(true);
      setSoundEnabled(false);
      expect(isSoundEnabled()).toBe(false);
    });
  });

  describe("playBeep", () => {
    it("does nothing when sound is disabled", () => {
      const { mockCtx } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(false);
      playBeep();
      expect(mockCtx.createOscillator).not.toHaveBeenCalled();
    });

    it("does nothing when audioCtx is null", () => {
      setSoundEnabled(true);
      playBeep(); // should not throw
    });

    it("plays a beep when sound is enabled and audioCtx exists", () => {
      const { mockCtx, oscillatorNode, gainNode } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(true);
      playBeep(440, 0.1, 0.2);
      expect(mockCtx.createOscillator).toHaveBeenCalled();
      expect(mockCtx.createGain).toHaveBeenCalled();
      expect(oscillatorNode.connect).toHaveBeenCalledWith(gainNode);
      expect(gainNode.connect).toHaveBeenCalledWith(mockCtx.destination);
      expect(oscillatorNode.frequency.value).toBe(440);
      expect(oscillatorNode.type).toBe("square");
      expect(oscillatorNode.start).toHaveBeenCalled();
      expect(oscillatorNode.stop).toHaveBeenCalled();
    });

    it("uses default parameters", () => {
      const { mockCtx, oscillatorNode } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(true);
      playBeep();
      expect(oscillatorNode.frequency.value).toBe(800);
    });
  });

  describe("playKeySound", () => {
    it("calls playBeep with randomized frequency", () => {
      const { mockCtx, oscillatorNode } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(true);
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      playKeySound();
      expect(oscillatorNode.frequency.value).toBe(700);
    });
  });

  describe("playEnterSound", () => {
    it("plays two beeps", () => {
      vi.useFakeTimers();
      const { mockCtx } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(true);
      playEnterSound();
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(50);
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });
  });

  describe("playBootSound", () => {
    it("plays three beeps", () => {
      vi.useFakeTimers();
      const { mockCtx } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(true);
      playBootSound();
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(1);
      vi.advanceTimersByTime(100);
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
      vi.advanceTimersByTime(100);
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(3);
      vi.useRealTimers();
    });
  });

  describe("initSoundToggle", () => {
    it("does nothing if soundToggle element is missing", () => {
      initSoundToggle(); // should not throw
    });

    it("toggles sound on click", () => {
      const { mockCtx } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );

      setupSoundToggle();
      initSoundToggle();

      const btn = document.getElementById("soundToggle")!;
      btn.click();
      expect(btn.textContent).toBe("[SOUND: ON]");
      expect(btn.classList.contains("active")).toBe(true);
      expect(btn.getAttribute("aria-pressed")).toBe("true");

      btn.click();
      expect(btn.textContent).toBe("[SOUND: OFF]");
      expect(btn.classList.contains("active")).toBe(false);
      expect(btn.getAttribute("aria-pressed")).toBe("false");
    });
  });

  describe("resetSoundState", () => {
    it("resets audio context and sound enabled state", () => {
      const { mockCtx } = createMockAudioContext();
      vi.stubGlobal(
        "AudioContext",
        vi.fn(function () { return mockCtx; }),
      );
      initAudio();
      setSoundEnabled(true);
      resetSoundState();
      expect(isSoundEnabled()).toBe(false);
    });
  });
});
