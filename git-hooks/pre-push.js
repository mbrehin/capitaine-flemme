#!/usr/bin/env node

// Checks for staged JS files matching Jest coverage configuration
// from `package.json`.  When there is any matching file, run
// stats coverage update and check for regression.

const minimatch = require('minimatch')

const {
  colorizedLogTitle,
  exec,
  largeOutputExec,
  logAndExitWithTitle,
} = require('./utils')

const hookTitle = 'pre-push'
const config = require('../package.json')

// Commands
const gitCheckForUpstream = 'git rev-parse @{u}'
const gitUpdatedFiles = 'git diff @{u} --name-only --diff-filter=ACM'
const gitGetFirstNotPushedCommit = `git log HEAD --not --remotes --pretty=tformat:%h | tail -n 1`
const gitUpdatedFilesNoUpstream = `git diff \`${gitGetFirstNotPushedCommit}\`^ --name-only --diff-filter=ACM`
const jestCoverage = 'jest-coverage-ratchet && jest --bail --coverage'

async function run() {
  // If there is no existing upstream, we cannot run our diff using @{u},
  // we must use a fallback command.
  // We have to manage it with a `catch` due to error thrown:
  // `fatal: no upstream configured for branch 'TARGET_BRANCH'`.
  let command
  try {
    await largeOutputExec(gitCheckForUpstream)
    command = gitUpdatedFiles
  } catch (_) {
    colorizedLogTitle(
      'warning',
      hookTitle,
      'Cannot run pre-push checks: upstream is not configured yet!'
    )
    // Use fallback command instead
    command = gitUpdatedFilesNoUpstream
  }

  const { stdout } = await largeOutputExec(command)
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
      await exec(jestCoverage, hookTitle, { cwd: './' })
      colorizedLogTitle(
        'success',
        hookTitle,
        'everything went fine! Good job! 👏'
      )
    }
  }
}

run()
