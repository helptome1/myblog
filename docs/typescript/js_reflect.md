---
title: js的反向映射
date: 2022-10-08
categories:
 - TypeScript
tags:
 - TypeScript
 - JavaScript
---

最近在学习Ts的过程中，看到枚举类型转为js代码用到了`js的反向映射`，一时间竟不理解这是怎么实现的。

```JavaScript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
// 转为js后，是一个立即执行函数。
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
 
console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true

```

对于我来说，难点在于`Days[Days["Sun"] = 0] = "Sun";`我不懂为什么这样写，可以同时使用属性`0`和`Sun`来分别获取彼此。

js知识中很容易忽略的一个细节是，赋值操作是会返回所赋的值。

```JavaScript
console.log(demo = 'list') // 'list'
```

明白这一点后，js的反向映射就会迎刃而解。原来`Days["Sun"] = 0`在赋值过程中，会把0返回，这样第二步就变成了`Days[0] = "Sun";`所以会在Days对象中生成两个映射对象。

```JavaScript
var obj = {}
obj[obj['name'] = 0] = 'name';
console.log(obj)
// {0: 'name', name: 0}
```