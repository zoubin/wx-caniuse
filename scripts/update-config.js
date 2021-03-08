// 从微信官网上抓取各API的版本兼容信息
// 操作步骤：
// 1、浏览器中打开 https://developers.weixin.qq.com/miniprogram/dev/api/
// 2、将本文件复制粘贴到DevTools的Console中运行
// 3、等待脚本执行完成（约几分钟）
// 4、将结果复制粘贴到配置文件中
(async function main(list) {
  const results = Object.create(null)
  const retry = []
  for (var i = 0, len = list.length; i < len; i++) {
    console.log(`${new Date().toTimeString().slice(0, 8)}: handling ${i + 1} of ${list.length}`)
    await processLink(list[i], 1)
  }
  for (var i = 0, len = retry.length; i < len; i++) {
    console.log(`${new Date().toTimeString().slice(0, 8)}: rehandling ${i + 1} of ${retry.length}`)
    await processLink(retry[i], 0)
  }
  console.log(JSON.stringify(results, null, 2))

  async function processLink(link, shouldRetry) {
    const api = link.href.slice(link.href.lastIndexOf('/') + 1, -5)
    if (results[api]) return
    let success = await loadPage(link)
    if (success) {
      const blockquote = document.querySelector('blockquote')
      const info = getInfo(blockquote && blockquote.textContent, api, link.href)
      results[api] = info
      if (!info.version && !info.pluginVersion) {
        console.log(`no version info found in link ${link.href}`)
      }
    } else {
      console.error('timeout: ', link.href)
      if (shouldRetry) retry.push(link)
    }
  }

  function getInfo(text, api, href) {
    const res = { name: api, href, text }
    if (!text) return res;
    let version = text.match(/\d{1,2}\.\d{1,2}\.\d{1,2}/g)
    if (!version) return res;
    let hasPluginInfo = text.includes('插件')
    if (version.length === 1) {
      if (hasPluginInfo) {
        res.pluginVersion = version[0]
      } else {
        res.version = version[0]
      }
    } else {
      res.version = version[0]
      if (hasPluginInfo) {
        res.pluginVersion = version[1]
      }
    }
    return res
  }

  async function loadPage(link) {
    const delta = 200
    link.click()
    let timeout = 2000
    while (timeout >= 0) {
      await wait(delta)
      if (!isTouched()) {
        touch()
        break
      }
      timeout -= delta
    }
    return timeout >= 0

    function wait(time) {
      return new Promise(rs => {
        setTimeout(rs, time)
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
  }
})($$('.NavigationLevel__children .NavigationItem__router-link'))
