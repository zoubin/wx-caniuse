module.exports = function (v1, v2) {
  v1 = String(v1)
  v2 = String(v2)
  if (v1 === v2) return 0
  const n = Math.max(v1.length, v2.length)
  function padding(s) {
    return s.split('.').map(s => ('0'.repeat(n) + s).slice(-n)).join('-')
  }
  return padding(v1) < padding(v2) ? -1 : 1
}
