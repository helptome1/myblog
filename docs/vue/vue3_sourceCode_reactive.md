---
title: Vue3源码解析(三)——Reactive的实现
date: 2024-04-20
categories:
  - Vue
tags:
  - Vue3
---

# Vue3 源码中 Reactive 的实现

`reactive` 是 Vue3 核心响应式系统的基础 API，它通过 `Proxy` 代理实现了真正的响应式数据。与 Vue2 使用`Object.defineProperty` 相比，它解决了以下关键问题：

- 无需通过 `Vue.set` 或 `$set` 手动添加响应式属性
- 可以直接监听数组索引和长度的变化
- 支持 Map、Set 等更多数据结构
- 提供了更好的性能和更完整的响应式能力

因此想要学习 vue3 源码，reactive 是必不可少的重要一环。

### reactive 基本用法
相信大家都用过，不过多赘述。
```js
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

// 访问和修改
console.log(state.count) // 0
state.count++ // 触发响应式更新
```

上文也说了，reactive 是基于`Proxy` 代理实现了真正的响应式数据。那究竟如何通过proxy实现呢。

```js
// 导出 reactive 函数，接收一个原始对象作为参数
export function reactive(raw) {
  // 返回一个 Proxy 代理对象，第一个参数是原始对象，第二个参数是处理器对象
  return new Proxy(raw, {
    // get 拦截器：当访问对象属性时触发
    get(target, key) {
      // 使用 Reflect.get 获取属性值，保持正常的取值行为
      const res = Reflect.get(target, key)
      // 打印日志，记录属性的访问（调试用）
      console.log('get:', key)  // 用于调试，可以删除
      TODO：依赖收集
      // 返回获取到的值
      return res
    },
    
    // set 拦截器：当设置对象属性时触发
    set(target, key, value) {
      // 使用 Reflect.set 设置属性值，保持正常的赋值行为
      const res = Reflect.set(target, key, value)
      TODO：触发依赖更新
      // 打印日志，记录属性的设置（调试用）
      console.log('set:', key, value)  // 用于调试，可以删除
      // 返回设置操作的结果（在严格模式下必须返回）
      return res
    }
  })
}
```
上面代码中有两个TODO，一个是vue3的依赖收集，一个是依赖出发。





遗留问题一：

写到这里产生一个疑问。就是为什么源码中使用了`Reflect.get/set`Api来对对象进行取值和赋值。经过一番查找资料。大致总结了一下几个原因：


使用 `Reflect` 有几个重要原因：

1. **正确的 `this` 绑定**:
```typescript
const user = {
  _name: 'John',
  get name() {
    return this._name  // this 的指向很重要
  }
}

// 不使用 Reflect
const proxy1 = new Proxy(user, {
  get(target, key) {
    return target[key]  // 可能会导致 this 指向错误
  }
})

// 使用 Reflect
const proxy2 = new Proxy(user, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver)  // 保持正确的 this 指向
  }
})
```

2. **返回值的可靠性**:
```typescript
const target = {}
Object.defineProperty(target, 'foo', {
  configurable: false
})

// 不使用 Reflect
try {
  delete target.foo  // 静默失败，返回 false
} catch {}

// 使用 Reflect
if (Reflect.deleteProperty(target, 'foo')) {
  // 成功删除
} else {
  // 删除失败
}
```

3. **操作的统一性**:
```typescript
// 不使用 Reflect
const proxy = new Proxy(target, {
  get(target, key) {
    // 需要处理各种边界情况
    if (typeof target[key] === 'function') {
      return target[key].bind(target)
    }
    return target[key]
  }
})

// 使用 Reflect
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    // Reflect 会处理所有边界情况
    return Reflect.get(target, key, receiver)
  }
})
```

4. **更好的错误处理**:
```typescript
// 不使用 Reflect
const obj = {}
try {
  Object.defineProperty(obj, 'foo', {
    value: 1,
    writable: false
  })
} catch (e) {
  console.error('操作失败')
}

// 使用 Reflect
if (!Reflect.defineProperty(obj, 'foo', {
  value: 1,
  writable: false
})) {
  console.error('操作失败')
}
```

5. **接收第三个参数 receiver**:
```typescript
const obj = {
  get foo() {
    return this.bar
  },
  bar: 1
}

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    // receiver 是代理对象或继承代理对象的对象
    return Reflect.get(target, key, receiver)
  }
})
```

总结：
1. 提供了正确的 `this` 绑定
2. 提供了统一的操作方式
3. 提供了更好的错误处理机制
4. 提供了返回值的可靠性
5. 与 Proxy 的 API 设计保持一致

这就是为什么 Vue 3 在实现响应式系统时选择使用 `Reflect`，它提供了更可靠和统一的对象操作方式。




## 总结
