# wx-caniuse
兼容低版本基础库的小工具。

## Install

```js
npm i -g wx-caniuse
wx-caniuse -h

```

## Usage

```bash
wx-caniuse view console.log # 查看指定API的详细信息
wx-caniuse view -C scroll-view # 查看指定组件的详细信息
wx-caniuse open console.log # 使用默认浏览器打开文档
wx-caniuse list -v '2.0.0' # 列出 2.0.0 可用的所有 wx.XXX API
wx-caniuse list -e 'Sync$' -v '2.0.0' # 列出 2.0.0 可用的所有以 Sync 结尾的 wx.XXX API
wx-caniuse tsc src/pages/home/index # 使用TS进行静态检查

```
