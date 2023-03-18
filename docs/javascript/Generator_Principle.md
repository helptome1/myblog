---
title: 手写Generator原理
date: 2021-11-15
categories:
 - JavaScript
tags:
 - JavaScript
---


::: tip 
实现一个Generator.
:::

# 手写 Generator 原理

首先我们先看一下generator的基础使用。
```js
function* foo() {
  yield 'result1'
  yield 'result2'
  yield 'result3'
}

const gen = foo()
console.log(gen.next()) //{value: "result1", done: false}
console.log(gen.next()) //{value: "result2", done: false}
console.log(gen.next()) //{value: "result3", done: false}
console.log(gen.next()) //{value: undefined, done: true}
```

这种整齐的结构，和我们js中的 `switch` `case` 语句，也是这么地整齐，所以这两种之间应该存在一种关系。

我们尝试写一个用 `switch` `case` 来实现下：

```js
function gen$(nextStep) {
  while (1) {
    switch (nextStep) {
      case 0:
        return 'result1'
      case 2:
        return 'result2'
      case 4:
        return 'result3'
      case 6:
        return undefined
    }
  }
}
```

如代码所示，我们每次调`用gen$`然后传对应的参数，就能返回对应的值（也就是原本函数`yield`后面的值）

但是`nextStep`应该是一个自动增加的函数，应该不是我们传进去的。所以这里应该用一个闭包来实现

```js
function gen$() {
  var nextStep = 0
  return function() {
    while (1) {
      switch (nextStep) {
        case 0:
          nextStep = 2
          return 'result1'

        case 2:
          nextStep = 4
          return 'result2'

        case 4:
          nextStep = 6
          return 'result3'

        case 6:
          return undefined
      }
    }
  }
}
```

现在我们可以通过

`var a = gen$()`
获得内函数。
这样每次执行`a()`,
`nextStep`就会改成下一次执行 a()应该对应的值，并且返回相应的`result`了。

但是 Generator 的底层原理不是用闭包的。而是用一个全局变量，因为这样为了后面的实现方便很多，为了遵循原理，我们改成用全局变量来实现。

先定义一个全局变量

```js
context = {
  prev: 0,
  next: 0
}
```

```js
function gen$(context) {
  while (1) {
    switch ((context.prev = context.next)) {
      case 0:
        context.next = 2
        return 'result1'

      case 2:
        context.next = 4
        return 'result2'

      case 4:
        context.next = 6
        return 'result3'

      case 6:
        return undefined
    }
  }
}
```

第一次执行`gen$(context)`,`swtich`判断的时候，是用`prev`来判断这一次应该执行那个`case`，执行`case`时再改变`next`的值，`next`表示下次应该执行哪个`case`。第二次执行`gen$(context)`的时候，将`next`的值赋给`prev`。

但是直接返回这么一个值是不对的。我们看前面的例子是返回一个对象。那该怎么实现呢？

再把例子搬下来：

```js
function* foo() {
  yield 'result1'
  yield 'result2'
  yield 'result3'
}

const gen = foo()
console.log(gen.next()) //{value: "result1", done: false}
console.log(gen.next()) //{value: "result2", done: false}
console.log(gen.next()) //{value: "result3", done: false}
console.log(gen.next()) //{value: undefined, done: true}
```

我们发现 gen 有 next 这个方法。所以可以判断出 执行 foo 返回的应该是一个对象，这个对象有 next 这个方法。所以我们初步实现 foo 的转化后的函数。

```js
let foo = function() {
  return {
    next: function() {}
  }
}
```

而每次执行 next，就会返回拥有 value 和 done 的对象，

所以，可以完善返回值

```js
let foo = function() {
  return {
    next: function() {
      return {
        value,
        done
      }
    }
  }
}
```

但是我们这里还没定义这`value`和`done`啊，该怎么定义呢？

我们先看`value`的实现。我们在上面实现`gen$`的时候，就发现它返回的是`value`了。所以可以在这里获取\$gen 的返回值作为`value`。

但是我们这里还没定义这`value`和`done`啊，该怎么定义呢？

我们先看 value 的实现。我们在上面实现`gen$`的时候，就发现它返回的是 value 了。所以可以在这里获取\$gen 的返回值作为`value`。

```js
let foo = function() {
  return {
    next: function() {
      value = gen$(context)
      return {
        value,
        done
      }
    }
  }
}
```

那 done 怎么定义呢？

其实 done 作为一个全局状态表示 generator 是否执行结束，因此，我们可以在

context 里定义，默认值为 false。

```js
var context = {
  next: 0,
  prev: 0,
  done: false
}
```

所以，每次返回，直接返回`context.done`就可以了。

```js
let foo = function() {
  return {
    next: function() {
      value = gen$(context)
      done = context.done
      return {
        value,
        done
      }
    }
  }
}
```

那`done`是怎么改变为`true`的。我们知道，`generator`执行到后面，就会返回`done:true`。我们可以看例子的第四个执行结果

```js
function* foo() {
  yield 'result1'
  yield 'result2'
  yield 'result3'
}

const gen = foo()
console.log(gen.next()) //{value: "result1", done: false}
console.log(gen.next()) //{value: "result2", done: false}
console.log(gen.next()) //{value: "result3", done: false}
console.log(gen.next()) //{value: undefined, done: true}
```

因此，我们需要在最后一次执行 gen\$的时候改变 context.done 的值。

思路，给 context 添加一个 stop 方法。用来改变自身的 done 为 true。在执行\$gen 的时时候让 context 执行 stop 就好

```js
var context = {
  next:0,
  prev: 0,
  done: false,
  新增代码
  stop: function stop () {
    this.done = true
  }
}

```

```js
function gen$(context) {
  while (1) {
    switch ((context.prev = context.next)) {
      case 0:
        context.next = 2
        return 'result1'

      case 2:
        context.next = 4
        return 'result2'

      case 4:
        context.next = 6
        return 'result3'

      case 6:
        新增代码
        context.stop()
        return undefined
    }
  }
}
let foo = function() {
  return {
    next: function() {
      value = gen$(context)
      done = context.done
      return {
        value,
        done
      }
    }
  }
}
```

这样执行到 case 为 6 的时候就会改变 done 的值了。

实际上这就是 generator 的大致原理

并不难理解，我们分析一下流程：

**我们定义的 function\*生成器函数被转化为以上代码**

转化后的代码分为三大块：

`gen$(_context)`由`yield`分割生成器函数代码而来

`context`对象用于储存函数执行上下文

迭代器法定义`next()`，用于执行`gen$(_context)`来跳到下一步

从中我们可以看出，**「`Generator`实现的核心在于上下文的保存，函数并没有真的被挂起，每一次`yield`，其实都执行了一遍传入的生成器函数，只是在这个过程中间用了一个`context`对象储存上下文，使得每次执行生成器函数的时候，都可以从上一个执行结果开始执行，看起来就像函数被挂起了一样」**

### Context 类

虽然我们实现了基础功能但是 generator 中每次 new g()函数的时候，迭代器都互不影响, 作用域独立。

```js
function* g() {
  var o = 1
  yield o++
  yield o++
  yield o++
}
var gen = g()

console.log(gen.next()) // 1

var xxx = g()

console.log(gen.next()) // 2
console.log(xxx.next()) // 1
console.log(gen.next()) // 3
```

看了源码之后发现， 要实现 context 的独立，需要把它写成类。并且每次执行 g()时，都要 new 一个新的类的实例。

```js
class Context {
  constructor() {
    this.next = 0
    this.prev = 0
    this.done = false
  }
  top() {
    this.done = true
  }
}
```

```js
let foo = function () {
    var context = new Context() 新增代码
    return {
        next: function () {
            value = gen$(context);
            done = context.done
            return {
                value,
                done
            }
        }
    }
}
```

### next 函数传参数

```js
function* foo() {
  var a = yield 'result1'
  console.log(a)
  yield 'result2'
  yield 'result3'
}

const gen = foo()
console.log(gen.next().value)
console.log(gen.next(222).value)
console.log(gen.next().value)
```

我们发现这里用 var a 来接收传入的参数。

当我们第一次执行`gen.next()`，foo 内部会执行到 yield 这里。还没给 a 赋值

当我们第二次执行`gen.next()`，foo 内部会再第一个 yield 这里执行。把传入的参数 222 赋值给 a.

看了源码后，知道是将我们在`generator`定义的变量提到 foo 函数顶部了。作为一个闭包的变量。

因此，居于这个思路，我们可以完善一下我们的代码。

如果我们在`gnenerator`定义了`xxx`这个变量，那么就会被提升到函数顶部

```js
function gen$(context) {
    var xxx；新增代码
    while (1) {
        switch (context.prev = context.next) {
            case 0:
                context.next = 2;
                return 'result1';

            case 2:

                context.next = 4;
                return 'result2';

            case 4:
                context.next = 6;
                return 'result3';

            case 6:

                context.stop();
                return undefined
        }
    }
}
```

如果我们将出传入的参数赋值给这个变量

那么,参数就会作为 Context 的参数。将传入的参数保存到 context 中。

```js
let foo = function() {
  var context = new Context(222) //修改代码
  return {
    next: function() {
      value = gen$(context)
      done = context.done
      return {
        value,
        done
      }
    }
  }
}
```

然后在`gen$()`执行的时候再赋值给变量

```js
function gen$(context) {
    var xxx；
    while (1) {
        switch (context.prev = context.next) {
            case 0:
                context.next = 2;
                return 'result1';

            case 2:
                xxx = context._send 新增代码
                context.next = 4;
                return 'result2';

            case 4:
                context.next = 6;
                return 'result3';

            case 6:

                context.stop();
                return undefined
        }
    }
}
```
