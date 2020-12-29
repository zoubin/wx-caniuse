const path = require('path')
const tsc = require('../lib/tsc')

function createWhitelistFilter(whitelist) {
  return ({ code }, next) => {
    if (whitelist.length && whitelist.indexOf(code) === -1) return false
    return next()
  }
}
function createBlacklistFilter(blacklist) {
  return ({ code }, next) => {
    if (blacklist.length && blacklist.indexOf(code) > -1) return false
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

module.exports = function (options) {
  let entries = options.args.map(e => path.resolve(e))
  let compilerOptions = {}
  let diagnosticFilter = []
  const tscOptions = { compilerOptions, diagnosticFilter }

  if (options.only) {
    diagnosticFilter.push(createWhitelistFilter(options.only))
  }
  if (options.ignore) {
    diagnosticFilter.push(createBlacklistFilter(options.ignore))
  }
  if (options.configFile) {
    const confPath = path.resolve(options.configFile)
    const confDir = path.dirname(confPath)
    const config = require(confPath)

    if (config.entries) {
      entries = entries.concat(config.entries.map(e => path.resolve(confDir, e)))
    }
    if (config.compilerOptions) {
      Object.assign(compilerOptions, config.compilerOptions)
      if (compilerOptions.typeRoots) {
        compilerOptions.typeRoots = compilerOptions.typeRoots.map(e => path.resolve(confDir, e))
      }
    }
    if (config.diagnosticFilter) {
      diagnosticFilter = diagnosticFilter.concat(config.diagnosticFilter)
    }
    if (config.formatter) {
      tscOptions.formatter = config.formatter
    }
  }
  compilerOptions.typeRoots = [].concat(compilerOptions.typeRoots, options.typeRoots).filter(Boolean)
  if (options.defaultTypes) {
    compilerOptions.typeRoots.push(
      path.resolve('node_modules/@types'),
      path.resolve(__dirname, '../lib/types')
    )
  }
  if (options.defaultDiagnosticFilter) {
    diagnosticFilter.push(require('../lib/defaultDiagnosticFilter'))
  }
  if (options.onlyFile) {
    tscOptions.formatter = fileFormatter
  }

  const n = tsc(entries, tscOptions)
  //console.log(`Found ${n} diagnostics`)
  process.exit(n > 0 ? 1 : 0)
}
