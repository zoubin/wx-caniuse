const { defaultTypes, curriedCaniuse, getInfo } = require('./util')

module.exports = function (name, moreNames, options) {
  const names = [name].concat(moreNames)
  const curried = curriedCaniuse(options)
  const results = []
  const unknowns = []
  const checkers = defaultTypes.map(curried)
  names.forEach(name => {
    const res = checkers.map((caniuse, i) => {
      const type = defaultTypes[i]
      const r = caniuse(name)
      if (r.unknown) return
      const info = getInfo(type, name) || {}
      return {
        name, type, caniuse: r.ok ? '✔︎' : '✘',
        'target version': options.targetVersion,
        'earliest version': info.version,
        link: info.href
      }
    }).filter(Boolean)
    if (res.length) {
      results.push(...res)
    } else {
      unknowns.push(name)
    }
  })
  console.table(results)
  if (unknowns.length) {
    console.log(`${unknowns.length} of ${names.length} are unknown: ${unknowns}`)
  }
}

