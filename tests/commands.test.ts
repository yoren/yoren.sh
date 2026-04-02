import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCommands } from "../src/modules/commands";
import * as matrix from "../src/modules/matrix";

describe("commands", () => {
  beforeEach(() => {
    vi.spyOn(matrix, "startMatrix").mockImplementation(() => {});
  });

  it("creates a commands object with all expected keys", () => {
    const commands = createCommands();
    const expectedKeys = [
      "help",
      "about",
      "skills",
      "projects",
      "contact",
      "clear",
      "secret",
      "matrix",
      "konami",
      "coffee",
      "hack",
      "sudo",
      "ls",
      "pwd",
      "whoami",
      "date",
      "exit",
      "vim",
      "emacs",
      "npx yoren",
      "yoren",
      "./yoren",
      "node yoren",
    ];
    for (const key of expectedKeys) {
      expect(commands[key]).toBeDefined();
    }
  });

  it("help returns an array of line data", () => {
    const commands = createCommands();
    const result = commands["help"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("about returns an array", () => {
    const commands = createCommands();
    const result = commands["about"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("skills returns an array", () => {
    const commands = createCommands();
    const result = commands["skills"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("projects returns an array", () => {
    const commands = createCommands();
    const result = commands["projects"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("contact returns an array", () => {
    const commands = createCommands();
    const result = commands["contact"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("clear returns 'CLEAR'", () => {
    const commands = createCommands();
    expect(commands["clear"]()).toBe("CLEAR");
  });

  it("secret returns an array with hidden commands", () => {
    const commands = createCommands();
    const result = commands["secret"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("matrix calls startMatrix and returns array", () => {
    const commands = createCommands();
    const result = commands["matrix"]();
    expect(matrix.startMatrix).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
  });

  it("konami returns an array", () => {
    const commands = createCommands();
    const result = commands["konami"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("coffee returns ASCII art", () => {
    const commands = createCommands();
    const result = commands["coffee"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("hack returns a joke response", () => {
    const commands = createCommands();
    const result = commands["hack"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("sudo returns permission denied", () => {
    const commands = createCommands();
    const result = commands["sudo"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("ls returns file listing", () => {
    const commands = createCommands();
    const result = commands["ls"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("pwd returns path", () => {
    const commands = createCommands();
    const result = commands["pwd"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("whoami returns visitor info", () => {
    const commands = createCommands();
    const result = commands["whoami"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("date returns current date", () => {
    const commands = createCommands();
    const result = commands["date"]();
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      const dateStr = result.find((l) => l.text && l.text.trim().length > 0);
      expect(dateStr).toBeDefined();
    }
  });

  it("exit returns no escape message", () => {
    const commands = createCommands();
    const result = commands["exit"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("vim returns trapped message", () => {
    const commands = createCommands();
    const result = commands["vim"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("emacs returns operating system joke", () => {
    const commands = createCommands();
    const result = commands["emacs"]();
    expect(Array.isArray(result)).toBe(true);
  });

  it("npx yoren variants return NPX_YOREN", () => {
    const commands = createCommands();
    expect(commands["npx yoren"]()).toBe("NPX_YOREN");
    expect(commands["yoren"]()).toBe("NPX_YOREN");
    expect(commands["./yoren"]()).toBe("NPX_YOREN");
    expect(commands["node yoren"]()).toBe("NPX_YOREN");
  });
});
