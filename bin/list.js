const { createCanIUseInterface, getVersion } = require('../')()
const { spawn } = require('child_process')
const readline = require('readline')

module.exports = function ({ targetVersion, args }) {
  const caniuse = createCanIUseInterface(targetVersion)
  // git grep -nowE "wx\.\w+"

  const params = [ 'grep', '-nowE', 'wx\\.\\w+' ]
  if (args.length) {
    params.push('--', ...args)
  }

  const grep = spawn('git', params)

  const rl = readline.createInterface({
    input: grep.stdout,
    //output: process.stdout
  })

  let disallowed = 0
  rl.on('line', line => {
    const api = line.trim().split(':').pop()
    if (api && caniuse(api)) return
    disallowed++
    console.log(line, `available after version ${getVersion(api)}`)
  })
  rl.on('close', () => {
    console.log(`${disallowed} api invocations disallowed`)
    if (disallowed) {
      process.exit(1)
    }
  })
}

function createGrepPattern(disallowedComp) {
  const pat = disallowedComp.map(s => `<${s}`)
  return `(${pat.join('|')})[^-_0-9a-zA-Z]+`
}
