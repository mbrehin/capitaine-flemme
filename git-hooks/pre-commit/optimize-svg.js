#!/usr/bin/env node
const {
  colorizedLogTitle,
  exec,
  getStagedFiles,
  loadPackageJSON,
  pathFromRoot,
} = require('../utils')

const PRESETS = {
  'pre-commit': [
    'cleanupAttrs',
    'removeDoctype',
    'removeXMLProcInst',
    'removeMetadata',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeEmptyText',
    'removeEmptyContainers',
    'cleanupEnableBackground',
    'minifyStyles',
    'convertColors',
    'convertPathData',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'cleanupNumericValues',
    'collapseGroups',
    'sortAttrs',
    'removeDimensions',
  ],
}
const hookTitle = 'Optimizing SVGs'

const svgoPath = pathFromRoot(['node_modules', '.bin', 'svgo'])

// Loop over staged SVG files and apply optimization on them.
async function run() {
  const files = await getStagedFiles()
  // Only keep SVG files
  svgFiles = files.filter((fileName) => /\.svg$/.test(fileName)).join(' ')

  if (!svgFiles.length) {
    colorizedLogTitle('success', hookTitle, 'no SVG detected')
    return
  }

  const { plugins } = loadConfFromPackage()
  let pluginOpt
  if (plugins.length) {
    pluginsOpt = `--enable=${plugins.join(',')}`
  }
  exec(`${svgoPath} ${pluginsOpt} ${svgFiles}`)
  exec(`git add ${svgFiles}`)
  colorizedLogTitle('success', hookTitle, 'Done! 👏')
}

// Load configuration from `package.json`.
// Expected configuration is `svgo`.
//
// Example:
// ```JSON
//  "svgo": {
//    "presets": ["pre-commit"],
//    "enable": ["removeDesc"],
//    "disable": ["cleanupAttrs"]
//  }
// ```
function loadConfFromPackage() {
  const {
    svgo: {
      plugins: { presets, enable, disable },
    },
  } = loadPackageJSON()
  let plugins = []

  if (presets) {
    plugins.push(...PRESETS[presets])
  }
  if (enable) {
    plugins.push(...enable)
  }
  if (disable) {
    plugins = plugins.filter((plugin) => !disable.includes(plugin))
  }

  return { plugins: Array.from(new Set(plugins)) }
}

run()
