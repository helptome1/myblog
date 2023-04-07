---
title: Node基础
date: 2022-9-22
categories:
  - Node
tags:
  - Node
---
# Node基础

## 什么是Node
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。  Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。


## Http模块
http模块用来开启一个服务
```js
const http = require('http')
/**
 * req 获取 url 信息 (request)
 * res 浏览器返回响应信息 (response)
 */
const server = http.createServer((req, res) => {
  // 设置 HTTP 头部，状态码是 200，文件类型是 html，字符集是 utf8
  res.writeHead(200, {
    'Content-Type': 'text/html;charset=UTF-8'
  })

  // 往页面打印值
  res.write('<h1 style="text-align:center">Hello NodeJS</h1>')

  // 结束响应
  res.end()
})
server.listen(8000)
```

## fs模块
- `fs.stat` 检测是文件还是目录
- `fs.mkdir` 创建目录
- `fs.writeFile` 创建写入文件
- `fs.appendFile` 追加文件
- `fs.readFile` 读取文件
- `fs.readdir` 读取目录
- `fs.rename` 重命名
- `fs.rmdir` 删除目录
- `fs.unlink` 删除文件

### fs.stat
用来检测是文件还是目录
```js

let fs = require('fs')

// 检查是否是文件
fs.stat('index.js', (error, stats) => {
  if (error) {
    console.log(error)
    return false
  } else {
    console.log(stats)
    /**
     * Console：
     * Stats {
     *  dev: 886875,
     *  mode: 33206,
     *  nlink: 1,
     *  uid: 0,
     *  gid: 0,
     *  rdev: 0,
     *  blksize: undefined,
     *  ino: 844424931461390,
     *  size: 284,
     *  blocks: undefined,
     *  atimeMs: 1542847157494,
     *  mtimeMs: 1543887546361.2158,
     *  ctimeMs: 1543887546361.2158,
     *  birthtimeMs: 1542847157493.663,
     *  atime: 2018-11-22T00:39:17.494Z,
     *  mtime: 2018-12-04T01:39:06.361Z,
     *  ctime: 2018-12-04T01:39:06.361Z,
     *  birthtime: 2018-11-22T00:39:17.494Z }
     */

    console.log(`文件：${stats.isFile()}`)
    // Console：文件：true

    console.log(`目录：${stats.isDirectory()}`)
    // Console：目录：false

    return false
  }
})

```

### fs.mkdir 和 fs.rmdir

通过fs.mkdir可以创建一个文件夹。通过fs.rmdir可以删除一个文件夹
```js
//  2. fs.mkdir
let fs = require('fs');

/**
 * 接收参数
 * path - 将创建的目录路径
 * mode - 目录权限（读写权限），默认 0777
 * callback - 回调，传递异常参数 err
 */
fs.mkdir('css', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("创建目录成功！");
    // Console：创建目录成功！
  }
})
```
### fs.writeFile
向指定模块中写入文件。

```js
//  3. fs.writeFile
let fs = require('fs');

/**
 * filename (String) 文件名称
 * data (String | Buffer) 将要写入的内容，可以是字符串或者 buffer 数据。
 * · encoding (String) 可选。默认 'utf-8'，当 data 是 buffer 时，该值应该为 ignored。
 * · mode (Number) 文件读写权限，默认 438。
 * · flag (String) 默认值 'w'。
 * callback { Function } 回调，传递一个异常参数 err。
 */
fs.writeFile('index.js', 'Hello jsliang', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log('写入成功！');
  }
})
```
值得注意的是，这样的写入，是清空原文件中的所有数据，然后添加 Hello jsliang 这句话。即：存在即覆盖，不存在即创建。

有创建就有删除，感兴趣的可以使用 `fs.unlink` 进行文件的删除，再次不做过多讲解。

既然，上面的是覆盖文件，那么有没有追加文件呢？有的，使用 `fs.appendFile` 吧：


### fs.appendFile

```js
//  4. fs.appendFile
let fs = require('fs');

fs.appendFile('index.js', '这段文本是要追加的内容', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("追加成功");
  }
})
```

### fs.readFile和fs.readdir
- `fs.readFile` 读取文件
- `fs.readdir` 读取目录

```js
let fs = require('fs');

// 5. fs.readFile
fs.readFile('index.js', (err, data) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("读取文件成功！");
    console.log(data);
    // Console：
    // 读取文件成功！
    // <Buffer 48 65 6c 6c 6f 20 6a 73 6c 69 61 6e 67 e8 bf 99 e6 ae b5 e6 96 87 e6 9c ac e6 98 af e8 a6 81 e8 bf bd e5 8a a0 e7 9a 84 e5 86 85 e5 ae b9>
  }
})

// 6. fs.readdir 读取目录
fs.readdir('node_modules', (err, data) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("读取目录成功！");
    console.log(data);
    // Console：
    // 读取目录成功！
    // [ '03_tool-multiply.js', 'jsliang-module' ]
  }
})
```

### fs.rename
最后剩下了rename，可以用来修改文件名和剪切！

```js
let fs = require('fs');

// 7. fs.rename 重命名
fs.rename('index.js', 'jsliang.js', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("重命名成功！");
  }
})


// 7. fs.rename 重命名
fs.rename('jsliang.js', 'node_modules/jsliang.js', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("剪切成功！");
  }
})
```

## Path模块
### __dirname和 __filename
在说path之前，先了解两个路径的拼接。
- __dirname 可以用来动态获取当前文件所属目录的绝对路径
- __filename 可以用来动态获取当前文件的绝对路径，包含当前文件
// __dirname 和 __filename 是不受执行 node 命令所属路径影响的

```js
// 测试 js 文件文件路径为: E:\前端相关\demo_js\test\31.path.js

console.log('__dirname->', __dirname)
console.log('__filename->', __filename)

// 输出: __dirname-> E:\前端相关\demo_js\test
// 输出: __filename-> E:\前端相关\demo_js\test\31.path.js
```

**path模块用来处理路径的模块，提供了一系列api来解决路径问题。**
- `path.join([...paths])` 路径拼接，将多个路径拼接成一个
- `path.resolve([...paths])` 将一系列路径或路径段解析为绝对路径。
- `path.basename(path[, suffix])`提取文件名和后缀。
- `path.extname(path)` 提取后缀名

### path.join([...paths])
将多个路径拼接成一个路径。
```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Returns: '/foo/bar/baz/asdf'

path.join('/foo', 'bar', 'baz/asdf', 'quux', '../');
// Returns: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Throws 'TypeError: Path must be a string. Received {}'

path.join(__dirname, './pic/index.html')
```


### path.basename(path[, suffix])

只保留文件名。suffix第二个参数用来过滤可选的后缀名

```js
path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux'
```

### path.resolve([...paths])
> path.resolve() 方法是以程序为根目录，作为起点，根据参数解析出一个绝对路径。 以应用程序为根目录，普通字符串代表子目录，/ 代表绝对路径根目录

```js
// 当前执行的 js 文件路径为: E:\前端相关\demo_js\test\31.path.js
const path = require('path')

// 得到应用程序启动文件的目录（得到当前执行文件绝对路径）
console.log(path.resolve()) // E:\前端相关\demo_js\test

// 解释: / 斜杠代表根目录，一般拼接的时候需要小心点使用 / 斜杠
console.log(path.resolve('a', '/b')) // E:\b

// 这个就是将文件路径拼接，并不管这个路径是否真实存在
console.log(path.resolve(__dirname, 'a/b')) // E:\前端相关\demo_js\test\a\b

// 这个是用当前应用程序启动文件绝对路径与后面的所有字符串拼接，因为最开始的字符串不是以 / 开头的，.. 也是代表上一级目录
console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')) // E:\前端相关\demo_js\test\wwwroot\static_files\gif\image.gif
```





