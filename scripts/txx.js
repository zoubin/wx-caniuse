const apis = require('../lib/all-api.json')
const compare = require('../lib/compare')
console.log(
  JSON.stringify(
    Object.keys(apis)
      .filter(name => name.startsWith('wx.'))
      .sort((a, b) => compare(apis[a].version, apis[b].version))
      .reduce((o, name) => {
        const api = apis[name]
        o[name] = { version: api.version, url: api.href }
        return o
      }, {}),
    null,
    2
  )
);
