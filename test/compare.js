const { test } = require('tap')
const compare = require('../lib/compare')

test('basic', t => {
  t.equal(compare('1.10.1', '1.2.1'), 1)
  t.equal(compare('1.10', '1.2.1'), 1)
  t.equal(compare('1.10.1', '1.2'), 1)
  t.equal(compare('1.10', '1.2'), 1)
  t.equal(compare('10', '1'), 1)
  t.equal(compare('0.10.1', '1.2.1'), -1)
  t.equal(compare('1.2.1', '1.2.1'), 0)
  t.end()
})

test('number', t => {
  t.equal(compare(0, '1.2.1'), -1)
  t.equal(compare(0, '1.2'), -1)
  t.equal(compare(0, '1'), -1)
  t.equal(compare(2, 1), 1)
  t.equal(compare(2, '1'), 1)
  t.equal(compare('2', 1), 1)
  t.equal(compare('2', 2), 0)
  t.end()
})
