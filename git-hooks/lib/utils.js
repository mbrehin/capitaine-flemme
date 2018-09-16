const util = require('util')
const nodeExec = util.promisify(require('child_process').exec)

// Logs colors
const FG_GREEN = '\x1b[32m'
const FG_RED = '\x1b[31m'
const FG_YELLOW = '\x1b[33m'

// Print error with color depending on given severity.
// - error: red
// - warning: yellow
// - standard: green
function colorizedLog(logLevel, text) {
  // Colors code won’t be used if not in TTY
  if (!process.stderr.isTTY && !process.stdout.isTTY) {
    console.log(text)
    return
  }
  const color = logLevel === 'error' ? FG_RED : FG_YELLOW
  console[logLevel](`${color}%s\x1b[0m`, text)
}

// Print
function colorizedLogTitle(logLevel, hookTitle, text) {
  let coloredIcon
  if (logLevel === 'error') {
    coloredIcon = `${FG_RED}✖  ${hookTitle}\x1b[0m`
  } else if (logLevel === 'warning') {
    coloredIcon = `${FG_YELLOW}❗  ${hookTitle}\x1b[0m`
  } else {
    coloredIcon = `${FG_GREEN}✔  ${hookTitle}\x1b[0m`
  }
  console.log(`${coloredIcon}: ${text}`)
}

function largeOutputExec(command, options = {}) {
  return nodeExec(command, { maxBuffer: 1024 * 1024, ...options })
}

// Output an error using red color, then exit program
function logAndExitWithTitle(err, hookTitle) {
  colorizedLogTitle('error', hookTitle, `Couldn’t run 'exec' command: ${err}`)
  // EX_DATAERR (65): The input data was incorrect in some way
  process.exit(65)
}

// Loop over errors and print them.
// Each errors group will be prefixed by its message, ie.:
//
// ```
// === You’ve got leftover conflict markers ===
// File1
// File2
// ```
function printErrors(severity, errors, hookTitle) {
  const entries = Object.entries(errors)
  if (entries.length === 0) {
    return false
  }

  const title =
    severity === 'error'
      ? 'oops, something’s wrong!  😱\n'
      : 'there may be something to improve or correct!\n'
  colorizedLogTitle(severity, hookTitle, title)

  for (const [message, fileNames] of entries) {
    const title = `=== ${message} ===`
    const text = [title, ...fileNames].join('\n') + '\n'
    colorizedLog(severity, text)
  }

  return true
}

module.exports = {
  colorizedLogTitle,
  largeOutputExec,
  logAndExitWithTitle,
  printErrors,
}
