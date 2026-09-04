---
title: Promise原理
date: 2026-03-29
categories:
 - JavaScript
tags:
 - JavaScript
---

# Promise基础用法与原理

Promise 是 JavaScript 中用于**管理异步操作**的核心机制。它代表一个**尚未完成但预期将来会完成的操作**，并允许你以更优雅的方式处理成功和失败，避免"回调地狱"。

---

## 一、基本原理

### 1. 核心思想

Promise 是一个**状态容器**，它封装了一个异步操作，并追踪该操作的最终状态。

### 2. 三种状态

| 状态 | 含义 | 说明 |
|------|------|------|
| **Pending**（待定） | 初始状态 | 异步操作正在进行中 |
| **Fulfilled**（已完成） | 操作成功 | 调用 `resolve(value)` 后进入此状态 |
| **Rejected**（已拒绝） | 操作失败 | 调用 `reject(reason)` 后进入此状态 |

> **关键特性**：一旦状态从 Pending 变为 Fulfilled 或 Rejected，就**不可再次改变**（immutable）。

### 3. 执行器（Executor）

创建 Promise 时传入的函数，它接收两个参数：
- `resolve(value)` — 将状态变为 Fulfilled，并传递结果
- `reject(reason)` — 将状态变为 Rejected，并传递错误原因

---

## 二、基本用法

### 1. 创建 Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // 执行异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("操作成功！");  // 状态变为 Fulfilled
    } else {
      reject("操作失败！");   // 状态变为 Rejected
    }
  }, 1000);
});
```

### 2. 消费 Promise

使用 `.then()`、`.catch()`、`.finally()` 来处理结果：

```javascript
promise
  .then((value) => {
    // 状态为 Fulfilled 时执行
    console.log("成功:", value);
  })
  .catch((error) => {
    // 状态为 Rejected 时执行
    console.error("失败:", error);
  })
  .finally(() => {
    // 无论成功或失败都会执行
    console.log("操作结束");
  });
```

### 3. 完整示例

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url) {
        resolve({ data: "用户数据", status: 200 });
      } else {
        reject(new Error("URL 不能为空"));
      }
    }, 1000);
  });
}

// 使用
fetchData("https://api.example.com/user")
  .then((response) => {
    console.log("获取成功:", response.data);
    return response.data;  // 返回值会传递给下一个 then
  })
  .then((data) => {
    console.log("处理数据:", data);
  })
  .catch((error) => {
    console.error("出错了:", error.message);
  });
```

---

## 三、链式调用（Chaining）

Promise 最强大的特性之一是**链式调用**。每个 `.then()` 返回一个新的 Promise，因此可以串联多个异步操作：

```javascript
function step1() {
  return new Promise(resolve => setTimeout(() => resolve(1), 1000));
}
function step2(value) {
  return new Promise(resolve => setTimeout(() => resolve(value + 10), 1000));
}

step1()
  .then(result => {
    console.log(result);      // 1
    return step2(result);     // 返回新的 Promise
  })
  .then(result => {
    console.log(result);      // 11
    return result * 2;
  })
  .then(result => {
    console.log(result);      // 22
  });
```

### 链式调用中的错误处理

链中任何一步出错，都会被最近的 `.catch()` 捕获：

```javascript
step1()
  .then(() => { throw new Error("中间出错"); })
  .then(() => { console.log("这不会执行"); })
  .catch(err => { console.error("捕获错误:", err.message); });  // 捕获到错误
```

---

## 四、常用静态方法

| 方法 | 作用 |
|------|------|
| `Promise.resolve(value)` | 快速创建一个已完成的 Promise |
| `Promise.reject(reason)` | 快速创建一个已拒绝的 Promise |
| `Promise.all([p1, p2])` | 所有 Promise 都成功才成功，返回结果数组 |
| `Promise.race([p1, p2])` | 返回最先完成的那个 Promise 的结果 |
| `Promise.allSettled([p1, p2])` | 等所有 Promise 结束，无论成功或失败 |
| `Promise.any([p1, p2])` | 返回第一个成功的 Promise |

### 示例：`Promise.all`

```javascript
const p1 = fetch('/api/user');
const p2 = fetch('/api/orders');

Promise.all([p1, p2])
  .then(([user, orders]) => {
    console.log("用户:", user);
    console.log("订单:", orders);
  })
  .catch(err => {
    console.error("任一请求失败:", err);
  });
```

---

## 五、与 async/await 的关系

`async/await` 是 Promise 的**语法糖**，让异步代码看起来像同步代码：

```javascript
// Promise 写法
fetchData()
  .then(data => process(data))
  .catch(err => handle(err));

// async/await 写法
async function main() {
  try {
    const data = await fetchData();
    const result = await process(data);
  } catch (err) {
    handle(err);
  }
}
```

本质上，`await` 后面跟的就是一个 Promise。

---

## 六、promise基础总结

1. **Promise 是状态机**：Pending → Fulfilled / Rejected，状态不可变。
2. **通过 `.then()` 和 `.catch()` 消费结果**，支持链式调用。
3. **解决了回调地狱问题**，让异步代码更清晰。
4. **`async/await` 建立在 Promise 之上**，是现代 JS 异步编程的主流写法。

## 七、promise原理实现

### 1. 基本用法
根据promise的基础用法，先来实现一版最简单的promise

```js
// 先定义三个常量表示状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  status = PENDING

  constructor(executor) {
    // 这里resolve和reject执行要修改其this指向，否则它执行时this会发生改变。作用域不一样。
    // ! 注意这里如果不使用bind修改this指向，或者使用箭头函数声明resolve和reject那么在es6严格模式下，执行resolve时，this就会变成undefined
    executor(this.resolve.bind(this), this.reject.bind(this))
  }

  // resolve的结束和reject的原因
  value = null
  reason = null

  resolve(value) {
    if (this.status === PENDING) {
      console.log(this.value)
      this.value = value
      this.status = FULFILLED
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      console.log(this.reason)
      this.reason = reason
      this.status = REJECTED
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

const mypromise = new MyPromise((resolve, reject) => {
  resolve('Mypromise Resolve')
  reject('Mypromise reject')
})
mypromise.then(
  (value) => {
    console.log('mypromise_Resolve', value)
  },
  (reason) => {
    console.log('mypromise_Reason', reason)
  }
)
```
以上已经基本可以实现promise的基础用法。
### 2. 异步逻辑
如果在上面的例子中加入异步逻辑
```js
const promise = new MyPromise((resolve, reject) => {
  console.log('A')
  setTimeout(() => {
    console.log('settimeout')
    resolve('Mypromise Resolve')
  }, 1000)
})
promise.then(
  (value) => {
    console.log('promise_Resolve', value)
  },
  (reason) => {
    console.log('promise_Reason', reason)
  }
)
// 就会没有打印信息！！！
```
#### 2.1「原因分析」：
根据js的事件循环判断，主线程代码立即执行，`setTimeout` 是宏任务被放到宏任务队列中，但是 `promise.then` 会马上执行，这个时候判断 Promise 状态，状态是 pending，然而之前并没有判断等待这个状态，所以不会执行 `promise.then` 中的函数。

#### 2.2「如何解决这个问题」：

可以在 `then` 方法中添加一个判断，如果状态是 pending，就将成功回调函数和失败回调函数存储起来，等状态改变后再再执行。
```js
  //+++ 存储成功回调函数
  onFulfilledCallback = null
  //+++ 存储失败回调函数
  onRejectedCallback = null
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    } else if (this.status === PENDING) {
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallback = onFulfilled
      this.onRejectedCallback = onRejected
    }
  }
```

setTimeout执行时会执行resolve或者reject函数，此时在resolve和reject中再去.then中被存醋起来的回调函数。
```js
  resolve(value) {
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED
      // 执行成功回调函数
      this.onFulfilledCallback && this.onFulfilledCallback(value)
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
      // 执行失败回调函数
      this.onRejectedCallback && this.onRejectedCallback(reason)
    }
  }
```

### 3. the方法的多次调用

```js
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Mypromise Resolve')
  }, 1000); 
})

promise.then(value => {
  console.log('resolve_1', value)
})
 
promise.then(value => {
  console.log('resolve_2', value)
})

promise.then(value => {
  console.log('resolve_3', value)
})

// 执行结果是
// resolve_3 success
```
####3.1「原因分析」：

`promise.then`每执行一次都会直接出发then方法中的函数。但是多次触发只会记录最后一次then方法。所以执行结果是最后一个`promise.then`的结果。

#### 3.2「如何解决这个问题」：

新增两个数组，一个存储成功回调函数，一个存储失败回调函数。

```js
  //+++ 存储成功回调函数
  onFulfilledCallbacks = []
  //+++ 存储失败回调函数
  onRejectedCallbacks = []
```

在then方法中添加一个判断，如果状态是 pending，就将成功回调函数和失败回调函数存储起来，等状态改变后再再执行。

```js
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    } else if (this.status === PENDING) {
      // --- this.onFulfilledCallback = onFulfilled
      // --- this.onRejectedCallback = onRejected
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(onFulfilled)
      this.onRejectedCallbacks.push(onRejected)
    }
  }
```
然后在resolve和reject中再去执行存储起来的回调函数。
```js
  resolve(value) {
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED
      // --- this.onFulfilledCallback && this.onFulfilledCallback(value)
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
      // --- this.onRejectedCallback && this.onRejectedCallback(reason)
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(value)
      }
    }
  }
```
### 4. then的链式调用
- then方法返回的是一个新的promise，所以可以链式调用。

- then 方法里面 return 一个返回值作为下一个 then 方法的参数，如果是 return 一个 Promise 对象，那么就需要判断它的状态
```js
const mypromise = new MyPromise((resolve, reject) => {
  resolve('Mypromise reject')
})

function triggerMypromise() {
  return new MyPromise((resolve, reject) => {
    return resolve('triggerMypromise')
  })
}

mypromise
  .then((value) => {
    console.log(1)
    console.log('resolve', value)
    return triggerMypromise()
  })
  .then((value) => {
    console.log(2)
    console.log('resolve', value)
  })
```

当前的代码里无法实现这一点，所以我们需要在then方法中创建一个新的promise。返回它，并且返回它。

假如第一个then执行后返回的是promise，那么要考虑它的状态。
- 如果返回值是promise对象，返回值为成功，新promise就是成功
- 如果返回值是promise对象，返回值为失败，新promise就是失败


```js
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        const fulfillCallback = onFulfilled(this.value)
        this.#resolvePromise(fulfillCallback, resolve, reject)
      } else if (this.status === REJECTED) {
        const rejectedCallback = onRejected(this.reason)
        this.#resolvePromise(rejectedCallback, resolve, reject)
      } else if (this.status === PENDING) {
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        // --- this.onFulfilledCallback = onFulfilled
        // --- this.onRejectedCallback = onRejected
        // 将所有执行.then的函数全部push进去。
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })
    return promise2
  }
```
针对fulfilled和rejected两种状态，使用resolvePromise对其进行处理。

```js
#resolvePromise(callback, resolve, reject) {
  // 判断callback是否是MyPromise对象：
  // 1. 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
  // callback.then(value => resolve(value), reason => reject(reason))
  if (callback instanceof MyPromise) {
    // 如果返回值是promise对象，返回值为成功，新promise就是成功
    // 如果返回值是promise对象，返回值为失败，新promise就是失败
    callback.then(resolve, reject)
  } else {
    resolve(callback)
  }
}
```

### 5. 链式调用调用的是自己时
例如下面这种情况：
```js
const promise = new MyPromise((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then(value => {
  console.log(value)
  return p1
})
// ReferenceError: Cannot access 'p1' before initialization.
```

处理这种情况可以把then中创建的promise传入到resolvePromise中。进行判断。处理报错
```js
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 这里就需要创建一个异步函数去等待 promise2 完成初始化，queueMicrotask。否则会报错：Cannot access 'promise2' before initialization
        queueMicrotask(() => {
          const fulfillCallback = onFulfilled(this.value)
          // resolvePromise 集中处理，将 promise2 传入
          this.#resolvePromise(promise2, fulfillCallback, resolve, reject)
        })
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          const rejectedCallback = onRejected(this.reason)
          this.#resolvePromise(promise2, rejectedCallback, resolve, reject)
        })
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })
    return promise2
  }
  #resolvePromise(promise2, callback, resolve, reject) {
    // 如果相等了，说明return的是自己，抛出类型错误并返回
    if (promise2 === callback) {
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (callback instanceof MyPromise) {
      callback.then(resolve, reject)
    } else {
      resolve(callback)
    }
  }
```



















