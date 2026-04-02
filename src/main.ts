import "./style.css";
import { initSoundToggle } from "./modules/sound";
import { initCursor } from "./modules/cursor";
import { initEffects } from "./modules/effects";
import { runBoot } from "./modules/boot";
import { initTerminal, typeIntro } from "./modules/terminal";
import { initKonami } from "./modules/konami";
import { initSession } from "./modules/session";
import { initClipboard } from "./modules/clipboard";

initSoundToggle();
initCursor();
initEffects();
initTerminal();
initKonami();
initSession();
initClipboard();

const terminalContent = document.getElementById("terminalContent");
const cmdInput = document.getElementById("cmdInput") as HTMLInputElement | null;

runBoot().then(() => {
  if (terminalContent && cmdInput) {
    typeIntro(terminalContent, cmdInput);
  }
});
