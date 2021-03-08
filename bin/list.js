const compare = require('../lib/compare')

function test(regex, target) {
  return new RegExp(regex).test(target)
}

module.exports = function ({ ver, regex, onlyWx, component }) {
  const config = require(component ? '../config/component.json' : '../config/wx.api.json')
  const names = Object.keys(config)
    .filter(name => {
      const { version } = config[name]
      return !ver || !version || compare(ver, version) >= 0
    })
    .filter(name => {
      if (!regex || !regex.length) return true
      if (!component && onlyWx) {
        if (!name.startsWith('wx.')) return false
        name = name.slice(3)
      }
      const blacklist = regex.filter(s => s.startsWith('!')).map(s => s.slice(1))
      if (blacklist.some(r => test(r, name))) return false

      const whitelist = regex.filter(s => !s.startsWith('!'))
      return !whitelist.length || whitelist.some(r => test(r, name))
    })
  console.log(names.sort().join('\n'))
}
