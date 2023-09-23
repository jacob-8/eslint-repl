import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

let terminal: Terminal
let fitAddon: FitAddon

export function getTerminal() {
  if (terminal)
    return { terminal, fitAddon }

  terminal = new Terminal({
    convertEol: true,
    cursorBlink: true,
    disableStdin: false,
  })
  fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)
  return { terminal, fitAddon }
}
