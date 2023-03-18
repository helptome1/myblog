---
title: 空置合并运算符??和可选链路操作符?.
date: 2021-11-30
categories:
 - JavaScript
tags:
 - JavaScript
---


# Js的高级运算符??与?.

## 空置合并运算符**`??`**

逻辑操作符，只有左侧为null和undefined时，才返回右侧的数

```TypeScript
const sum = null ?? 12
console.log(sum);
//输出12
const sum1 = 23 ?? 12
console.log(sum1);
//输出23

const sum2 = undefined ?? 12
console.log(sum2);
//输出12
const sum3 = 0 ?? 1 //0
const sum3 = '' ?? 2 //''

```

### ?? 和 ||对比

```JavaScript
  // ??
  undefined ?? 2    // 2
  null ?? 2        // 2
  0 ?? 2            // 0
  "" ?? 2            // ""
  true ?? 2        // true
  false ?? 2        // false

  // ||
  undefined || 2    // 2
  null || 2        // 2
  0 || 2            // 2
  "" || 2            // 2
  true || 2        // true
  false || 2        // 2

```

判断的方法不同：

- 使用 ?? 时，只有前端的数值为 null 或者 undefined 时才会返回 two;
- 使用 || 时，前者会先转化为布尔值判断，为true时返回One , false 返回Two



## 可选链接操作符**`?.`**

可以读取位于连接对象链深处属性的值，不必明确验证链中的每个引用是否有效。用来简化三元运算符或者&&运算符

```JavaScript
var street = user.address && user.address.street;

var fooInput = myForm.querySelector('input[name=foo]')
var fooValue = fooInput ? fooInput.value : undefined

// 简化
var street = user.address?.street
var fooValue = myForm.querySelector('input[name=foo]')?.value
复制代码
```

功能类似于**`“.”`** 链式操作符，不同之处在于，在引用为空**`null `**或者 **`undefined `**的情况下不会引起错误，该表达式短路返回值是 **`undefined`**；与函数调用一起使用时，如果给定的函数不存在，则返回 undefined。



```TypeScript
const fa = {
      name: 'lming',
      son: {
        name: 'lqq'
      }
    };
const duc = fa.duc?.name;
console.log(duc);
//输出undefined

```

