const { test, only } = require('tap')
const path = require('path')

const pageDeps = require('../lib/page-deps')
const { Resolver } = pageDeps

test('Resolver, resolvePath', t => {
  let baseUrl = '/path/to/project/src'
  let from = '/path/to/project/src/pages/awesome/index'

  const resolver = new Resolver({
    baseUrl,
    paths: { '@npm/*': ['@npm/*'] }
  })

  t.equal(
    new Resolver({ baseUrl }).resolvePath('/components/foo/index', from),
    '/path/to/project/src/components/foo/index',
    'start with /, using baseUrl'
  )

  t.equal(
    new Resolver({ projectRoot: page => baseUrl }).resolvePath('/components/foo/index', from),
    '/path/to/project/src/components/foo/index',
    'start with /, using projectRoot function'
  )

  t.equal(
    new Resolver({ projectRoot: 'src' }).resolvePath('/components/foo/index', from),
    '/path/to/project/src/components/foo/index',
    'start with /, using relative projectRoot, simple case'
  )

  t.equal(
    new Resolver({ projectRoot: 'src' }).resolvePath('/components/foo/index', '/path/to/project/src/subproject/src/awesome/index'),
    '/path/to/project/src/subproject/src/components/foo/index',
    'start with /, using relative projectRoot, complex case'
  )

  t.equal(
    new Resolver({ projectRoot: baseUrl }).resolvePath('/components/foo/index', from),
    '/path/to/project/src/components/foo/index',
    'start with /, using absolute projectRoot'
  )

  t.equal(
    resolver.resolvePath('./components/bar/index', from),
    '/path/to/project/src/pages/awesome/components/bar/index',
    'start with ./'
  )

  t.equal(
    resolver.resolvePath('components/bar/index', from),
    '/path/to/project/src/pages/awesome/components/bar/index',
    'support relative path without "./" '
  )

  t.equal(
    resolver.resolvePath('../../components/xyz/index', from),
    '/path/to/project/src/components/xyz/index',
    'start with ../'
  )

  resolver.reset({ pageExists: () => true })
  t.equal(
    resolver.resolvePath('@npm/ooz/index', from),
    '/path/to/project/src/@npm/ooz/index',
    'alias'
  )

  t.end()
})

test('Resolver, resolvePage', t => {
  let baseUrl = '/path/to/project/src'
  let foo = '/path/to/project/src/pages/awesome/components/foo/index'
  let bar = '/path/to/project/src/components/bar/index'
  let page = '/path/to/project/src/pages/awesome/index'

  const resolver = new Resolver({ baseUrl })

  t.same(
    resolver.reset({ cache: {}, readPageConf: p => ({}) }).resolve(page),
    {},
    'no usingComponents, no deps'
  )

  t.same(
    resolver.reset({
      cache: {},
      readPageConf: p => ({ usingComponents: {} })
    }).resolve(page),
    {},
    'usingComponents, no deps'
  )

  t.same(
    resolver.reset({
      cache: {},
      readPageConf: p => {
        if (p === page) return {
          usingComponents: { foo: './components/foo/index' }
        }
        if (p === foo) return {
          usingComponents: { bar: '/components/bar/index' }
        }
        if (p === bar) return {}
      }
    }).resolve(page),
    { foo },
    'usingComponents'
  )
  t.same(resolver.cache, {
    [page]: { foo },
    [foo]: { bar },
    [bar]: {}
  }, 'usingComponents, cache')

  t.end()
})

test('pageDeps', t => {
  let baseUrl = '/path/to/project/src'
  const resolve = p => path.resolve(baseUrl, p)

  const foo = resolve('pages/awesome/components/foo/index')
  const bar = resolve('components/bar/index')
  const page = resolve('pages/awesome/index')
  const page1 = resolve('pages/awesome1/index')
  const page2 = resolve('pages/awesome2/index')
  const xyz = resolve('npm/xyz/index')

  function run(pages) {
    return pageDeps(pages, {
      baseUrl,
      paths: { 'npm/*': ['npm/*'] }
    }, resolver => resolver.reset({
      pageExists: () => true,
      readPageConf: p => {
        if (p === page) return {
          usingComponents: { foo: './components/foo/index' }
        }
        if (p === page1) return {
          usingComponents: { bar: '/components/bar/index' }
        }
        if (p === page2) return {
          usingComponents: { bar: 'npm/xyz/index' }
        }
        if (p === foo) return {
          usingComponents: { bar: '/components/bar/index' }
        }
        if (p === bar) return {}
        if (p === xyz) return {}
      }
    }))
  }
  t.same(
    run('./pages/awesome/index').sort(),
    [ bar, foo, page ],
    'single input'
  )
  t.same(
    run(['./pages/awesome/index', './pages/awesome1/index']).sort(),
    [ bar, foo, page, page1 ],
    'array input with more than 1 element'
  )
  t.same(run('./pages/awesome2/index'), [ page2, xyz ], 'with alias')
  t.end()
})

