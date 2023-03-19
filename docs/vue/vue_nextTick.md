---
title: Vue的nextTick怎么实现
date: 2022-10-08
categories:
  - Vue
tags:
  - Vue
---

# Vue 的 nextTick 怎么实现的？

## nextTick 在 Vue 中存在的意义

因为 vue 采用的异步更新策略，当监听到数据发生变化的时候不会立即去更新 DOM，而是开启一个任务队列，并缓存在同一事件循环中发生的所有数据变更;

这种做法带来的好处就是可以将多次数据更新合并成一次，减少操作 DOM 的次数，如果不采用这种方法，假设数据改变 100 次就要去更新 100 次 DOM，而频繁的 DOM 更新是很耗性能的；

## 实现原理

由于 Vue 的双向数据绑定，更新 dom 是异步更新的，为了实现异步更新。Vue 加入了 nextTick 保证事件的执行顺序。

nextTick 将传入的回调函数包装成异步任务，异步任务又分微任务和宏任务，为了尽快执行所以优先选择微任务；

vue2并且提供了 4 种异步方法：`Promise.then`、`MutationObserver`、`setImmediate`、`setTimeout(fn,0)`，使用优雅降级的方法，给回掉函数提供异步方法。

vue3抛弃了兼容性，直接使用Promise,来实现nextTick.

基本使用：
```js
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function() {
  // DOM 更新了
})

// 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
Vue.nextTick().then(function() {
  // DOM 更新了
})
```
源码：
1.  通过`initStateMixin`方法初始化nextTick函数。
```js
export function initStateMixin(Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype.$watch = function (expOrFn, cb) {
    new Watch(this, expOrFn, { user: true }, cb)
  }
}
```
2. 把用户写的nextTick放到队列中。让多个nextTick最后一起刷新。
```js
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    timerFunc() // 多次使用nextTick，最后一起刷新。
    waiting = true
  }
}
```
3. 使用优雅降级的方式，实现nextTick的异步更新。

```js

/**
    nextTick实现方式
*/
// nextTick并不是创建一个异步任务，而是将这个任务维护到了队列中去。
// 使用p处理，使多次使用nextTick而执行一次。
let callbacks = []
let waiting = false

function flushCallbacks() {
  // 拷贝一份
  let cbs = callbacks.slice(0)
  waiting = false
  callbacks = []
  cbs.forEach((cb) => cb()) // 按照次序执行
}

// nextTick 没有直接使用某个api，来使用异步。而是优雅降级
// 内部先采用的是promise（ie不兼容） MutationObserver(h5的api) 可以考虑ie专享setImmediate ---> setTimeout
let timerFunc
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks) //这里传入的回调是异步执行的。
  let textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = setTimeout(() => {
    flushCallbacks
  }, 0)
}
```

由`nextTick`的源码可以看出，`nextTick`本质就是创建了一个微任务（不考虑`setTimeout`），将其回调推入微任务队列。vue 中一个事件循环中的所有 dom 更新操作也是一个微任务，两者属于同一优先级，执行先后只于入队的先后有关，换句话说，如果你先写了`nextTick`，再写赋值语句（在此之前没有触发 dom 更新的操作），那在`nextTick`中获取的可就不是更新后的 dom 了

<img :src="$withBase('/vue_pic/nextTick.jpg')" alt="foo">
