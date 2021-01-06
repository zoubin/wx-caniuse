module.exports = function (v1, v2) {
  v1 = String(v1)
  v2 = String(v2)
  const n = Math.max(v1.length, v2.length)
  v1 = padding(v1)
  v2 = padding(v2)
  if (v1 === v2) return 0
  return v1 < v2 ? -1 : 1

  function padding(s) {
    return s.split('.').map(s => ('0'.repeat(n) + s).slice(-n)).join('-')
  }
}
