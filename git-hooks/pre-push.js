#!/usr/bin/env node

// Checks for staged JS files matching Jest coverage configuration
// from `package.json`.  When there is any matching file, run
// stats coverage update and check for regression.

const minimatch = require('minimatch')

const {
  colorizedLogTitle,
  largeOutputExec,
  logAndExitWithTitle,
} = require('./lib/utils')

const exec = (command, options = {}) =>
  largeOutputExec(command, options).catch(logAndExit)

const hookTitle = 'pre-push'
const config = require('../package.json')

// Commands
const gitListStagedFiles = 'git diff @{u} --name-only --diff-filter=ACM'
const jestCoverage = 'jest-coverage-ratchet && jest --bail --coverage'

async function run() {
  const { stdout } = await exec(gitListStagedFiles)
  // Manage files, remove empty lines from `git diff` result
  const files = stdout.split('\n').filter(Boolean)

  // Only runs coverage check when there is a coverage config set
  // and staged files include Jest targeted files.
  if (config.jest && config.jest.collectCoverageFrom) {
    const jsPah = config.jest.collectCoverageFrom[0]
    const filesMatch = minimatch.match(files, jsPah, { matchBase: true })

    // If there is any staged file matching jest coverage config,
    // then run coverage stats update and check for coverage regression
    if (filesMatch.length > 0) {
      await exec(jestCoverage, { cwd: './' })
      colorizedLogTitle(
        'success',
        hookTitle,
        'everything went fine! Good job! 👏'
      )
    }
  }
}

// Wrap generic function inside custom function that loads current hook title
function logAndExit(err) {
  logAndExitWithTitle(err, hookTitle)
}

run()
