const path = require('path')
const { execSync } = require('child_process')
module.exports = function (name, { component }) {
  const config = require(component ? '../config/component.json' : '../config/wx.api.json')
  if (!component && !config[name]) name = `wx.${name}`
  if (config[name]) {
    execSync(`${path.join(__dirname, 'wx-caniuse-open')} ${config[name].href}`)
  }
}
