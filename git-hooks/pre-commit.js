#!/usr/bin/env node
const {
  colorizedLogTitle,
  largeOutputExec,
  logAndExitWithTitle,
  printErrors,
} = require('./lib/utils')

// Parse staged files and look for custom patterns.
// If a searched pattern is found, then print an associated message.
// A searched pattern is blocking by default.
// That means an error code will be return when exiting script.
// For non blocking patterns, errors will be logged as warnings
// but won't stop commit.

const exec = (command) => largeOutputExec(command).catch(logAndExit)

// Git commands
const gitDiffBase = 'git diff --staged --diff-filter=ACM'
// List added or updated file names only
const gitDiff = `${gitDiffBase} --name-only`
// We don't use `git show :0:${file}` because we only want to
// process created or updated raws.
const gitShowStaged = (file) =>
  `${gitDiffBase} --unified=0 ${file} | grep "^+[^+]" | sed -E "s/^\\+\\s*//"`

const hookTitle = 'pre-commit'

// Patterns (regexps) to search inside new changes.
// Associated messages will be printed when pattern
// is matched in staged files contents.
// When a pattern is not blocking, then only print a
// warning, do not exit with error code.
// A pattern can be searched only on custom files
// described as a filter (regexp).
const patterns = [
  {
    message: 'You’ve got leftover conflict markers',
    regex: /^[<>|=]{4,}/m,
  },
  {
    filter: /\.js$/,
    message: 'You’ve got leftover `console.log`',
    regex: /console\.log/,
  },
  {
    message: 'You have unfinished devs',
    nonBlocking: true,
    regex: /(?:FIXME|TODO)/,
  },
]

// Run `diff --staged` only once per file and cache results
// for later use, then run patterns search.
async function run() {
  const { stdout } = await exec(gitDiff)
  // Manage files, remove empty lines from `git diff` result
  const files = stdout.split('\n').filter(Boolean)
  // Cache staged contents (prevent multiple `git show :0:<file>` call)
  const stagedContents = await readStagedContents(files)
  // Initialize errors and warning as empty arrays
  const groupedErrors = {}
  const groupedwarnings = {}

  for (const pattern of patterns) {
    const { errors, warnings } = parseContents({ pattern, stagedContents })
    if (errors.length) {
      groupedErrors[pattern.message] = errors
    }
    if (warnings.length) {
      groupedwarnings[pattern.message] = warnings
    }
  }

  printErrors('warn', groupedwarnings, hookTitle)
  if (printErrors('error', groupedErrors, hookTitle)) {
    process.exit(1)
  }
  colorizedLogTitle('success', hookTitle, 'everything went fine! Good job! 👏')
}

// Read one staged file content
async function readStagedContent(file) {
  const { stdout } = await exec(gitShowStaged(file))
  return { fileName: file, content: stdout }
}

// Load staged contents for later parsing.
// This won't load `pre-commit` files contents.
function readStagedContents(files) {
  return Promise.all(
    files.filter((file) => !/pre-commit$/.test(file)).map(readStagedContent)
  )
}

// Read staged files content and check if any pattern is matched.
// If so, then list filenames for error and/or warnings.
function parseContents({
  pattern: { filter, nonBlocking, regex },
  stagedContents,
}) {
  const errors = []
  const warnings = []

  for (const { content, fileName } of stagedContents) {
    // Skip file if it does not match filter (and skip self)
    if (filter && !filter.test(fileName)) {
      continue
    }
    if (!regex.test(content)) {
      continue
    }

    const container = nonBlocking ? warnings : errors
    container.push(fileName)
  }

  return { errors, warnings }
}

// Wrap generic function inside custom function that loads current hook title
function logAndExit(err) {
  logAndExitWithTitle(err, hookTitle)
}

run()
