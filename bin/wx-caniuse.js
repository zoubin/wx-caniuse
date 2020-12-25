#!/usr/bin/env node

const program = require('commander')

program
  .command('info <name>')
  .description('view information about given api or component')
  .action(require('./info'))

program
  .command('check <name> [moreNames...]')
  .description('check given names')
  .option('--no-default-config', '禁用默认配置')
  .option('-c, --config-paths <paths...>', '添加配置', [])
  .option('-t, --target-version <version>', '指定兼容版本号', '2.0.0')
  .action(require('./check'))

program
  .command('grep')
  .description('grep components unavailable')
  .option('-t, --target-version <version>', '指定兼容版本号', '2.0.0')
  .action(require('./grep'))

program
  .command('tsc')
  .description('使用 TypeScript 检查接口使用')
  .option('--no-default-types')
  .option('--module <commonjs|amd>', 'tsc --module', 'commonjs')
  .option('--target <esnext|es6>', 'tsc --target', 'esnext')
  .option('--no-allow-js')
  .option('--no-check-js')
  .option('-e, --entries-config <path>', 'entries specified in a file')
  .option('--type-roots <dirs...>', 'tsc --typeRoots', [])
  .action(require('./tsc'))

program.parse(process.argv)
