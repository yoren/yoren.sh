import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createLine,
  trimTerminalLines,
  runNpxYoren,
  typeIntro,
  resizeInput,
  initTerminal,
  introLines,
} from "../src/modules/terminal";
import * as sound from "../src/modules/sound";

function setupTerminalDOM(): {
  terminalContent: HTMLElement;
  cmdInput: HTMLInputElement;
} {
  const section = document.createElement("section");
  section.className = "terminal-section";

  const terminalContent = document.createElement("div");
  terminalContent.id = "terminalContent";

  const cmdInput = document.createElement("input");
  cmdInput.id = "cmdInput";
  cmdInput.type = "text";

  section.appendChild(terminalContent);
  section.appendChild(cmdInput);
  document.body.appendChild(section);

  return { terminalContent, cmdInput };
}

describe("terminal", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.spyOn(sound, "playBeep").mockImplementation(() => {});
    vi.spyOn(sound, "playKeySound").mockImplementation(() => {});
    vi.spyOn(sound, "playEnterSound").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("introLines", () => {
    it("is an array of line data", () => {
      expect(Array.isArray(introLines)).toBe(true);
      expect(introLines.length).toBeGreaterThan(0);
    });
  });

  describe("createLine", () => {
    it("creates a div with parts", () => {
      const div = createLine({
        type: "parts",
        parts: [
          { text: "hello ", cls: "hl" },
          { text: "world", cls: "dim" },
        ],
      });
      expect(div.tagName).toBe("DIV");
      expect(div.className).toBe("output-line");
      expect(div.children.length).toBe(2);
    });

    it("creates a prompt line with command", () => {
      const div = createLine({
        type: "prompt",
        text: "$ ",
        cmd: "ls",
      });
      expect(div.children.length).toBe(2);
      expect(div.children[0].textContent).toBe("$ ");
      expect(div.children[1].textContent).toBe("ls");
    });

    it("creates a prompt line without command", () => {
      const div = createLine({
        type: "prompt",
        text: "$ ",
      });
      expect(div.children.length).toBe(1);
    });

    it("creates a prompt line with undefined text", () => {
      const div = createLine({
        type: "prompt",
      });
      expect(div.children[0].textContent).toBe("");
    });

    it("creates a simple text line", () => {
      const div = createLine({ type: "out", text: "hello" });
      expect(div.children[0].textContent).toBe("hello");
      expect(div.children[0].className).toBe("out");
    });

    it("creates a line with nbsp for empty text", () => {
      const div = createLine({ type: "out", text: "" });
      expect(div.children[0].textContent).toBe("\u00A0");
    });

    it("creates a line with nbsp for undefined text", () => {
      const div = createLine({ type: "out" });
      expect(div.children[0].textContent).toBe("\u00A0");
    });
  });

  describe("trimTerminalLines", () => {
    it("removes excess lines beyond MAX_TERMINAL_LINES (200)", () => {
      const container = document.createElement("div");
      for (let i = 0; i < 210; i++) {
        container.appendChild(document.createElement("div"));
      }
      trimTerminalLines(container);
      expect(container.children.length).toBe(200);
    });

    it("does nothing when under the limit", () => {
      const container = document.createElement("div");
      for (let i = 0; i < 10; i++) {
        container.appendChild(document.createElement("div"));
      }
      trimTerminalLines(container);
      expect(container.children.length).toBe(10);
    });
  });

  describe("runNpxYoren", () => {
    it("adds npx yoren output lines to terminal", async () => {
      vi.useFakeTimers();
      const container = document.createElement("div");
      const promise = runNpxYoren(container);
      for (let i = 0; i < 20; i++) {
        await vi.advanceTimersByTimeAsync(100);
      }
      await promise;
      expect(container.children.length).toBe(9);
      vi.useRealTimers();
    });
  });

  describe("typeIntro", () => {
    it("types intro lines into terminal", async () => {
      vi.useFakeTimers();
      const container = document.createElement("div");
      const input = document.createElement("input") as HTMLInputElement;
      const focusSpy = vi.spyOn(input, "focus");
      const promise = typeIntro(container, input);
      // Advance past initial 800ms sleep plus all line delays
      for (let i = 0; i < 30; i++) {
        await vi.advanceTimersByTimeAsync(100);
      }
      await promise;
      expect(container.children.length).toBe(introLines.length);
      expect(focusSpy).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe("resizeInput", () => {
    it("sets width based on value length", () => {
      const input = document.createElement("input") as HTMLInputElement;
      input.value = "hello";
      resizeInput(input);
      expect(input.style.width).toBe("5ch");
    });

    it("sets width to 0ch for empty input", () => {
      const input = document.createElement("input") as HTMLInputElement;
      input.value = "";
      resizeInput(input);
      expect(input.style.width).toBe("0ch");
    });
  });

  describe("initTerminal", () => {
    it("does nothing if DOM elements are missing", () => {
      initTerminal(); // should not throw
    });

    it("sets maxlength on input", () => {
      setupTerminalDOM();
      initTerminal();
      const input = document.getElementById("cmdInput")!;
      expect(input.getAttribute("maxlength")).toBe("256");
    });

    it("handles Enter key with a known command", async () => {
      vi.useFakeTimers();
      const { terminalContent, cmdInput } = setupTerminalDOM();
      initTerminal();

      cmdInput.value = "help";
      cmdInput.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await vi.advanceTimersByTimeAsync(500);

      expect(terminalContent.children.length).toBeGreaterThan(0);
      expect(cmdInput.value).toBe("");
      vi.useRealTimers();
    });

    it("handles Enter key with clear command", async () => {
      vi.useFakeTimers();
      const { terminalContent, cmdInput } = setupTerminalDOM();
      initTerminal();

      // Add some content first
      terminalContent.appendChild(document.createElement("div"));

      cmdInput.value = "clear";
      cmdInput.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await vi.advanceTimersByTimeAsync(100);

      expect(terminalContent.textContent).toBe("");
      vi.useRealTimers();
    });

    it("handles Enter key with npx yoren command", async () => {
      vi.useFakeTimers();
      const { terminalContent, cmdInput } = setupTerminalDOM();
      initTerminal();

      cmdInput.value = "npx yoren";
      cmdInput.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      for (let i = 0; i < 20; i++) {
        await vi.advanceTimersByTimeAsync(100);
      }

      expect(terminalContent.children.length).toBeGreaterThan(1);
      vi.useRealTimers();
    });

    it("handles Enter key with unknown command", async () => {
      vi.useFakeTimers();
      const { terminalContent, cmdInput } = setupTerminalDOM();
      initTerminal();

      cmdInput.value = "unknown_cmd";
      cmdInput.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await vi.advanceTimersByTimeAsync(100);

      const text = terminalContent.textContent ?? "";
      expect(text).toContain("Command not found");
      vi.useRealTimers();
    });

    it("handles Enter key with empty command", async () => {
      vi.useFakeTimers();
      const { terminalContent, cmdInput } = setupTerminalDOM();
      initTerminal();

      cmdInput.value = "";
      cmdInput.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      await vi.advanceTimersByTimeAsync(100);

      // Should show prompt line but no command output
      expect(terminalContent.children.length).toBe(1);
      vi.useRealTimers();
    });

    it("plays key sound for non-Enter keys", () => {
      setupTerminalDOM();
      initTerminal();
      const cmdInput = document.getElementById("cmdInput")!;
      cmdInput.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true }),
      );
      expect(sound.playKeySound).toHaveBeenCalled();
    });

    it("resizes input on input event", () => {
      setupTerminalDOM();
      initTerminal();
      const cmdInput = document.getElementById(
        "cmdInput",
      )! as HTMLInputElement;
      cmdInput.value = "test";
      cmdInput.dispatchEvent(new Event("input", { bubbles: true }));
      expect(cmdInput.style.width).toBe("4ch");
    });

    it("focuses input on terminal section click", () => {
      setupTerminalDOM();
      initTerminal();
      const cmdInput = document.getElementById("cmdInput")!;
      const focusSpy = vi.spyOn(cmdInput, "focus");
      document.querySelector(".terminal-section")!.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
      expect(focusSpy).toHaveBeenCalled();
    });
  });
});
