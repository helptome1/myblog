---
title: Vue3源码解析(二)——Effect的实现
date: 2024-04-12
categories:
  - Vue
tags:
  - Vue3
---

# Vue3 源码中 Effect 的实现

### effect用法

首先我们看下`effect`的使用方式，`effect`在声明的时候就会执行一次，当数据发生变化的时候，会重新执行`effect`，并且会收集依赖，当依赖发生变化的时候，会触发对应的回调函数。

```js
  const user = reactive({
    age: 1
  })
  let nextAge
  effect(() => {
    nextAge = user.age + 1
  })
  console.log('nextAge', nextAge) // 2
  user.age++
  console.log('nextAge', nextAge) // 3
```
针对以上内容我们来实现一下effect。首先声明一个reactiveEffect类。
```js
  export class ReactiveEffect {
    private _fn: any
    deps = []
    constructor(fn, scheduler?: Function) {
      this._fn = fn
    }
    run() {
      if (!this.active) {
        return this._fn()
      }
    }
  }
```

## 总结
