#!/usr/bin/env node

const program = require('commander')

program.version(require('../package.json').version)

program
  .command('view <api>')
  .alias('info')
  .description('查看指定API的详细信息')
  .option('-t, --target-version <version>', '指定兼容版本号', '2.0.0')
  .action(require('./view'))

program
  .command('list <version>')
  .description('列出指定版本下可用的所有API')
  .action(require('./list'))

program
  .command('check <name> [moreNames...]')
  .description('检查在指定版本下是否可使用某些API')
  .option('-t, --target-version <version>', '指定兼容版本号', '2.0.0')
  .action(require('./check'))

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
