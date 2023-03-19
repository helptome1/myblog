---
title: 正则表达式中的lastIndex
date: 2022-07-24
categories:
 - JavaScript
tags:
 - RegExp
---

首先先来看一个例子：

```javascript
regexp = /abcd/g;
var str = ‘abcdefg’;
alert(regexp.test(str)); //true
alert(regexp.test(str)); //false
alert(regexp.test(str)); //true

var str = "abcdefgabcdefgabcdefg"
regexp.exec(str)//['abcd', index: 0, input: 'abcdefgabcdefgabcdefg', groups: undefined]
regexp.exec(str)//['abcd', index: 7, input: 'abcdefgabcdefgabcdefg', groups: undefined]
regexp.exec(str)//['abcd', index: 14, input: 'abcdefgabcdefgabcdefg', groups: undefined]
regexp.exec(str)//null
regexp.exec(str)//['abcd', index: 0, input: 'abcdefgabcdefgabcdefg', groups: undefined] //regexp.lastIndex = 4
```

对于`regexp.test`匹配的同一个字符串，进行了三次匹配，但是结果却不相同，这是为什么？

当我们使用`regexp.exec(str)`进行匹配时，会得到一个对象。对象中包含了一个索引index属性。仔细观察可以看到，这个index是当前匹配成功的**开始位置。** 也就是说第二次匹配到的结果，开头的位置是index = 7。

继续匹配，直到没有匹配到任何结果时，会返回null。但是，如果我们再次执行`regexp.exec(str)`，又可以再次从0开始匹配了。

### 那么造成这一原因的罪魁祸首，就是今天的主角——正则的`lastIndex`属性。

**正则的****`lastIndex`**** 属性用于规定下次匹配的起始位置**，也是当前匹配结果的结束位置，下次匹配时会从`regexp.lastIndex`处开始。且只有在`/g`标识下才能使用。切该属性可读可写。

当方法 `exec()` 或 `test()` 再也找不到可以匹配的文本时，它们会自动把 `lastIndex` 属性重置为 0。

我们在这个例子中，第一次匹配后，`lastIndex`就会被置为4。再次执行test，它会从字符串的`index=4`处开始匹配。后面由于没有了可以匹配的结果，故而返回了false。同时，`lastIndex`也会被重置为0。

```javascript
var regexp = /abcd/g;
var str = ‘abcdefg’;
alert(regexp.test(str)); //true
alert(regexp.test(str)); //false
alert(regexp.test(str)); //true

```

所以，有时候匹配时会造成一些不必要的bug，这时候重置lastIndex就可以了。

```javascript
var regexp = /abcd/g;
var str = ‘abcdefg’;
alert(regexp.test(str)); //true
regexp.lastIndex = 0;
alert(regexp.test(str)); //true

```