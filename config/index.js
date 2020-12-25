const apiPatches = {
  'wx.switchTab': 0,
  'wx.navigateTo': 0,
  'wx.navigateBack': 0,
  'wx.login': 0,
  'FileSystemManager.statSync': 0,
  'FileSystemManager.readFileSync': 0,
  'FileSystemManager.mkdirSync': 0,
  'FileSystemManager.rmdirSync': 0,
  'FileSystemManager.statSync': 0,
  'wx.redirectTo': 0
}

module.exports = function () {
  return {
    api: Object.assign({}, require('./api.json'), apiPatches),
    component: Object.assign({}, require('./component.json'))
  }
}
