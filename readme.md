# wx-caniuse
兼容低版本基础库的小工具。

## Install

```js
npm i -g wx-caniuse
wx-caniuse -h

```

## Usage

### 查看指定API的详细信息
```bash
wx-caniuse view console.log

```

### 检查在指定版本下是否可使用某些API
```bash
wx-caniuse check -t 2.0.0 console.log

```

命令行版[wx.canIUse](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html)

### 列出指定版本下可用的所有API
```bash
wx-caniuse list 2.0.0

```

### 静态检查
使用TS进行静态检查

```bash
wx-caniuse tsc src/pages/home/index

```

