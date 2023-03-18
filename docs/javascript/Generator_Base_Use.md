---
title: Generator的基本使用
date: 2021-11-10
categories:
 - JavaScript
tags:
 - JavaScript
---


::: tip 
js中Generator的使用
:::

# Generator
### Generator的使用
Generator是ES6提供的一个一步解决方案，Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

### Generator的简单使用

Generator函数的语法：
- function关键字与函数名之间有一个*号
- 函数体内部使用yield语句，定义不同的内部状态（yield在英语里的意思就是“产出”）
```js
function* g() {
    yield 'a';
    yield 'b';
    yield 'c';
    return 'ending';
}

var gen = g(); //返回一个对象
gen.next(); // 返回Object {value: "a", done: false}
gen.next(); // 返回Object {value: "b", done: false}
gen.next(); // 返回Object {value: "c", done: true}
gen.next(); // 返回Object {value: "ending", done: true}
gen.next(); // 返回Object {value: undefined, done: true}
```
#### 特点一：g()并不执行g函数
g()并不会执行g函数，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是迭代器对象（Iterator Object）。

#### 特点二：分段执行

`gen.next()`返回一个非常非常简单的对象`{value: "a", done: false}`，'a'就是g函数执行到第一个`yield`语句之后得到的值，`false`表示g函数还没有执行完，只是在这暂停。

如果再写一行代码，还是`gen.next()`;，这时候返回的就是`{value: "b", done: false}`，说明g函数运行到了第二个`yield`语句，返回的是该`yield`语句的返回值'b'。返回之后依然是暂停。

再写一行`gen.next()`;返回`{value: "c", done: false}`，再写一行`gen.next()`;，返回`{value: "ending", done: true}`，这样，整个g函数就运行完毕了。

### 疑问：
1. 如果只有return语句，会返回什么？
第一次调用就返回`{value: xxx, done: true}`，其中xxx是return语句的返回值。之后永远是`{value: undefined, done: true}。`

2. 用Generator函数生成多个迭代对象，会相互影响吗？
```js
function* g() {
    var o = 1;
    yield o++;
    yield o++;
    yield o++;

}
var gen = g();

console.log(gen.next()); // 1

var xxx = g();

console.log(gen.next()); // 2
console.log(xxx.next()); // 1
console.log(gen.next()); // 3
```
每个迭代器之间互不干扰，作用域独立。

3. 如果yield后面不跟任何表达式，执行时会返回什么？
会返回`{value: undefined, done: true}。`

总结一下：Generator的特点就是：
- 分段执行
- 可以控制阶段和每个阶段的返回值
- 可以知道是否执行到结尾

### yield语句
yield语句的执行逻辑：
1. 遇到yield语句，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
2. 下一次调用next方法时，再继续往下执行，直到遇到下一个yield语句。
3. 如果没有再遇到新的yield语句，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
4. 如果该函数没有return语句，则返回的对象的value属性值为undefined。

重点在：**每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行**
```js
function *g() {
    var o = 1
    yield o++
    console.log('resolve')
    yield o++
    return 'ending'
}
const gen = g()
gen.next()
gen.next()
```
上面这个例子中当我们执行第一个`gen.next()`时，`console.log('resolve')`并不会执行。只有执行第二个`gen.next()`时才会执行。

### next方法传参
一句话说：**next方法参数的作用就是给上一个yield语句赋值** 。看下面这个例子：
```js
function *g() {
    var o = 1;
    var a = yield o++;
    console.log('a = ' + a);
    var b = yield o++;
}
var gen = g();

console.log(gen.next()) // {value: 1, done: false}
console.log('------');
console.log(gen.next(11)) // {value: 2, done: false}
```
上面这个结果输出是：
```js
{value: 1, done: false}
------
a = 11
{value: 2, done: false}
```
原本a变量的值是1，但是有了next的参数，a变量现在等于next的参数，也就是11。

但是为什么g()函数中的`console.log("a", a)`会输出11呢？正是因为下面我们使用了`next(11)`进行了传参数。

首先说`，console.log(gen.next());`的作用就是输出了`{value: 1, done: false}`，注意`var a = yield o++;`，由于赋值运算是先计算等号右边，然后赋值给左边，所以目前阶段，只运算了`yield o++`，并没有赋值。

**重点**：然后说，`console.log(gen.next(11));`的作用，首先是执行`gen.next(11)`，得到什么？首先：把第`一个yield o++`重置为11，然后，赋值给a，再然后`，console.log('a = ' + a);`，打印a = 11，继续然后，`yield o++`，得到2，最后打印出来


### for...of循环
for...of循环可以自动遍历Generator函数时生成的Iterator对象，且此时不再需要调用next方法。for...of循环的基本语法是：
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

let a = foo();

for (let v of a) {
  console.log(v);
}
// 1 2 3 4 5
```

上面代码使用for...of循环，依次显示5个yield语句的值。这里需要注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。

使用generator搭配for...of实现斐波那契序列。

```js
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) { // 这里请思考：为什么这个循环不设定结束条件？
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  if (n > 1000) {
    break;
  }
  console.log(n);
}
```
由于yield语句执行时是分段的。所以当我们推出for...of循环时，并不会发生停止不了的问题。

