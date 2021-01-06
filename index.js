const compare = require('./lib/compare')

module.exports = function (conf) {
  conf = conf || require('./lib/api.json')
  return {
    getVersion: api => conf[api] && conf[api].version,
    createCanIUseInterface: ver => api => conf[api] && compare(conf[api].version, ver) <= 0,
    whitelist: ver => Object.keys(conf).filter(api => compare(conf[api].version, ver) <= 0),
    blacklist: ver => Object.keys(conf).filter(api => compare(conf[api].version, ver) > 0),
  }
}
