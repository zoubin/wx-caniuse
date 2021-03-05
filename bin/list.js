const config = require('../config/wx.api.json')
const compare = require('../lib/compare')

module.exports = function ({ ver, regex }) {
  const names = Object.keys(config)
    .filter(s => s.startsWith('wx.'))
    .filter(name => {
      const { version, pluginVerion } = config[name]
      name = name.slice(3)
      if (ver && compare(ver, version || '0') < 0) return false
      if (regex) {
        const blacklist = regex.filter(s => s.startsWith('!'))
        if (blacklist.some(r => (new RegExp(r.slice(1))).test(name))) return false
        const whitelist = regex.filter(s => !s.startsWith('!'))
        return whitelist.length ? whitelist.every(r => (new RegExp(r)).test(name)) : true
      }
      return true
    })
  console.log(names.join('\n'))
}
