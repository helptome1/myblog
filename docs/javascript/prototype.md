---
title: 原型和原型链
date: 2021-10-03
categories:
 - JavaScript
tags:
 - JavaScript
---

## 原型和原型链的名次解释
1. `prototype` -> 原型
2. `__proto__`-> 原型链

## 原型和原型链的从属关系
首先我们要理解，原型和原型链究竟是什么东西？
* `prototype`：是函数的一个属性。专业的叙述应该是：原型是函数的`prototype`属性。它就是一个普通的对象`{}`.
```js
function Test() {}
console.log(Test.prototype)
//{ constructor: {}, prototype: ...} 不管里面是什么，它就是一个普通的对象。
```
* `__proto__`：是对象（`Object`）的一个属性。也是一个普通的对象`{}`.
```js
const test = new Test() // test是一个实例对象，__proto__是实例对象test的一个属性
console.log(test.__proto__)//{ constructor: {}, prototype: ...}
```
那么两者的从属关系就是：

* <u>实例对象的`__proto__`保存着该对象**构造函数**的`prototype`</u>
什么意思呢？
```js
console.log(Test.prototype === test.__proto__) // true
```
构造函数Test()的prototype保存在它实例对象test的`__proto__`中。这样说你应该能够明白了。

那接下来问题来了。上面讲`__proto__`时说它是对象的一个属性。既然如此，`prototype`也是一个对象，那它有`__proto__`属性吗？答案当然是肯定的。

我们尝试输出:
```js
console.log(Test.prototype.__proto__)
```
得到了下图的结果：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/849dba16e48f4b5cb9518926a139febb~tplv-k3u1fbpfcp-watermark.image?)
那`Test.prototype.__proto__`里面保存的又是哪一个构造函数的prototype呢？

```js
console.log(Test.prototype.__proto__ === Object.prototype) // true
```

我们对比发现，保存的是`Object.prototype`对象。打破砂锅问到底，我们再往上找

```js
console.log(Object.prototype.__proto__) // null
```

发现`Object.prototype.__proto__`为`null`.

而这么一条，**从实例对象开始，到`Object.prototype.__proto__`结尾的链条就是原型链。**

## 原型链
说了这么多好像还没说到原型链。让我们实际操作再了解一下: 写下下面的代码，并输出。
```js
    function Test() {
      this.name = 'test'
    }
    Test.prototype.age = 18
    Object.prototype.sex = 'Man'
    const test = new Test()
        
    console.log(test.name) // test
    console.log(test.age) // 18
    console.log(test.sex) // Man
```

我们看到，在`Test`函数中并没有声明`age`和`sex`，但是我们仍然可以输出结果。这是为什么？我们画出上面代码对应的原型链。

```js
    test { //实例
      name: 'test',
      __proto__: Test.prototype = { //构造函数原型
        age: 18,
        __proto__: Object.prototype = { // Object原型
          sex: 'Man',
          __proto__: null
        }
      }
    }
```

当我们输出`test.age`时，实例对象`test`中没有`age`属性，就会自动去实例的`__proto__`保存的构造函数的`prototype`对象中查找该属性，直到找到最顶层。这就是为什么，我们可以输出，`Test`函数中没有声明，而在`test实例`和`Object`中声明的属性了。

## 判断当前对象包含某个属性
1. 使用`hasOwnProperty`属性来判断当前对象本身（不包括原型链）上有没有该属性。
2. 使用 `in` 来检测对象原型链上有没有该属性。

```js
console.log(test.hasOwnProperty('name')) // true
console.log('Man' in test) // true
```
## constructor
`constructor`指向的是实例化`test`的构造函数`Test`
```js
console.log(test.constructor === Test) // true
```
并且`constructor`可以被修改。这点要注意！