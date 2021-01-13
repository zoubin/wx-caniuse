module.exports = function (filters) {
  const next = i => arg => {
    const fn = filters[i]
    if (typeof fn !== 'function') return true
    return fn(arg, () => next(i + 1)(arg))
  }
  return next(0)
}
