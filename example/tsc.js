const { spawn } = require('child_process')
const path = require('path')
const readline = require('readline')
const fs = require('fs')

const composeFilter = require('../lib/composeFilter')
const ddf = require('../lib/defaultDiagnosticFilter')

function readlines(file) {
  return fs.readFileSync(file, 'utf8').split(/\n+/).map(s => s.trim()).filter(Boolean)
}

function getArgs(options) {
  const args = []
  if (options.entryConfig) {
    const confPath = path.resolve(options.entryConfig)
    const confDir = path.dirname(confPath)
    args.push(
      ...readlines(confPath).map(f => path.resolve(confDir, f))
    )
  }
  args.push('--module', options.module)
  args.push('--target', options.target)
  if (options.allowJs) {
    args.push('--allowJs')
  }
  if (options.checkJs) {
    args.push('--checkJs')
  }
  let typeRoots = options.typeRoots
  if (options.defaultTypes) {
    typeRoots = typeRoots.map(f => path.resolve(f))
    typeRoots.push(path.resolve(__dirname, '../lib/api-typings'))
    const typesPath = path.resolve('node_modules/@types')
    if (typeRoots.indexOf(typesPath) === -1) {
      typeRoots.push(typesPath)
    }
  }
  args.push('--typeRoots', typeRoots.join(','))
  args.push('--noEmit')
  args.push(...options.args)
  return args
}

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

function createDiagnosticsFilter({ ignore, only, diagnosticFilter, defaultDiagnosticFilter }) {
  const filters = [
    createWhitelistFilter(only),
    createBlacklistFilter(ignore)
  ]
  if (diagnosticFilter) {
    filters.push(require(path.resolve(diagnosticFilter)))
  }
  if (defaultDiagnosticFilter) {
    //filters.push(ddf)
  }
  return composeFilter(filters)
}

module.exports = function (options) {
  const tsc = spawn(
    path.resolve(__dirname, '../node_modules/typescript/bin/tsc'),
    getArgs(options)
  )
  const rl = readline.createInterface({
    input: tsc.stdout,
    // output: process.stdout
  })
  let errors = 0
  let needOutput = false
  const filter = createDiagnosticsFilter(options)
  rl.on('line', line => {
    const matches = line.match(/ TS(\d{4}):/)
    const code = matches && matches[1]
    if (code) {
      const file = line.slice(0, line.indexOf('('))
      if (filter({ code, file, firstline: line })) {
        needOutput = true
        errors++
        //console.log(errors, line)
      } else {
        needOutput = false
      }
    } else if (needOutput) {
      //console.log(line)
    } else {
      console.log(line)
    }
  })
  rl.on('close', () => {
    if (errors) process.exit(1)
  })
}
