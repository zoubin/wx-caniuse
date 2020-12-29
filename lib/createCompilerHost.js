const ts = require('typescript')

function getDefaultLibLocation() {
  return ts.getDirectoryPath(ts.normalizePath(ts.sys.getExecutingFilePath()))
}
function fileExists(fileName) {
  return ts.sys.fileExists(fileName)
}

function readFile(fileName) {
  return ts.sys.readFile(fileName)
}

function getSourceFile(fileName, languageVersion, onError) {
  const sourceText = ts.sys.readFile(fileName)
  return sourceText !== undefined
    ? ts.createSourceFile(fileName, sourceText, languageVersion)
    : undefined
}

function getDefaultLibFileName(options) {
  return ts.combinePaths(getDefaultLibLocation(), ts.getDefaultLibFileName(options))
}

function writeFile(fileName, content) {
  return ts.sys.writeFile(fileName, content)
}

function getCurrentDirectory() {
  return ts.sys.getCurrentDirectory()
}

function getDirectories(path) {
  return ts.sys.getDirectories(path)
}

function getCanonicalFileName(fileName) {
  return ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase()
}

function getNewLine() {
  return ts.sys.newLine
}

function useCaseSensitiveFileNames() {
  return ts.sys.useCaseSensitiveFileNames
}

// 必须指定，typeRoots才能生效
function directoryExists(dir) {
  return ts.sys.directoryExists(dir)
}

function resolver(options) {
  const host = { fileExists, readFile }
  return function (moduleNames, containingFile) {
    const resolvedModules = []
    for (let moduleName of moduleNames) {
      if (ts.hasTSFileExtension(moduleName)) {
        moduleName = ts.removeFileExtension(moduleName)
      }
      // try to use standard resolution
      let result = ts.resolveModuleName(moduleName, containingFile, options, host)
      if (!result.resolvedModule && !ts.pathIsRelative(moduleName)) {
        // 尝试微信小程序解析逻辑
        result = ts.resolveModuleName('./' + moduleName, containingFile, options, host)
      }
      if (result.resolvedModule) {
        resolvedModules.push(result.resolvedModule)
      } else {
        // 需要undefined，不然TS会中断。
        // node_modules/@types/fs-extra中import了fs，但fs是在node_modules/@types/node/下，会找不到
        // 暂时还没精力排查TS是如何处理这种情况的，不过命令行工具中在fs-extra中解析fs时，确实返回的是undefined
        resolvedModules.push(undefined)
      }
    }
    return resolvedModules
  }
}

module.exports = options => ({
  getSourceFile,
  getDefaultLibFileName,
  getDefaultLibLocation,
  writeFile,
  getCurrentDirectory,
  getDirectories,
  getCanonicalFileName,
  getNewLine,
  useCaseSensitiveFileNames,
  fileExists,
  directoryExists,
  readFile,
  resolveModuleNames: resolver(options)
})
