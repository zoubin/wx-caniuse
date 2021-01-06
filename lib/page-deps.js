const path = require('path')
const fs = require('fs')

function readPageConf(p) {
  try {
    return require(`${p}.json`)
  } catch (e) {
    return null
  }
}

function resolvePath(page, parent, root) {
  if (page.startsWith('/')) return path.join(root, page)
  return path.resolve(path.dirname(parent), page)
}

function resolvePage(
  page, entry,
  { projectRoot, resolved, failed },
  {
    readPageConf = exports.readPageConf,
    resolvePath = exports.resolvePath
  } = {}
) {
  if (failed.includes(page)) return
  if (resolved[page]) {
    return Object.assign(resolved[entry], resolved[page])
  }

  const conf = readPageConf(page)
  if (!conf) return failed.push(page)

  const deps = resolved[page] = {}

  if (!conf.usingComponents) return

  Object.values(conf.usingComponents).forEach(dep => {
    const resolvedPage = resolvePath(dep, page, projectRoot)
    deps[resolvedPage] = true
    resolved[entry][resolvedPage] = true
    resolvePage(
      resolvedPage, entry,
      { projectRoot, resolved, failed },
      { readPageConf, resolvePath }
    )
  })
}

function pageDeps(
  pages,
  { projectRoot = process.cwd(), resolved = {}, failed = [] },
  {
    resolvePage = exports.resolvePage,
    readPageConf = exports.readPageConf,
    resolvePath = exports.resolvePath
  } = {}
) {
  projectRoot = path.resolve(projectRoot)
  const entries = pages.map(p => path.resolve(projectRoot, p))
  entries.forEach(page =>
    resolvePage(
      page, page,
      { projectRoot, resolved, failed },
      { resolvePath, readPageConf }
    )
  )
  const relative = page => path.relative(projectRoot, page)
  entriesResolved = entries.filter(e => !failed.includes(e))
    .reduce((r, e) => {
      r[relative(e)] = Object.keys(resolved[e]).map(relative)
      return r
    }, {})
  return {
    projectRoot,
    entries: entries.map(relative),
    resolved: entriesResolved,
    failed: failed.map(relative)
  }
}

exports = module.exports = {
  pageDeps,
  resolvePath,
  readPageConf,
  resolvePage
}
