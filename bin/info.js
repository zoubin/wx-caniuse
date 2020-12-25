const { defaultTypes, getInfo } = require('./util')

module.exports = function (name) {
  const results = []
  defaultTypes.forEach(type => {
    const o = getInfo(type, name)
    if (o) {
      results.push({
        name, type,
        '最低基础库版本': o.version,
        '在线文档': o.href
      })
    }
  })
  console.table(results)
}
