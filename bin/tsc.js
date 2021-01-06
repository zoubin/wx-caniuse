const path = require('path')
const fs = require('fs')
const tsc = require('../lib/tsc')
const { pageDeps } = require('../lib/page-deps')

function createWhitelistFilter(whitelist) {
  return ({ code }, next) => {
    if (!whitelist.includes(code)) return false
    return next()
  }
}
function createBlacklistFilter(blacklist) {
  return ({ code }, next) => {
    if (blacklist.includes(code)) return false
    return next()
  }
}
function fileFormatter(diagnostics) {
  const results = {}
  diagnostics.forEach(({ file }) => {
    file = path.relative(process.cwd(), file)
    results[file] = (results[file] || 0) + 1
  })
  console.log(results)
}

function readConfigFile(file) {
  const confPath = path.resolve(file)
  const confDir = path.dirname(confPath)
  const config = require(path.resolve(file))

  const projectRoot = config.projectRoot = config.projectRoot || confDir
  const resolve = e => path.resolve(projectRoot, e)
  if (config.entries) {
    config.entries = config.entries.map(resolve)
  }
  if (config.compilerOptions && config.compilerOptions.typeRoots) {
    config.compilerOptions.typeRoots = config.compilerOptions.typeRoots.map(resolve)
  }
  return config
}

function parseCommandline(options) {
  const resolve = e => path.resolve(e)

  let entries = options.args.map(resolve)
  let extensions = options.extensions
  const compilerOptions = { typeRoots: [] }
  const diagnosticFilter = []
  const tscOptions = { compilerOptions, diagnosticFilter }

  let projectRoot = options.projectRoot

  if (options.configFile) {
    const config = readConfigFile(options.configFile)
    if (config.entries) {
      entries.push(...config.entries)
    }
    projectRoot = config.projectRoot
    if (config.extensions) {
      extensions = config.extensions
    }
    if (config.compilerOptions) {
      Object.assign(compilerOptions, config.compilerOptions)
    }
    if (config.diagnosticFilter) {
      diagnosticFilter.push(...config.diagnosticFilter)
    }
    if (config.formatter) {
      tscOptions.formatter = config.formatter
    }
  }

  if (options.onlyFile) {
    tscOptions.formatter = fileFormatter
  }

  compilerOptions.typeRoots.push(...options.typeRoots.map(resolve))
  if (options.defaultTypes) {
    compilerOptions.typeRoots.push(
      path.resolve('node_modules/@types'),
      path.resolve(__dirname, '../lib/types')
      //path.resolve(__dirname, '../example/api-typings')
    )
  }

  if (options.only.length) {
    diagnosticFilter.push(createWhitelistFilter(options.only.map(n => +n)))
  }
  if (options.ignore.length) {
    diagnosticFilter.push(createBlacklistFilter(options.ignore.map(n => +n)))
  }
  if (options.defaultDiagnosticFilter) {
    diagnosticFilter.push(require('../lib/defaultDiagnosticFilter'))
  }

  const pages = []
  entries = entries.filter(e => {
    if (isPage(e)) {
      pages.push(e)
      return false
    }
    return true
  })
  if (pages.length) {
    const resolved = {}
    const failed = []
    pageDeps(pages, { projectRoot, resolved, failed })
    if (failed.length) {
      console.error(`Failed to resolve pages: ${failed}`)
      process.exit(1)
    }
    const services = Object.keys(resolved).map(e => resolvePageJs(e, extensions))
    entries.push(...services)
  }

  return { entries, tscOptions }
}

function isPage(p) {
  return !fs.existsSync(p)
}

function resolvePageJs(page, extensions) {
  for (let ext of extensions) {
    let file = page + ext
    if (fs.existsSync(file)) return file
  }
  throw new Error(`Cannot find JS for page ${page} with extensions ${extensions}`)
}

module.exports = function (options) {
  const { entries, tscOptions } = parseCommandline(options)
  const n = tsc(entries, tscOptions)
  //console.log(`Found ${n} diagnostics`)
  process.exit(n > 0 ? 1 : 0)
}
