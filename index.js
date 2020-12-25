const compare = require('./lib/compare')

module.exports = config => version => type => name => {
  let res = 0
  if (name in config[type]) {
    let o = config[type][name]
    let v = ['string', 'number'].indexOf(typeof o) > -1 ? o : o.version
    res = compare(version, v) >= 0 ? 1 : -1
  }
  return {
    ok: res === 1,
    notOk: res === -1,
    unknown: res === 0
  }
}
