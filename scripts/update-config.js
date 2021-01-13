// 从微信官网上抓取各API的版本兼容信息
// 操作步骤：
// 1、浏览器中打开 https://developers.weixin.qq.com/miniprogram/dev/api/
// 2、将本文件复制粘贴到DevTools的Console中运行
// 3、等待脚本执行完成（约几分钟）
// 4、将结果复制粘贴到配置文件中
(function loop(list, i = 0, results = Object.create(null)) {
  console.log(`${new Date().toTimeString().slice(0, 8)}: handling ${i + 1} of ${list.length}`)
  if (i >= list.length) return output()

  const link = list[i++]
  const api = link.href.slice(link.href.lastIndexOf('/') + 1, -5)
  if (results[api]) return loop(list, i, results)
  let version = '0'

  click()
    .then((timeout) => {
      if (timeout) return console.log('timeout')
      const blockquote = document.querySelector('blockquote')
      version = blockquote && blockquote.textContent.match(/\d{1,2}\.\d{1,2}\.\d{1,2}/)
      version = version && version[0] || '-'
    })
    .then(() => {
      results[api] = [api, version, link.href]
      loop(list, i, results)
    })

  function output(compact = true) {
    if (compact) return console.log(
      'Results:\n' + Object.values(results).map(v => v.join('\t')).join('\n')
    )

    console.log(JSON.stringify(
      Object.values(results)
        .map(([api, version, href]) => ({ api, version, href })),
      null,
      2
    ))
  }

  function click() {
    return new Promise((rs) => {
      const delta = 200
      link.click()

      ;(function wait(timeout) {
        setTimeout(() => {
          if (!isTouched()) {
            touch()
            return rs()
          }
          timeout -= delta
          if (timeout < 0) return rs('timeout')
          wait(timeout)
        }, delta)
      })(1000)
    })
  }

  function touch() {
    const h1 = document.querySelector('h1')
    if (h1) h1.classList.add('touched')
  }

  function isTouched() {
    const h1 = document.querySelector('h1')
    return !h1 || h1.classList.contains('touched')
  }
})($$('.NavigationLevel__children .NavigationItem__router-link'))

// 将表格形式的信息转成JSON
(function (s) {
  console.log(JSON.stringify(s.trim().split('\n').map(line => {
    const [c, v, h] = line.split(/\s+/)
    return { name: c, version: v, href: h } }), null, 2))
})(``)
