const path = require('path')
const defaultTypes = ['api', 'component']
const createCanIUseInterface = require('../')

function getInfo(type, name) {
  const conf = getConfByType(type)
  if (conf[name]) {
    const { version, href } = conf[name]
    return { name, type, version, href }
  }
  return null
}

function getConfByType(type) {
  return require(`../config/${type}.json`)
}

function curriedCaniuse({ defaultConfig, configPaths, targetVersion }) {
  const configurations = configPaths.map(f => require(path.resolve(f)))
  if (defaultConfig) {
    configurations.unshift(require('../config'))
  }
  return createCanIUseInterface(handleConfigurations(configurations))(targetVersion)
}

function handleConfigurations(confs) {
  const configurations = defaultTypes.reduce((o, t) => {
    o[t] = Object.create(null)
    return o
  }, Object.create(null))
  const hooks = defaultTypes.reduce((o, t) => {
    o[getHookName(t)] = (...confs) => Object.assign(configurations[t], ...confs)
    return o
  }, Object.create(null))

  confs.forEach(conf => {
    if (!conf) return

    if (typeof conf === 'function') return conf(hooks)

    Object.keys(conf).forEach(type => {
      if (defaultTypes.includes(type)) {
        hooks[getHookName(type)](conf[type])
      }
    })
  })

  function getHookName(str) {
    return 'use' + str[0].toUpperCase() + str.slice(1)
  }

  return configurations
}

module.exports = {
  getInfo,
  defaultTypes,
  curriedCaniuse
}
