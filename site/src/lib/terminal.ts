import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import "xterm/css/xterm.css";

export const terminal = new Terminal({
  convertEol: true,
  cursorBlink: true,
  disableStdin: false,
});

export const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
