---
title: Koa2
date: 2023-04-17
categories:
  - Node
tags:
  - Node
---

# Koa2 的基本使用

## Koa2 是什么？

koa 是一个基于 node 实现的一个新的 web 框架，它是由 express 框架的原班人马打造。特点是优雅、简洁、表达力强、自由度高。和 express 相比，它是一个更轻量的 node 框架，因为它所有的功能都通过插件来实现，这种插拔式的架构设计模式，很符合 unix 哲学。

## 快速开始

首先官方文档本身书写的就很简洁，可以直接阅读[Koa 官网](https://koa.bootcss.com)文档来学习。

### 安装

```bash
npm install koa

node my-koa.js
```

### 应用

一个简单的 koa 应用程序

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000)
```

### 路由

Koa2 本身是没有内置路由模块的，但是可以使用`ctx.request.url`和`ctx.request.path`来获取请求路径。

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  let url = ctx.request.url
  ctx.body = url
})
app.listen(3000)
```

访问 http://localhost:3000/upload 页面会输出 /upload，也就是说上下文的请求 request 对象中 url 就是当前访问的路径名称，可以根据 ctx.request.url 通过一定的判断或者正则匹配就可以定制出所需要的路由。

#### koa-router

如果依靠 ctx.request.url 去手动处理路由，将会写很多处理代码，这时候就需要对应的路由的中间件对路由进行控制，这里介绍一个比较好用的路由中间件 koa-router。

```js
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
// 引入koa-router并对其实例化
const router = new Router()
// 配置get路由
router.get('/get', function(ctx, next) {
  ctx.body = 'this is a get response!'
})
// 配置post路由
router.post('/post', function(ctx, next) {
  ctx.body = 'this is a post response!'
})
// 首页
router
  .get('/', async (ctx) => {
    let html = `
      <ul>
        <li><a href="/hello">helloworld</a></li>
        <li><a href="/about">about</a></li>
      </ul>
    `
    ctx.body = html
  })
  .get('/hello', async (ctx) => {
    ctx.body = 'hello forest'
  })
  .get('/about', async (ctx) => {
    ctx.body = '前端森林'
  })

// 注册路由
app.use(router.routes(), router.allowedMethods())

app.listen(3000)
```

### 中间件（middleware）

koa2 最为人称道的就是它中间件的处理方式————洋葱模型。Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。

Koa 中使用 app.use()来加载中间件，基本上 Koa 所有的功能都是通过中间件实现的。

![](https://cdn.nlark.com/yuque/0/2023/jpeg/26452493/1681732316110-d32af3c6-0ecf-4454-88e6-275cae1ea1df.jpeg?x-oss-process=image%2Finterlace%2C1)

用一段代码来解释洋葱模型：

```js
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(6)
})

app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log(5)
})

app.use(async (ctx, next) => {
  console.log(3)
  ctx.body = 'hello world'
  console.log(4)
})
// 结果 123456
```

### 上下文

Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。 这些操作在 HTTP 服务器开发中频繁使用，它们被添加到此级别而不是更高级别的框架，这将强制中间件重新实现此通用功能。

```js
app.use(async (ctx) => {
  ctx // 这是 Context
  ctx.request // 这是 koa Request
  ctx.response // 这是 koa Response
})
```

> 注意：官网给出了很多 Request 和 Response 别名也就是 ctx.request 和 ctx.response 的简写模式。

#### get 请求数据获取

在 koa 中，获取 GET 请求数据源使用 koa 中 request 对象中的 query 方法或 querystring 方法。query 返回是格式化好的参数对象，querystring 返回的是请求字符串

- 请求对象 ctx.query，返回如 { name:'森林', age:23 }
- 请求字符串 ctx.querystring，返回如 name=森林&age=23

```js
const Koa = require('koa')
const app = new Koa()

app.use('/', async (ctx, next) => {
  // 从上下文的request对象中获取
  let req_query = ctx.request.query
  let req_querystring = ctx.request.querystring

  // 从上下文中直接获取
  let ctx_query = ctx.query
  let ctx_querystring = ctx.querystring
})
```

#### post 请求参数获取

对于 POST 请求的处理，koa2 没有封装获取参数的方法，需要通过自己解析上下文 `context` 中的原生 node.js 请求对象 req，将 POST 表单数据解析成 querystring（例如：`a=1&b=2&c=3`），再将 `querystring` 解析成 `JSON` 格式（例如：`{"a":"1", "b":"2", "c":"3"}`）。

我们可以使用`koa-bodyparser`插件从 POST 请求的数据体里面提取键值对。

```bash
$ npm install --save koa-bodyparser@3
```

```js
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

// 使用koa-bodyparser中间件
app.use(bodyParser())

app.use(async (ctx) => {
  if (ctx.url === '/' && ctx.method === 'GET') {
    // 当GET请求时候返回表单页面
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
        用户名:<input name="name" /><br/>
        年龄:<input name="age" /><br/>
        邮箱: <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  } else if (ctx.url === '/' && ctx.method === 'POST') {
    // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并展示到页面
    ctx.body = ctx.request.body
  } else {
    // 404
    ctx.body = '<h1>404 Not Found</h1>'
  }
})

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})
```

