import { sleep, createSpan } from "./utils";
import { playBeep, playKeySound, playEnterSound } from "./sound";
import { createCommands, type LineData } from "./commands";

const MAX_INPUT_LENGTH = 256;
const MAX_TERMINAL_LINES = 200;

export const introLines: LineData[] = [
  { type: "dim", text: "> Connection established" },
  { type: "dim", text: "> Initializing session..." },
  { type: "out", text: "" },
  {
    type: "prompt",
    text: "yoren@localhost:~$ ",
    cmd: "neofetch --minimal",
  },
  { type: "out", text: "" },
  {
    type: "parts",
    parts: [
      { text: "  USER     ", cls: "dim" },
      { text: "yoren", cls: "hl" },
    ],
  },
  {
    type: "parts",
    parts: [
      { text: "  ROLE     ", cls: "dim" },
      { text: "developer / maker / internet dweller", cls: "out" },
    ],
  },
  {
    type: "parts",
    parts: [
      { text: "  SHELL    ", cls: "dim" },
      { text: "zsh with too many aliases", cls: "out" },
    ],
  },
  {
    type: "parts",
    parts: [
      { text: "  EDITOR   ", cls: "dim" },
      { text: "VS Code (mostly its variants)", cls: "out" },
    ],
  },
  {
    type: "parts",
    parts: [
      { text: "  UPTIME   ", cls: "dim" },
      { text: "since dial-up days", cls: "out" },
    ],
  },
  { type: "out", text: "" },
  {
    type: "prompt",
    text: "yoren@localhost:~$ ",
    cmd: "cat /etc/motd",
  },
  { type: "out", text: "" },
  {
    type: "out",
    text: '  "Any sufficiently advanced technology',
  },
  {
    type: "out",
    text: "   is indistinguishable from a hack.",
  },
  {
    type: "parts",
    parts: [
      { text: '   that actually works."  ', cls: "out" },
      { text: "- me, probably", cls: "dim" },
    ],
  },
  { type: "out", text: "" },
  {
    type: "parts",
    parts: [
      { text: "  Type ", cls: "dim" },
      { text: "help", cls: "hl" },
      { text: " for available commands", cls: "dim" },
    ],
  },
  { type: "out", text: "" },
];

export function createLine(lineData: LineData): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "output-line";

  if (lineData.type === "parts" && lineData.parts) {
    for (const part of lineData.parts) {
      div.appendChild(createSpan(part.text, part.cls));
    }
  } else if (lineData.type === "prompt") {
    div.appendChild(createSpan(lineData.text ?? "", "prompt"));
    if (lineData.cmd) {
      div.appendChild(createSpan(lineData.cmd, "cmd"));
    }
  } else {
    div.appendChild(createSpan(lineData.text || "\u00A0", lineData.type));
  }

  return div;
}

export function trimTerminalLines(terminalContent: HTMLElement): void {
  while (terminalContent.children.length > MAX_TERMINAL_LINES) {
    terminalContent.removeChild(terminalContent.firstChild!);
  }
}

export async function runNpxYoren(
  terminalContent: HTMLElement,
): Promise<void> {
  const lines = [
    { text: "", cls: "out", delay: 0 },
    {
      text: "  ╭──────────────────────────────────────╮",
      cls: "accent",
      delay: 50,
    },
    {
      text: "  │                                      │",
      cls: "accent",
      delay: 30,
    },
    {
      text: "  │   luke, I am not your father         │",
      cls: "out",
      delay: 40,
    },
    {
      text: "  │                                      │",
      cls: "accent",
      delay: 30,
    },
    {
      text: "  │   Visit https://yoren.sh             │",
      cls: "hl",
      delay: 40,
    },
    {
      text: "  │                                      │",
      cls: "accent",
      delay: 30,
    },
    {
      text: "  ╰──────────────────────────────────────╯",
      cls: "accent",
      delay: 50,
    },
    { text: "", cls: "out", delay: 0 },
  ];

  for (const line of lines) {
    const el = document.createElement("div");
    el.className = "output-line";
    el.style.whiteSpace = "pre";
    el.style.fontFamily = "monospace";
    const span = document.createElement("span");
    span.className = line.cls;
    span.textContent = line.text;
    el.appendChild(span);
    terminalContent.appendChild(el);
    terminalContent.scrollTop = terminalContent.scrollHeight;
    if (line.delay) {
      playBeep(200 + Math.random() * 100, 0.02, 0.02);
      await sleep(line.delay);
    }
  }
}

export async function typeIntro(
  terminalContent: HTMLElement,
  cmdInput: HTMLInputElement,
): Promise<void> {
  await sleep(800);
  for (const line of introLines) {
    terminalContent.appendChild(createLine(line));
    terminalContent.scrollTop = terminalContent.scrollHeight;
    await sleep(60);
  }
  cmdInput.focus();
}

export function resizeInput(cmdInput: HTMLInputElement): void {
  const len = cmdInput.value.length;
  cmdInput.style.width = len + "ch";
}

export function initTerminal(): void {
  const terminalContent = document.getElementById("terminalContent");
  const cmdInput = document.getElementById("cmdInput") as HTMLInputElement | null;

  if (!terminalContent || !cmdInput) return;

  const commands = createCommands();

  cmdInput.setAttribute("maxlength", String(MAX_INPUT_LENGTH));

  cmdInput.addEventListener("keydown", async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const cmd = cmdInput.value.trim().toLowerCase();
      cmdInput.value = "";
      resizeInput(cmdInput);
      playEnterSound();

      const cmdLine = document.createElement("div");
      cmdLine.className = "output-line";
      cmdLine.appendChild(createSpan("visitor@yoren.sh:~$ ", "prompt"));
      cmdLine.appendChild(createSpan(cmd || "\u00A0", "cmd"));
      terminalContent.appendChild(cmdLine);

      if (cmd) {
        const handler = commands[cmd];
        if (handler) {
          const result = handler();
          if (result === "CLEAR") {
            terminalContent.textContent = "";
          } else if (result === "NPX_YOREN") {
            await runNpxYoren(terminalContent);
          } else {
            for (const line of result) {
              terminalContent.appendChild(createLine(line));
              await sleep(30);
            }
          }
        } else {
          const errLine = createLine({
            type: "dim",
            text: "  Command not found: " + cmd,
          });
          terminalContent.appendChild(errLine);
          const hintLine = document.createElement("div");
          hintLine.className = "output-line";
          hintLine.appendChild(createSpan("  Type ", "dim"));
          hintLine.appendChild(createSpan("help", "hl"));
          hintLine.appendChild(createSpan(" for commands", "dim"));
          terminalContent.appendChild(hintLine);
        }
      }

      trimTerminalLines(terminalContent);
      terminalContent.scrollTop = terminalContent.scrollHeight;
    } else {
      playKeySound();
    }
  });

  cmdInput.addEventListener("input", () => resizeInput(cmdInput));
  resizeInput(cmdInput);

  document
    .querySelector(".terminal-section")
    ?.addEventListener("click", () => cmdInput.focus());
}
