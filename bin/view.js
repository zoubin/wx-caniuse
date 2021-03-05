const config = require('../config/wx.api.json')

module.exports = function (name, moreNames) {
  const target = Object.create(config)
  Object.keys(config).forEach(name => {
    const lowerName = name.toLowerCase();
    if (!config[lowerName]) target[lowerName] = config[name]
  })
  ;[].concat(name, moreNames).filter(Boolean).forEach(name => {
    name = name.toLowerCase();
    if (!target[name]) name = `wx.${name}`
    if (target[name]) {
      const o = target[name]
      console.log(`Name\t\t${o.api}`)
      console.log(`Version\t\t${o.version || 0}`)
      console.log(`Plugin Version\t${o.pluginVersion || 'unknown'}`)
      console.log(`Location\t${o.href}`)
      console.log(`Description\t${o.text}\n`)
    }
  })
}
