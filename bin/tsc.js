const { spawn } = require('child_process')
const path = require('path')
const readline = require('readline')
const fs = require('fs')

function handleArgs(options) {
  const args = []
  if (options.entriesConfig) {
    const confPath = path.resolve(process.cwd(), options.entriesConfig)
    const contents = fs.readFileSync(confPath, 'utf8')
    const confDir = path.dirname(confPath)
    args.push(
      ...contents.split(/\n+/).map(s => s.trim()).filter(Boolean)
      .map(f => path.resolve(confDir, f))
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

module.exports = function (options) {
  const args = handleArgs(options)
  const tsc = spawn(path.resolve(__dirname, '../node_modules/typescript/bin/tsc'), args)
  const rl = readline.createInterface({
    input: tsc.stdout,
    output: process.stdout
  })
  let lines = 0
  rl.on('line', line => {
    lines++
  })
  rl.on('close', () => {
    if (lines) {
      console.log(`Found ${lines} failures`)
    }
  })
}
