const { spawn } = require('child_process')
const path = require('path')
const readline = require('readline')
const fs = require('fs')

function readlines(file) {
  return fs.readFileSync(file, 'utf8').split(/\n+/).map(s => s.trim()).filter(Boolean)
}

function handleArgs(options) {
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
    typeRoots = typeRoots.concat(path.resolve(__dirname, '../lib/api-typings'))
  }
  args.push('--typeRoots', typeRoots.join(','))
  args.push('--noEmit')
  args.push(...options.args)
  return args
}

function createCodeFilter({ ignoreCode, onlyCode, codeConfig }) {
  const matchCode = line => {
    let matches = line.match(/ TS(\d{4}):/)
    return matches && matches[1]
  }

  const whitelist = [...onlyCode]
  const blacklist = [...ignoreCode]
  if (codeConfig) {
    readlines(codeConfig).forEach(s => {
      if (s[0] === '!') {
        blacklist.push(s.slice(1))
      } else {
        whitelist.push(s)
      }
    })
  }

  return line => {
    let code = matchCode(line)
    if (whitelist.length && whitelist.indexOf(code) === -1) return false
    if (blacklist.length && blacklist.indexOf(code) > -1) return false
    return true
  }
}

module.exports = function (options) {
  const args = handleArgs(options)
  const tsc = spawn(path.resolve(__dirname, '../node_modules/typescript/bin/tsc'), args)
  const rl = readline.createInterface({
    input: tsc.stdout,
    // output: process.stdout
  })
  let lines = 0
  const codeFilter = createCodeFilter(options)
  rl.on('line', line => {
    if (codeFilter(line)) {
      lines++
      console.log(lines, line)
    }
  })
  rl.on('close', () => {
    if (lines) {
      process.exit(1)
    }
  })
}
