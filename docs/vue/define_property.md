---
title: Vue的响应式原理
date: 2022-10-05
categories:
 - Vue
tags:
 - Vue
---

# Vue的响应式原理

### Vue2响应式原理

#### 1.defineProperty的应用
Vue2中的响应式使用了es6的defineProperty进行数据劫持。
我们使用 defineProperty来模拟劫持 Vue 中的 data

```html
<body>
    <div id="app"></div>
    <script>
        // 模拟 Vue的data
        let data = {
            msg: '',
        }
        // 模拟 Vue 实例
        let vm = {}
        // 对 vm 的 msg 进行数据劫持
        Object.defineProperty(vm, 'msg', {
            // 获取数据
            get() {
                return data.msg
            },
            // 设置 msg
            set(newValue) {
                // 如果传入的值相等就不用修改
                if (newValue === data.msg) return
                // 修改数据
                data.msg = newValue
                document.querySelector('#app').textContent = data.msg
            },
        })
        // 这样子就调用了 defineProperty vm.msg 的 set
        vm.msg = '1234'
    </script>
</body>
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad4d2fcc15f47d9a3df0db8878ffba5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)


#### 2. defineProperty劫持多个数据
上面的例子中，defineProperty只能劫持一个数据。但是vue的data中通常会有很多的数据。那就需要我们遍历data数据对每一项进行劫持。

```html
<body>
    <div id="app"></div>
	<script>
        // 模拟 Vue的data
        let data = {
            msg: '哈哈',
            age: '18',
        }
        // 模拟 Vue 实例
        let vm = {}
        // 把多个属性转化 响应式
        function proxyData() {
            // 把data 中每一项都[msg,age] 拿出来操作
            Object.keys(data).forEach((key) => {
                // 对 vm 的 属性 进行数据劫持
                Object.defineProperty(vm, key, {
                    // 可枚举
                    enumerable: true,
                    // 可配置
                    configurable: true,
                    // 获取数据
                    get() {
                        return data[key]
                    },
                    // 设置 属性值
                    set(newValue) {
                        // 如果传入的值相等就不用修改
                        if (newValue === data[key]) return
                        // 修改数据
                        data[key] = newValue
                        document.querySelector('#app').textContent = data[key]
                    },
                })
            })
        }
        // 调用方法
        proxyData(data)

	</script>
</body>
```

### Vue3中响应式原理

Vue3中使用了es6新增的Proxy对象。

#### Proxy的使用
```js
const p = new Proxy(target, handler)
```

- `target`: 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
- `handler`: 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

我们同样写一个例子：
```html
<body>
    <div id="app"></div>
    <script>
            // 模拟 Vue data
            let data = {
                msg: '',
                age: '',
            }
            // 模拟 Vue 的一个实例
            // Proxy 第一个
            let vm = new Proxy(data, {
                // get() 获取值
                // target 表示需要代理的对象这里指的就是 data
                // key 就是对象的 键
                get(target, key) {
                    return target[key]
                },
                // 设置值
                // newValue 是设置的值
                set(target, key, newValue) {
                    // 也先判断下是否和之前的值一样 节省性能
                    if (target[key] === newValue) return
                    // 进行设置值
                    target[key] = newValue
                    document.querySelector('#app').textContent = target[key]
                },
            })
    </script>
</body>
```
当我们获取`data`中的数据，和修改`data`中数据时，就会触发`set`和`get`
```js
// 触发了set方法
vm.msg = 'haha'
// 触发了get方法
console.log(vm.msg)
```







