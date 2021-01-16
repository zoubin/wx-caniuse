const ts = require('typescript')
const path = require('path')
const compose = require('./compose')
const createCompilerHost = require('./create-compiler-host')

// disable JSDoc parsing
ts.getJSDocCommentRanges = () => []

const defaultCompilerOptions = {
  noEmit: true,
  allowJs: true,
  jsx: true,
  checkJs: true,
  // 微信的声明文件中增加了 require, console, module 等，会与其它的库冲突，所以要跳过
  // 实际中跳过对声明文件的type checking对结果没有影响
  skipLibCheck: true,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ESNext
}

function defaultFormatter(diagnostics) {
  diagnostics.forEach(({ code, file, line, character, message }, i) => {
    file = path.relative(process.cwd(), file)
    console.log(code, `${file}:(${line + 1}, ${character + 1}):`, message.join('\n'))
  })
}

module.exports = function (entries, {
  compilerOptions = {},
  diagnosticFilter = [],
  formatter
} = {}) {
  const options = Object.assign({}, defaultCompilerOptions, compilerOptions)
  const host = createCompilerHost(options)
  const program = ts.createProgram(entries, options, host)
  const emitResult = program.emit()
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)
    .reduce((diagnostics, diag) => {
      if (diag.file) {
        let { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start)
        diagnostics.push({
          code: diag.code,
          file: diag.file.fileName,
          line, character,
          message: [ts.flattenDiagnosticMessageText(diag.messageText, '\n')]
        })
      } else if (diagnostics.length > 0) {
        diagnostics[diagnostics.length - 1].message.push(
          ts.flattenDiagnosticMessageText(diag.messageText, '\n')
        )
      }
      return diagnostics
    }, [])
    .filter(compose(diagnosticFilter))
  formatter = formatter || defaultFormatter
  formatter(diagnostics)
  return diagnostics.length
}
