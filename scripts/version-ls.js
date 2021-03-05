const maxVer = '2.4'
const compare = require('../lib/compare')
const wxApi = require('../lib/wx.api.json')
Object.assign(wxApi, require('../lib/wx.api.patch.json'))
Object.keys(wxApi)
  .filter(api => compare(wxApi[api].version, maxVer) === -1)
  .forEach(api => console.log(`'${api.slice(3)}',`))

