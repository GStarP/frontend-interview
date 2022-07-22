# Node.js

## Express

- 是什么：一个 Node.js 框架，旨在提供更便利的 Web 服务端开发

- 为什么：直接使用 Node.js API 开发效率不高

### 基本原理

> [NodeJS express框架核心原理全揭秘](https://zhuanlan.zhihu.com/p/56947560)

Express 本质上是一个 http.createServer 回调。

```js
const server = http.createServer((req, res) => {
    // express lies here!
});
server.listen(8080)
```

在能够获取到 req 和 res 的基础上，Express 实现了一个中间件框架，通过装载不同中间件提供处理响应、路由、模板引擎、静态资源等多种能力。

```js
app.use((req, res, next) => {
    // middleware logic
})
```

中间件能够读取 req，修改 res，并且必须调用 next 才会进入下一个中间件的处理流程，否则直接结束、返回响应。

## Koa

大致同 Express，主要有几点不同：

- 中间件提供 context 而将 req&res 作为 context 的属性，能够自然地传递更多信息

- 中间件调用设计为洋葱模型
  
  - 使用 Koa 必须安装 babel 插件支持 async 语法
  
  - 第一个中间件 await next() 后的逻辑将最后触发

```js
const app = new Koa()
app.use(async (ctx, next) => {
    console.log(1)
    await next()
    console.log(4)
})
app.use(async (ctx, next) => {
    console.log(2)
    await next()
    console.log(3)
})
// log: 1 2 3 4
```
