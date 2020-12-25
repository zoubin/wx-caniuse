const defaultConfig = require('../config')()
const createCanIUseInterface = require('../')(defaultConfig)
const defaultComponentConfig = require('../config/component.json')
const { spawn } = require('child_process')
const readline = require('readline')

module.exports = function (options) {
  const caniuse = createCanIUseInterface(options.targetVersion)('component')
  const disallowedComp = Object.keys(defaultComponentConfig).filter(k => caniuse(k).notOk)

  let disallowed = 0
  const params = [ 'grep', '-noE', createGrepPattern(disallowedComp) ]
  const grep = spawn('git', params)
  const rl = readline.createInterface({
    input: grep.stdout,
    output: process.stdout
  })
  rl.on('line', line => {
    disallowed++
  })
  rl.on('close', () => {
    console.log(`${disallowed} component disallowed`)
    if (disallowed) {
      process.exit(1)
    }
  })
}

function createGrepPattern(disallowedComp) {
  const pat = disallowedComp.map(s => `<${s}`)
  return `(${pat.join('|')})[^-_0-9a-zA-Z]+`
}
