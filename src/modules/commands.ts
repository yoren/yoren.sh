import { startMatrix } from "./matrix";

export interface LinePart {
  text: string;
  cls: string;
}

export interface LineData {
  type: string;
  text?: string;
  parts?: LinePart[];
  cmd?: string;
}

export type CommandResult = LineData[] | "CLEAR" | "NPX_YOREN";
export type CommandHandler = () => CommandResult;

export function createCommands(): Record<string, CommandHandler> {
  return {
    help: () => [
      { type: "out", text: "" },
      { type: "out", text: "  AVAILABLE COMMANDS:" },
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  help      ", cls: "hl" },
          { text: "show this message", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  about     ", cls: "hl" },
          { text: "who am i", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  skills    ", cls: "hl" },
          { text: "technical abilities", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  projects  ", cls: "hl" },
          { text: "things i've built", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  contact   ", cls: "hl" },
          { text: "reach out", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  npx yoren ", cls: "hl" },
          { text: "run the CLI card", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  clear     ", cls: "hl" },
          { text: "clear terminal", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  secret    ", cls: "hl" },
          { text: "???", cls: "dim" },
        ],
      },
      { type: "out", text: "" },
    ],
    about: () => [
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  ┌─ ", cls: "dim" },
          { text: "ABOUT", cls: "hl" },
          { text: " ─────────────────────────────┐", cls: "dim" },
        ],
      },
      {
        type: "out",
        text: "  │                                          │",
      },
      {
        type: "out",
        text: "  │  Developer by trade, tinkerer by nature. │",
      },
      {
        type: "out",
        text: "  │  I believe in shipping fast, breaking    │",
      },
      {
        type: "out",
        text: "  │  things thoughtfully, and documentation  │",
      },
      {
        type: "out",
        text: "  │  that actually helps.                    │",
      },
      {
        type: "out",
        text: "  │                                          │",
      },
      {
        type: "out",
        text: "  │  Currently obsessed with AI agents,      │",
      },
      {
        type: "out",
        text: "  │  developer experience, and making        │",
      },
      {
        type: "out",
        text: "  │  the terminal cool again.                │",
      },
      {
        type: "out",
        text: "  │                                          │",
      },
      {
        type: "parts",
        parts: [
          {
            text: "  └──────────────────────────────────────────┘",
            cls: "dim",
          },
        ],
      },
      { type: "out", text: "" },
    ],
    skills: () => [
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  LANGUAGES   ", cls: "hl" },
          { text: "TypeScript, Python, PHP, HTML", cls: "out" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  FRONTEND    ", cls: "hl" },
          { text: "React, Vue, Vanilla JS", cls: "out" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  BACKEND     ", cls: "hl" },
          { text: "Node.js, FastAPI, PostgreSQL", cls: "out" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  DEVOPS      ", cls: "hl" },
          { text: "Docker, Vercel, AWS, Cluudflare", cls: "out" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  INTERESTS   ", cls: "hl" },
          { text: "AI/ML, COOKING, CLI tools", cls: "out" },
        ],
      },
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  Currently leveling up: ", cls: "dim" },
          { text: "LLM agents & Solution Architect", cls: "accent" },
        ],
      },
      { type: "out", text: "" },
    ],
    projects: () => [
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  [01] ", cls: "dim" },
          { text: "yoren.sh", cls: "hl" },
        ],
      },
      { type: "dim", text: "       This website. You're looking at it." },
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  [02] ", cls: "dim" },
          { text: "yoren-cli", cls: "hl" },
        ],
      },
      {
        type: "dim",
        text: "       Run `npx yoren` in your terminal (soon)",
      },
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  [03] ", cls: "dim" },
          { text: "???", cls: "hl" },
        ],
      },
      { type: "dim", text: "       Something cool is cooking..." },
      { type: "out", text: "" },
      { type: "dim", text: "  More at github.com/yoren" },
      { type: "out", text: "" },
    ],
    contact: () => [
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  EMAIL    ", cls: "dim" },
          { text: "hi@yoren.sh", cls: "hl" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  GITHUB   ", cls: "dim" },
          { text: "github.com/yoren", cls: "out" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  TWITTER  ", cls: "dim" },
          { text: "@1fixdotio", cls: "out" },
        ],
      },
      { type: "out", text: "" },
      {
        type: "dim",
        text: "  DMs open. Email preferred for serious inquiries.",
      },
      { type: "out", text: "" },
    ],
    clear: () => "CLEAR",
    secret: () => [
      { type: "out", text: "" },
      { type: "accent", text: "  > ACCESS GRANTED" },
      { type: "out", text: "" },
      { type: "dim", text: "  Hidden commands unlocked:" },
      {
        type: "parts",
        parts: [
          { text: "  matrix    ", cls: "hl" },
          { text: "take the red pill", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  konami    ", cls: "hl" },
          { text: "↑↑↓↓←→←→BA", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  coffee    ", cls: "hl" },
          { text: "essential fuel", cls: "dim" },
        ],
      },
      {
        type: "parts",
        parts: [
          { text: "  hack      ", cls: "hl" },
          { text: "access mainframe", cls: "dim" },
        ],
      },
      { type: "out", text: "" },
    ],
    matrix: () => {
      startMatrix();
      return [{ type: "success", text: "  Entering the Matrix..." }];
    },
    konami: () => [
      { type: "out", text: "" },
      { type: "success", text: "  ★ KONAMI CODE ACCEPTED ★" },
      { type: "out", text: "" },
      { type: "out", text: "  +30 lives granted" },
      { type: "out", text: "  (not that you needed them)" },
      { type: "out", text: "" },
    ],
    coffee: () => [
      { type: "out", text: "" },
      { type: "out", text: "         ) )" },
      { type: "out", text: "        ( (" },
      { type: "out", text: "      ........" },
      { type: "out", text: "      |      |]" },
      { type: "out", text: "      \\      /" },
      { type: "out", text: "       `----'" },
      { type: "out", text: "" },
      {
        type: "parts",
        parts: [
          { text: "  CAFFEINE LEVEL: ", cls: "dim" },
          { text: "████████░░", cls: "success" },
          { text: " 80%", cls: "out" },
        ],
      },
      { type: "out", text: "" },
    ],
    hack: () => [
      { type: "out", text: "" },
      { type: "accent", text: "  ACCESSING MAINFRAME..." },
      { type: "dim", text: "  Bypassing firewall... done" },
      { type: "dim", text: "  Cracking encryption... done" },
      { type: "dim", text: "  Downloading secrets..." },
      { type: "out", text: "" },
      { type: "success", text: "  JK. This is a personal website." },
      { type: "dim", text: "  Nice try though :)" },
      { type: "out", text: "" },
    ],
    sudo: () => [
      { type: "out", text: "" },
      { type: "accent", text: "  Permission denied: nice try" },
      { type: "out", text: "" },
    ],
    ls: () => [
      { type: "out", text: "" },
      {
        type: "out",
        text: "  about.md  projects/  skills.json  .secrets/",
      },
      { type: "out", text: "" },
    ],
    pwd: () => [
      { type: "out", text: "" },
      { type: "out", text: "  /home/visitor/yoren.sh" },
      { type: "out", text: "" },
    ],
    whoami: () => [
      { type: "out", text: "" },
      {
        type: "out",
        text: "  visitor - a curious soul exploring the web",
      },
      { type: "out", text: "" },
    ],
    date: () => [
      { type: "out", text: "" },
      { type: "out", text: "  " + new Date().toString() },
      { type: "out", text: "" },
    ],
    exit: () => [
      { type: "out", text: "" },
      { type: "dim", text: "  There is no escape." },
      { type: "dim", text: "  (Try closing the tab instead)" },
      { type: "out", text: "" },
    ],
    vim: () => [
      { type: "out", text: "" },
      { type: "accent", text: "  You are now trapped in vim." },
      { type: "dim", text: "  Good luck." },
      { type: "out", text: "" },
    ],
    emacs: () => [
      { type: "out", text: "" },
      { type: "dim", text: "  A great operating system," },
      { type: "dim", text: "  lacking only a decent text editor." },
      { type: "out", text: "" },
    ],
    "npx yoren": () => "NPX_YOREN",
    yoren: () => "NPX_YOREN",
    "./yoren": () => "NPX_YOREN",
    "node yoren": () => "NPX_YOREN",
  };
}
