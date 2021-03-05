const config = require('../config/wx.api.json')
const path = require('path')
const { execSync } = require('child_process')
module.exports = function (name) {
  if (!config[name]) name = `wx.${name}`
  if (config[name]) {
    execSync(`${path.join(__dirname, 'wx-caniuse-open')} ${config[name].href}`)
  }
}
