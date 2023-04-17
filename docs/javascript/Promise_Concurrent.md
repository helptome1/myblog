---
title: Promise 并发控制
date: 2023-04-17
categories:
  - JavaScript
tags:
  - JavaScript
---

# Promise 并发控制

## 背景

不管是面试还是工作中，promise 的并发控制，一直是比较常用的功能。

开发中需要在多个 promise 处理完成后执行后置逻辑，通常使用
`Promise.all`：`Primise.all([p1, p2, p3]).then((res) => ...)`

但是有个问题是，因为 promise 创建后会立即执行，也就是说传入到 promise.all 中的多个 promise 实例，在其创建的时候就已经开始执行了。

如果这些实例中执行的异步操作都是 http 请求，那么就会在瞬间发出 n 个 http 请求，这样显然是不合理的；更合理的方式是：对 `Promise.all` 中异步操作的执行数量加以限制，同一时间只允许有 limit 个异步操作同时执行。

## 问题：

要求写一个方法控制 Promise 并发数量，如下：

`promiseConcurrencyLimit(limit, array, iteratorFn)`

- `limit` 是同一时间执行的 promise 数量
- `array` 是参数数组
- `iteratorFn` 每个 promise 中执行的异步操作。

## 解决思路和实现

### 思路

- 先初始化 limit 个 promise 实例，将它们放到 executing 数组中
- 使用 Promise.race 等待这 limit 个 promise 实例的执行结果
- 一旦某一个 promise 的状态发生变更，就将其从 executing 中删除，然后再执行循环生成新的 promise，放入 executing 中
- 重复 2、3 两个步骤，直到所有的 promise 都被执行完
- 最后使用 Promise.all 返回所有 promise 实例的执行结果

### 实现

```js
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [] // 用于存放所有的promise实例
  const executing = [] // 用于存放目前正在执行的promise
  for (const item of array) {
    const p = Promise.resolve(iteratorFn(item)) // 防止回调函数返回的不是promise，使用Promise.resolve进行包裹
    ret.push(p)
    if (poolLimit <= array.length) {
      // then回调中，当这个promise状态变为fulfilled后，将其从正在执行的promise列表executing中删除
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= poolLimit) {
        console.log('execting', executing)
        // 一旦正在执行的promise列表数量等于限制数，就使用Promise.race等待某一个promise状态发生变更，
        // 状态变更后，就会执行上面then的回调，将该promise从executing中删除，
        // 然后再进入到下一次for循环，生成新的promise进行补充
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}
```

测试代码:

```js
const timeout = (i) => {
  console.log('开始', i)
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(i)
      console.log('结束', i)
    }, i)
  )
}

;(async () => {
  const res = await asyncPool(2, [1000, 5000, 3000, 2000], timeout)
  console.log(res)
})()
```

同时这也是[tiny-async-pool](https://github.com/rxaviers/async-pool/blob/1.x/lib/es7.js)的实现原理。
