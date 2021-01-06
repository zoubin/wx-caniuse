const { test } = require('tap')
const config = {
  'wx.setStorage': { version: 0 },
  'wx.getUserInfo': { version: '2.1' }
}
const { createCanIUseInterface } = require('..')(config)

test('basic', t => {
  const caniuse = createCanIUseInterface(1)
  t.ok(caniuse('wx.setStorage'), 'should ok')
  t.notOk(caniuse('wx.getUserInfo'), 'should not ok')
  t.notOk(caniuse('wx'), 'should not ok')
  t.end()
})

