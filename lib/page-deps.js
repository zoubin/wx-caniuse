const path = require('path')
const fs = require('fs')
const ts = require('typescript')

class Resolver {
  constructor({ baseUrl, paths, cache, projectRoot }) {
    // resolve paths
    this.baseUrl = baseUrl ? path.resolve(baseUrl) : process.cwd()
    this.paths = paths
    this.cache = cache || Object.create(null)
    // resolve page paths starting with '/'
    this.projectRoot = typeof projectRoot === 'string' ? path.resolve(projectRoot) : projectRoot
  }

  getProjectRoot(page) {
    if (typeof this.projectRoot === 'function') {
      return path.resolve(this.projectRoot(page))
    }
    return this.projectRoot || this.baseUrl
  }

  readPageConf(p) {
    return require(`${p}.json`)
  }

  pageExists(page) {
    try {
      return this.readPageConf(page)
    } catch (e) {
      return false
    }
  }

  resolvePath(page, parent) {
    if (page.startsWith('/')) {
      return path.join(this.getProjectRoot(parent), page)
    }
    if (page.startsWith('./') || page.startsWith('../')) {
      return path.resolve(path.dirname(parent), page)
    }
    let resolved
    if (this.paths) {
      let matchedPattern = ts.matchPatternOrExact(ts.getOwnKeys(this.paths), page)
      let matchedStar_1 = ts.isString(matchedPattern) ? undefined : ts.matchedText(matchedPattern, page)
      let matchedPatternText = ts.isString(matchedPattern) ? matchedPattern : ts.patternText(matchedPattern)
      resolved = ts.forEach(this.paths[matchedPatternText], subst => {
        let path = matchedStar_1 ? subst.replace('*', matchedStar_1) : subst
        let candidate = ts.normalizePath(ts.combinePaths(this.baseUrl, path))
        return this.pageExists(candidate) && candidate
      })
    }
    if (resolved) return resolved
    throw new Error(`Cannot resolve page path: ${page}`)
  }

  reset(opts) {
    return Object.assign(this, opts)
  }

  resolve(page) {
    if (this.cache[page]) return this.cache[page]

    const conf = this.readPageConf(page)
    const deps = this.cache[page] = {}

    if (conf.usingComponents) {
      const originalDeps = conf.usingComponents || {}
      Object.keys(originalDeps).forEach(dep => {
        const resolved = this.resolvePath(originalDeps[dep], page)
        deps[dep] = resolved
        this.resolve(resolved)
      })
    }

    return deps
  }
}

function visit(entries, map, visited = Object.create(null)) {
  entries = entries.filter(e => !visited[e])

  entries.forEach(e => {
    visited[e] = true
    if (!map[e]) throw new Error(`File ${e} not found.`)
    visit(Object.values(map[e]), map, visited)
  })

  return Object.keys(visited)
}


function pageDeps(pages, resolverOptions, resolverHoist) {
  let resolver = new Resolver(resolverOptions)
  if (typeof resolverHoist === 'function') {
    resolver = resolverHoist(resolver)
  }
  let entries = [].concat(pages).map(p => path.resolve(resolver.baseUrl, p))
  entries.forEach(page => resolver.resolve(page))
  return visit(entries, resolver.cache)
}

module.exports = pageDeps
module.exports.Resolver = Resolver
