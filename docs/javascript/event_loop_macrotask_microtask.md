---
title: 宏任务与微任务详解
date: 2026-07-05
categories:
  - JavaScript
tags:
  - JavaScript
---

> 宏任务（Macrotask）与微任务（Microtask）是理解 JavaScript 事件循环（Event Loop）的两把钥匙。本文从执行模型、常见任务分类到多道面试级经典题，一步步讲透 `setTimeout`、`Promise`、`async/await` 的真实执行顺序。

## 1. 什么是宏任务与微任务？

```js
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

console.log('4')
```

最终输出：

```text
1
4
3
2
```

为什么 `setTimeout(..., 0)` 明明写在 Promise 前面，却最后执行？

原因就在于 JavaScript 的：

- 调用栈
- 事件循环 Event Loop
- 宏任务 Macrotask
- 微任务 Microtask

理解这些机制之后，绝大多数异步执行顺序题都会变得非常清晰。

---

## 2. JavaScript 为什么需要事件循环

JavaScript 主线程本质上是单线程执行的。

也就是说，同一时间只能执行一件事情。

例如：

```js
console.log('A')
console.log('B')
console.log('C')
```

执行顺序一定是：

```text
A
B
C
```

但是现实中的程序存在大量耗时操作，例如：

```text
网络请求
定时器
文件读取
用户点击
DOM 事件
数据库操作
```

如果 JavaScript 在等待网络请求时什么都不能做，页面就会完全卡住。

所以 JavaScript 采用了异步机制。

大致流程如下：

```text
同步代码
   ↓
调用栈 Call Stack
   ↓
异步任务交给宿主环境处理
   ↓
异步操作完成
   ↓
进入任务队列
   ↓
Event Loop 检查调用栈
   ↓
合适时机把任务取出来执行
```

这里的“任务队列”并不是只有一种。

最重要的两类就是：

```text
宏任务队列
微任务队列
```

---

## 3. Event Loop 的核心执行规则

可以先记住一个非常重要的简化规则：

```text
执行一个宏任务
    ↓
执行过程中产生同步代码
    ↓
当前宏任务执行完
    ↓
清空所有微任务
    ↓
进入下一个宏任务
```

也可以记成：

```text
宏任务
  ↓
所有微任务
  ↓
下一个宏任务
  ↓
所有微任务
  ↓
下一个宏任务
```

注意：

> 微任务不是只执行一个，而是要把当前微任务队列清空。

---

## 4. 什么是宏任务

宏任务英文通常称为：

```text
Macrotask
```

严格来说，在 HTML 标准中更多使用 `task` 这个概念，但在日常开发和面试中，“宏任务”这个名称非常常见。

宏任务可以理解为：

> 事件循环每一轮中执行的主要任务。

常见宏任务包括：

```text
script 整体代码
setTimeout
setInterval
I/O
UI 渲染相关任务
消息事件
某些宿主环境任务
```

在 Node.js 中还会涉及：

```text
setImmediate
I/O callback
timer callback
```

---

### 4.1 整个 script 本身也是宏任务

例如：

```js
console.log('A')

Promise.resolve().then(() => {
  console.log('B')
})

console.log('C')
```

首先执行整个 script。

可以理解为：

```text
宏任务 1：script
```

执行：

```text
console.log('A')
注册 Promise 微任务
console.log('C')
```

所以先得到：

```text
A
C
```

script 这个宏任务执行结束后：

```text
清空微任务队列
```

所以输出：

```text
B
```

最终：

```text
A
C
B
```

---

## 5. 什么是微任务

微任务英文：

```text
Microtask
```

微任务的优先级通常高于下一个宏任务。

也就是说：

```text
当前同步代码执行完
    ↓
先执行所有微任务
    ↓
再执行下一个宏任务
```

常见微任务包括：

```text
Promise.then
Promise.catch
Promise.finally
queueMicrotask
MutationObserver
```

在 Node.js 中还经常讨论：

```text
process.nextTick
```

但需要注意：

> `process.nextTick` 在 Node.js 中拥有自己特殊的 nextTick 队列，优先级通常还高于 Promise 微任务。

因此 Node.js 的事件循环比浏览器更加复杂。

---

## 6. 最经典的事件循环例子

来看代码：

```js
console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

Promise.resolve().then(() => {
  console.log(3)
})

console.log(4)
```

执行过程：

### 第一步：执行 script

首先：

```js
console.log(1)
```

输出：

```text
1
```

---

执行：

```js
setTimeout(() => {
  console.log(2)
}, 0)
```

定时器回调不会立刻执行。

它会在条件满足后进入宏任务队列。

现在：

```text
宏任务队列：
setTimeout callback
```

---

接着执行：

```js
Promise.resolve().then(() => {
  console.log(3)
})
```

`.then()` 回调进入微任务队列。

现在：

```text
微任务队列：
Promise.then
```

---

接着：

```js
console.log(4)
```

输出：

```text
4
```

---

此时当前 script 执行完成。

调用栈为空。

Event Loop 发现：

```text
微任务队列不为空
```

于是执行微任务：

```js
console.log(3)
```

输出：

```text
3
```

微任务清空后，再进入下一个宏任务：

```js
console.log(2)
```

输出：

```text
2
```

最终结果：

```text
1
4
3
2
```

---

## 7. 宏任务与微任务执行模型

推荐记住这个模型：

```text
┌─────────────────────┐
│     执行宏任务       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   执行同步代码       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 当前宏任务执行完成   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 清空全部微任务       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 浏览器可能进行渲染   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 执行下一个宏任务     │
└─────────────────────┘
```

最关键的一句话：

> 每执行完一个宏任务，都要清空当前全部微任务。

---

## 8. 微任务执行过程中还能继续产生微任务

来看：

```js
Promise.resolve().then(() => {
  console.log(1)

  Promise.resolve().then(() => {
    console.log(2)
  })
})

Promise.resolve().then(() => {
  console.log(3)
})
```

最开始的微任务队列：

```text
微任务1
微任务2
```

执行微任务 1：

```js
console.log(1)
```

输出：

```text
1
```

同时又产生一个新的微任务：

```text
微任务3
```

此时队列：

```text
微任务2
微任务3
```

继续执行微任务2：

```text
3
```

然后：

```text
2
```

最终：

```text
1
3
2
```

说明：

> 微任务执行期间产生的新微任务，也会继续加入当前微任务队列，并在进入下一个宏任务之前执行完。

---

## 9. Promise 本身是同步的，then 才是微任务

这是非常经典的坑。

看代码：

```js
console.log('A')

new Promise((resolve) => {
  console.log('B')
  resolve()
}).then(() => {
  console.log('C')
})

console.log('D')
```

很多初学者会认为整个 Promise 都是异步的。

其实不是。

```js
new Promise((resolve) => {
  console.log('B')
  resolve()
})
```

Promise 构造函数中的 executor 是立即同步执行的。

因此顺序：

```text
A
B
D
C
```

原因：

```text
console.log('A')       同步
Promise executor       同步
console.log('B')       同步
then callback          微任务
console.log('D')       同步
```

最终：

```text
A
B
D
C
```

---

## 10. async / await 和微任务

理解 `async/await` 时，可以把：

```js
await xxx
```

粗略理解为：

```js
Promise.resolve(xxx).then(...)
```

来看：

```js
async function fn() {
  console.log(1)

  await Promise.resolve()

  console.log(2)
}

console.log(3)

fn()

console.log(4)
```

执行：

```text
3
1
4
2
```

为什么？

首先：

```js
console.log(3)
```

输出：

```text
3
```

然后调用：

```js
fn()
```

进入 async 函数。

执行：

```js
console.log(1)
```

输出：

```text
1
```

遇到：

```js
await Promise.resolve()
```

await 后面的继续执行部分会进入微任务调度。

所以暂时退出 `fn()`。

然后执行：

```js
console.log(4)
```

输出：

```text
4
```

同步代码结束。

执行微任务：

```js
console.log(2)
```

最终：

```text
3
1
4
2
```

---

## 11. await 后面不是所有东西都会“异步执行”

例如：

```js
async function fn() {
  console.log('A')

  const result = await getData()

  console.log('B')
}
```

可以理解为：

```text
await 之前
    ↓
同步执行

await
    ↓
暂停当前 async 函数

await 之后
    ↓
后续逻辑通过微任务继续执行
```

这个模型非常重要。

---

## 12. 经典题一

代码：

```js
console.log('start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('end')
```

答案：

```text
start
end
promise
setTimeout
```

分析：

```text
script 宏任务
    ↓
start
注册 setTimeout 宏任务
注册 Promise 微任务
end
    ↓
script 结束
    ↓
Promise 微任务
    ↓
setTimeout 宏任务
```

---

## 13. 经典题二：Promise 构造函数

代码：

```js
console.log(1)

new Promise((resolve) => {
  console.log(2)

  resolve()

  console.log(3)
}).then(() => {
  console.log(4)
})

console.log(5)
```

答案：

```text
1
2
3
5
4
```

解释：

Promise executor：

```js
(resolve) => {
  console.log(2)
  resolve()
  console.log(3)
}
```

是同步执行。

`resolve()` 并不会让当前代码立即跳出去。

所以：

```text
1
2
3
5
```

同步执行结束。

然后：

```text
4
```

作为微任务执行。

---

## 14. 经典题三：宏任务中创建微任务

代码：

```js
console.log(1)

setTimeout(() => {
  console.log(2)

  Promise.resolve().then(() => {
    console.log(3)
  })

  console.log(4)
}, 0)

setTimeout(() => {
  console.log(5)
}, 0)

console.log(6)
```

答案：

```text
1
6
2
4
3
5
```

分析：

最开始执行 script：

```text
1
注册 Timer1
注册 Timer2
6
```

输出：

```text
1
6
```

然后执行 Timer1：

```js
console.log(2)
```

输出：

```text
2
```

创建 Promise 微任务。

然后：

```js
console.log(4)
```

输出：

```text
4
```

Timer1 这个宏任务结束。

必须先清空微任务：

```text
3
```

然后才执行下一个宏任务 Timer2：

```text
5
```

所以：

```text
1
6
2
4
3
5
```

这道题特别重要，因为它体现了：

> 每一个宏任务结束以后，都要先清空微任务。

---

## 15. 经典题四：微任务嵌套

代码：

```js
console.log(1)

Promise.resolve().then(() => {
  console.log(2)

  Promise.resolve().then(() => {
    console.log(3)
  })
})

Promise.resolve().then(() => {
  console.log(4)
})

console.log(5)
```

答案：

```text
1
5
2
4
3
```

执行 script：

```text
1
注册微任务 A
注册微任务 B
5
```

同步结果：

```text
1
5
```

微任务队列：

```text
A
B
```

执行 A：

```text
2
```

A 内又创建 C。

队列变成：

```text
B
C
```

执行 B：

```text
4
```

执行 C：

```text
3
```

最终：

```text
1
5
2
4
3
```

---

## 16. 经典题五：async / await

代码：

```js
async function async1() {
  console.log('async1 start') //2

  await async2()

  console.log('async1 end') //6
}

async function async2() {
  console.log('async2') //3
}

console.log('script start') //1

setTimeout(() => {
  console.log('setTimeout') //8
}, 0)

async1()

new Promise((resolve) => {
  console.log('promise1') //4
  resolve()
}).then(() => {
  console.log('promise2') //7
})

console.log('script end') //5
```

经典输出：

```text
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

分析同步阶段：

```text
script start
```

注册：

```text
setTimeout
```

调用：

```js
async1()
```

输出：

```text
async1 start
```

执行：

```js
async2()
```

输出：

```text
async2
```

由于：

```js
await async2()
```

`async1 end` 后续进入微任务。

继续执行 Promise 构造函数：

```text
promise1
```

`.then()` 再注册一个微任务。

最后：

```text
script end
```

同步输出：

```text
script start
async1 start
async2
promise1
script end
```

此时微任务队列大致为：

```text
async1 后续
Promise.then
```

所以：

```text
async1 end
promise2
```

最后执行 timer：

```text
setTimeout
```

---

## 17. 经典题六：综合题

```js
console.log('1')

setTimeout(() => {
  console.log('2')

  Promise.resolve().then(() => {
    console.log('3')
  })
}, 0)

Promise.resolve()
  .then(() => {
    console.log('4')

    setTimeout(() => {
      console.log('5')
    }, 0)
  })
  .then(() => {
    console.log('6')
  })

console.log('7')
```

答案：

```text
1
7
4
6
2
3
5
```

分析：

第一轮 script：

```text
1
注册 Timer A
注册 Promise 微任务 A
7
```

同步输出：

```text
1
7
```

清空微任务。

执行 Promise 微任务 A：

```text
4
```

同时：

```text
注册 Timer B
```

并且链式 `.then()` 会继续产生下一个 Promise 微任务。

所以接着：

```text
6
```

此时微任务清空。

宏任务队列：

```text
Timer A
Timer B
```

执行 Timer A：

```text
2
```

Timer A 内部产生微任务：

```text
3
```

Timer A 执行完成后，立即清空微任务：

```text
3
```

然后下一个 Timer：

```text
5
```

最终：

```text
1
7
4
6
2
3
5
```

---

## 18. 经典题七：queueMicrotask

代码：

```js
console.log(1)

queueMicrotask(() => {
  console.log(2)
})

Promise.resolve().then(() => {
  console.log(3)
})

setTimeout(() => {
  console.log(4)
}, 0)

console.log(5)
```

结果：

```text
1
5
2
3
4
```

因为：

```text
queueMicrotask
Promise.then
```

都进入微任务队列。

它们按进入队列的先后顺序执行。

---

## 19. Promise 链为什么会产生多个微任务

看：

```js
Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
```

不要理解为两个 `.then()` 一开始全部同时进入微任务队列。

第一个 `.then()` 先进入微任务。

当第一个 `.then()` 执行完成后，对应的新 Promise 状态完成。

然后：

```js
.then(() => {
  console.log(2)
})
```

才会进入后续微任务。

所以 Promise 链本质上是：

```text
Promise
 ↓
微任务1
 ↓
Promise 状态变化
 ↓
微任务2
 ↓
Promise 状态变化
 ↓
微任务3
```

---

## 20. 一个非常重要的误区：setTimeout(fn, 0) 不是立即执行

```js
setTimeout(() => {
  console.log('hello')
}, 0)
```

并不代表：

```text
0ms 后一定执行
```

更准确地说：

> 最早在计时条件满足以后，回调才有资格进入对应任务调度，真正执行还要等主线程空闲以及前面的任务执行结束。

例如：

```js
setTimeout(() => {
  console.log('timer')
}, 0)

const start = Date.now()

while (Date.now() - start < 3000) {
  // 阻塞 3 秒
}
```

虽然定时器写的是：

```text
0ms
```

但至少要等同步阻塞代码运行完才能执行。

---

## 21. 浏览器事件循环与渲染

浏览器执行过程可以粗略理解为：

```text
执行一个宏任务
   ↓
清空微任务
   ↓
可能进行页面渲染
   ↓
执行下一个宏任务
```

注意是：

```text
可能渲染
```

不是每一轮事件循环浏览器都一定重新渲染页面。

---

## 22. 微任务过多可能阻塞页面

看这个代码：

```js
function loop() {
  Promise.resolve().then(loop)
}

loop()
```

它会持续产生新的微任务。

执行过程：

```text
微任务
 ↓
产生微任务
 ↓
执行微任务
 ↓
产生微任务
 ↓
……
```

由于 Event Loop 会尝试清空微任务队列，可能一直没有机会进入后续宏任务和浏览器渲染。

这就是所谓的：

```text
Microtask Starvation
微任务饥饿
```

因此微任务也不能无限使用。

---

## 23. Node.js 中的事件循环

Node.js 也有事件循环，但比浏览器更加复杂。

Node.js 事件循环常见阶段包括：

```text
timers
   ↓
pending callbacks
   ↓
idle / prepare
   ↓
poll
   ↓
check
   ↓
close callbacks
```

其中比较常见的 API：

```js
setTimeout()
setInterval()
setImmediate()
process.nextTick()
Promise.then()
```

---

## 24. Node.js 中 process.nextTick

例如：

```js
console.log(1)

Promise.resolve().then(() => {
  console.log(2)
})

process.nextTick(() => {
  console.log(3)
})

console.log(4)
```

在典型 Node.js 环境中输出：

```text
1
4
3
2
```

原因是：

```text
process.nextTick 队列
```

通常会优先于 Promise 微任务队列执行。

可以粗略理解：

```text
同步代码
   ↓
process.nextTick
   ↓
Promise 微任务
   ↓
后续 Event Loop 阶段
```

注意：

> Node.js 事件循环具体行为与版本、执行上下文和不同阶段有关，复杂问题应结合 Node.js 官方文档理解，而不要只背固定口诀。

---

## 25. setTimeout 和 setImmediate

Node.js 中：

```js
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})
```

很多人会问谁先执行。

答案是：

> 在不同上下文中顺序可能不同，不应该简单背诵“某一个永远优先”。

因为：

```text
setTimeout
```

主要属于 timers 相关调度。

而：

```text
setImmediate
```

属于 check 阶段。

特别是在 I/O 回调内部，两者顺序往往更加有规律。

因此学习 Node.js 时，需要把浏览器 Event Loop 和 Node Event Loop 区分开。

---

## 26. 浏览器中最常见任务分类

### 宏任务

常见：

```text
script
setTimeout
setInterval
MessageChannel 相关任务
I/O
事件回调
```

### 微任务

常见：

```text
Promise.then
Promise.catch
Promise.finally
queueMicrotask
MutationObserver
```

---

## 27. 做事件循环题的万能步骤

以后遇到任何 Event Loop 题，可以按照下面的方法做。

### 第一步：先找同步代码

例如：

```js
console.log()
new Promise(executor)
async 函数 await 之前
```

这些优先执行。

---

### 第二步：标记宏任务

例如：

```js
setTimeout
setInterval
```

写到：

```text
宏任务队列
```

---

### 第三步：标记微任务

例如：

```js
Promise.then
queueMicrotask
await 后续
```

写到：

```text
微任务队列
```

---

### 第四步：同步代码执行结束后清空微任务

注意：

```text
不是执行一个微任务
```

而是：

```text
清空微任务
```

---

### 第五步：执行一个宏任务

执行完以后：

```text
再次清空所有微任务
```

重复这个过程。

---

## 28. 推荐使用“队列法”做题

例如：

```js
console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

Promise.resolve().then(() => {
  console.log(3)
})

console.log(4)
```

可以画：

```text
同步：

1
4

微任务：

Promise → 3

宏任务：

Timer → 2
```

于是直接得到：

```text
1
4
3
2
```

复杂题也可以使用同样方式。

---

## 29. 再来一道面试级综合题

先不要看答案：

```js
console.log(1)

setTimeout(() => {
  console.log(2)

  Promise.resolve().then(() => {
    console.log(3)
  })
}, 0)

new Promise((resolve) => {
  console.log(4)

  resolve()
}).then(() => {
  console.log(5)

  setTimeout(() => {
    console.log(6)
  }, 0)
}).then(() => {
  console.log(7)
})

async function test() {
  console.log(8)

  await Promise.resolve()

  console.log(9)
}

test()

console.log(10)
```

---

## 30. 综合题答案

答案：

```text
1
4
8
10
5
9
7
2
3
6
```

下面一步一步分析。

---

### 第一阶段：同步代码

```js
console.log(1)
```

输出：

```text
1
```

注册 Timer：

```text
Timer A → 2
```

执行 Promise executor：

```text
4
```

并注册 Promise 微任务：

```text
微任务 A → 5
```

执行：

```js
test()
```

输出：

```text
8
```

遇到 await。

await 后续：

```text
9
```

进入微任务调度。

最后：

```text
10
```

所以同步输出：

```text
1
4
8
10
```

---

### 第二阶段：清空微任务

当前主要微任务：

```text
A → 输出 5
B → 输出 9
```

先执行 A：

```text
5
```

同时注册：

```text
Timer B → 6
```

第一段 `.then()` 完成以后：

```text
第二段 then → 7
```

进入微任务队列末尾。

此时队列：

```text
9
7
```

于是：

```text
9
7
```

所以目前：

```text
1
4
8
10
5
9
7
```

---

### 第三阶段：执行 Timer A

输出：

```text
2
```

并产生 Promise 微任务：

```text
3
```

当前 Timer A 宏任务结束以后，必须立即清空微任务。

所以：

```text
3
```

---

### 第四阶段：执行 Timer B

输出：

```text
6
```

最终：

```text
1
4
8
10
5
9
7
2
3
6
```

---

## 31. 最核心的记忆口诀

如果只记一段内容，请记下面这段：

```text
1. JavaScript 先执行同步代码。

2. Promise.then、queueMicrotask、await 后续属于微任务。

3. setTimeout、setInterval 等通常属于宏任务。

4. 一个宏任务执行结束以后，要把微任务队列全部清空。

5. 微任务执行时产生的新微任务，也会继续在当前轮执行。

6. 清空微任务以后，才进入下一个宏任务。

7. Promise 构造函数本身是同步执行的。

8. await 之前同步执行，await 后续通常通过微任务继续。

9. setTimeout(fn, 0) 并不代表立即执行。

10. Node.js 的 Event Loop 与浏览器不完全相同。
```

---

## 32. 最终模型

以后看到异步代码，脑子里建立这个模型：

```text
                JavaScript

                    │
                    ▼

             ┌─────────────┐
             │   Call Stack │
             └──────┬──────┘
                    │
                    ▼
             执行同步代码

                    │
                    ▼

        ┌──────────────────────┐
        │ 当前宏任务执行完成    │
        └──────────┬───────────┘
                   │
                   ▼

        ┌──────────────────────┐
        │   Microtask Queue    │
        │ Promise / await 等   │
        └──────────┬───────────┘
                   │
                   ▼

              清空微任务

                   │
                   ▼

              浏览器可能渲染

                   │
                   ▼

        ┌──────────────────────┐
        │    Task Queue        │
        │ setTimeout 等        │
        └──────────┬───────────┘
                   │
                   ▼

              下一个宏任务

                   │
                   └───────────────→ 循环
```

---

## 33. 建议继续学习的内容

学完宏任务与微任务之后，推荐按照下面顺序继续：

```text
Event Loop
   ↓
Promise
   ↓
async / await
   ↓
Promise.all
   ↓
Promise.race
   ↓
Promise.allSettled
   ↓
for await...of
   ↓
Generator
   ↓
Async Generator
   ↓
Node.js Stream
   ↓
SSE / Streaming
```

如果你准备学习 Node.js，这些知识最终都会串起来：

```text
Event Loop
    ↓
异步 I/O
    ↓
Promise
    ↓
Stream
    ↓
HTTP
    ↓
AI Streaming
```

掌握宏任务和微任务，就是理解 JavaScript 异步编程非常关键的一步。
