---
title: 作用域与作用域链
date: 2024-03-23
categories:
 - JavaScript
tags:
 - Scope
---

# 作用域和作用域链
谈到作用域，必须要说到执行上下文。js在执行过程中会创建一个一个的可执行上下文。这些可执行上下文都关联一个**变量对象**，这个**变量对象**包含上下文中定义的所有变量和函数。也包含了外部变量的引用。

## 1.什么是作用域和作用域链
### 作用域
作用域是在可执行上文中，**变量对象**的使用范围！也可以说是：在运行时代码中的某些特定部分中的变量，函数和对象的可访问性。

首先看个例子：
```js
function outFun2() {
    var inVariable = "内层变量2";
}
outFun2();// 要先执行这个函数，否则根本不知道里面是啥
console.log(inVariable); // Uncaught ReferenceError: inVariable is not defined

```
在这个例子中`inVariable`在全局作用域没有声明，所以在`outFun2`方法之外无法访问。

因此我们可以这样理解：<u style="color: red">作用域就是一个独立的地盘，让变量不会外泄、暴露出去。也就是说作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。</u>

### 作用域链
作用域链：当前作用域没找到**自由变量**（当前作用域没有找到的变量就是自由变量），就去父级作用域找。这种一层一层的关系就是作用域链。找父级作用域链，要去创建这个函数的那个作用域中取值，这里强调的是“创建”，而不是“调用”
```js
var x = 100
function fn() {
    console.log(x)
}
function show(fn) {
    var x = 200
    (function() {
        fn() // 输出10，而不是20
    })()
}
show(fn)
```
## 2. 执行上下文和作用域
js是解释性语言，js的执行分为：解释和执行两个阶段。
#### 解释阶段：
1. 词法分析
2. 语法分析
3. 作用域规则确定

#### 执行阶段：
1. 创建执行上下文
2. 执行函数代码
3. 垃圾回收

所以**作用域在函数定义时就已经确定了，而执行上下文是在函数执行时确定的**。比如：this指向就是执行时确定的。












