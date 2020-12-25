const { test } = require('tap')
const config = {
  api: {
    'wx.setStorage': 0,
    'wx.getUserInfo': '2.1'
  },
  component: {
    view: '1.1.0'
  }
}
const createCanIUseInterface = require('..')(config)

test('basic', t => {
  const caniuse = createCanIUseInterface(1)
  const caniuseAPI = caniuse('api')
  const caniuseComponent = caniuse('component')
  t.same(caniuseAPI('wx.setStorage'), { ok: true, notOk: false, unknown: false })
  t.same(caniuseComponent('view'), { ok: false, notOk: true, unknown: false })
  t.same(caniuseAPI('wx.getUserInfo'), { ok: false, notOk: true, unknown: false })
  t.same(caniuseAPI('wx'), { ok: false, notOk: false, unknown: true })
  t.end()
})

test('version', t => {
  const caniuse = createCanIUseInterface('1.1.0')
  const caniuseAPI = caniuse('api')
  const caniuseComponent = caniuse('component')
  t.same(caniuseAPI('wx.setStorage'), { ok: true, notOk: false, unknown: false })
  t.same(caniuseComponent('view'), { ok: true, notOk: false, unknown: false })
  t.same(caniuseAPI('wx.getUserInfo'), { ok: false, notOk: true, unknown: false })
  t.same(caniuseAPI('wx'), { ok: false, notOk: false, unknown: true })
  t.end()
})
