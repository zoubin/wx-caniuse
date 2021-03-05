#!/usr/bin/env node

const program = require('commander')

program.version(require('../package.json').version)

program
  .command('open <api>')
  .description('在浏览器中查看 API 信息')
  .action(require('./open'))

program
  .command('view <api> [moreApi...]')
  .alias('info')
  .description('查看指定API的详细信息')
  .action(require('./view'))

program
  .command('list')
  .alias('ls')
  .option('-v, --ver <version>', '指定兼容版本号')
  .option('-e, --regex <pattern...>', '指定API名称格式')
  .description('列出满足条件的所有API')
  .action(require('./list'))

program
  .command('tsc')
  .description('使用 TypeScript 检查接口使用')
  .option('--no-default-types')
  .option('--no-default-diagnostic-filter', 'disable using default diagnostics filter')
  .option('--type-roots <dirs...>', 'tsc --typeRoots', [])
  .option('--project-root <path>', 'project root to resolve page deps')
  .option('--only-file', 'just print file names')
  .option('--ignore <number...>', 'ignore errors with given codes', [])
  .option('--only <number...>', 'print only errors with given codes', [])
  .option('-e, --extensions <ext...>', 'extensions to find page js', ['.js', '.ts', '.tsx', '.jsx'])
  .option('-c, --config-file <path>', 'configuration file (node module)')
//.option('--module <commonjs|amd>', 'tsc --module', 'commonjs')
//.option('--target <esnext|es6>', 'tsc --target', 'esnext')
//.option('--no-allow-js')
//.option('--no-check-js')
  .action(require('./tsc'))

program.parse(process.argv)
