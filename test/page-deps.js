const { test } = require('tap')

const {
  pageDeps,
  resolvePath,
  resolvePage
} = require('../lib/page-deps')

test('resolvePath', t => {
  let component = '/components/foo/index'
  let page = '/path/to/project/src/pages/awesome/index'
  let projectRoot = '/path/to/project/src'
  t.equal(resolvePath(component, page, projectRoot), '/path/to/project/src/components/foo/index', 'start with /')
  component = './components/bar/index'
  t.equal(resolvePath(component, page, projectRoot), '/path/to/project/src/pages/awesome/components/bar/index', 'start with ./')
  t.end()
})

test('resolvePage', t => {
  let projectRoot = '/path/to/project/src'
  let foo = '/path/to/project/src/pages/awesome/components/foo/index'
  let bar = '/path/to/project/src/components/bar/index'
  let page = '/path/to/project/src/pages/awesome/index'

  function run(page, entry, { resolved, failed }, readPageConf) {
    resolvePage(
      page, entry,
      { projectRoot },
      { readPageConf, resolved, failed }
    )
  }

  let resolved = {}
  let failed = []
  run(page, page, { resolved, failed }, p => null)
  t.same(resolved, {}, 'no .json, no resolved')
  t.same(failed, [page], 'no .json, included in failed')

  resolved = {}
  failed = []
  run(page, page, { resolved, failed }, p => ({}))
  t.same(resolved, { [page]: {} }, 'no usingComponents, no deps')
  t.same(failed, [], 'no usingComponents, no failed')

  resolved = {}
  failed = []
  run(page, page, { resolved, failed }, p => ({ usingComponents: {} }))
  t.same(resolved, { [page]: {} }, 'usingComponents, no deps')
  t.same(failed, [], 'usingComponents, no failed')

  resolved = {}
  failed = []
  run(page, page, { resolved, failed }, p => {
    if (p === page) return {
      usingComponents: { foo: './components/foo/index' }
    }
    if (p === foo) return {
      usingComponents: { bar: '/components/bar/index' }
    }
    if (p === bar) return {}
  })
  t.same(resolved, {
    [page]: { [foo]: true, [bar]: true },
    [foo]: { [bar]: true },
    [bar]: {}
  }, 'usingComponents')
  t.same(failed, [], 'usingComponents, no failed')

  t.end()
})

test('pageDeps', t => {
  let projectRoot = '/path/to/project/src'
  let foo = '/path/to/project/src/pages/awesome/components/foo/index'
  let bar = '/path/to/project/src/components/bar/index'
  let page = '/path/to/project/src/pages/awesome/index'

  function run(pages, { resolved, failed }, readPageConf) {
    return pageDeps(
      pages,
      { projectRoot },
      { readPageConf, resolved, failed }
    )
  }

  let resolved = {}
  let failed = []
  let result = run([page, bar], { resolved, failed }, p => {
    if (p === page) return {
      usingComponents: { foo: './components/foo/index' }
    }
    if (p === foo) return {
      usingComponents: { bar: '/components/bar/index' }
    }
    if (p === bar) return {}
  })
  t.same(result.failed, [], 'no failed')
  t.same(result.resolved, {
    'pages/awesome/index': [
      'pages/awesome/components/foo/index',
      'components/bar/index'
    ],
    'components/bar/index': []
  })

  t.end()
})

