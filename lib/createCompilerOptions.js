const ts = require('typescript')
const path = require('path')

const defaultCompilerOptions = {
  noEmit: true,
  allowJs: true,
  checkJs: true,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ESNext
}

module.exports = function ({
  typeRoots = [],
  defaultTypes = true
} = {}) {
  if (defaultTypes) {
    typeRoots = typeRoots.map(f => path.resolve(f))
    ;[
      path.resolve(__dirname, './api-typings'),
      path.resolve('node_modules/@types')
    ].filter(p => !typeRoots.includes(p)).forEach(p => typeRoots.push(p))
  }
  return Object.assign({}, defaultCompilerOptions, { typeRoots })
}
