---
title: TypeScirpt的类型守卫
date: 2022-10-30
categories:
 - TypeScript
tags:
 - TypeScript
---

# TypeScirpt的类型守卫
## `keyof`

**`keyof`**与**`Object.keys`**略有相似，只是 **`keyof`**是取 **`interface`**的键，而且 **`keyof`**取到键后会保存为联合类型。

```TypeScript
interface iUserInfo {
  name: string;
  age: number;
}

type keys = keyof iUserInfo;//keys = "name" | "age"
```

举个例子：

实现一个**`getValue`**的方法，拿到对象的值。没使用 keyof 时：

```TypeScript
function getValue(obj: iUserInfo, key: string) {
  return obj[key]
}
const obj1 = { name: '张三', age: 18 };
const userName = getValue(obj1, 'name');
```

这样写

1. 没办法确定返回值的类型，

2. 没办法约束**`key`**的类型。

这时我们可以使用 **`keyof`**来增强 **`getValue`**函数的类型功能。

```TypeScript
function getValue<T extends iUserInfo, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const obj2 = { name: 'ls', age: 28 }
const userName2 = getValue(obj2, "name")//这里会有详细的类型提示。
```

## **`typeof`**

在 TypeScript 中，typeof 操作符可以⽤来获取⼀个变量声明或对象的类型

```TypeScript
/**
 * Parameters方法，用于提取一个函数的参数类型
 */

type TArea = (width: number, height: number, isRactangle: string) => number;

type pramas = Parameters<TArea>;//type pramas = [width: number, height: number, isRactangle: string]

// type paramsType = keyof pramas;

/**
 * typeof关键字
 * 用于提取一个变量声明或者对象的类型
 */

const hezg: Person = {
  name: 'hezg',
  age: 18
}
type hezg = typeof hezg // Person


let zoujw = {
  sex: '男',
  like: 'hezg',
  jishu: 'ts'
}
type zoujw = typeof zoujw
// type zoujw = {
//   sex: string;
//   like: string;
//   jishu: string;
// }

function toArray(x: number): Array<number> {
  return [x]
}

type Func = typeof toArray //(x: number) => Array<number>
```

## **`in`**

用于取联合类型的值。主要用于数组和对象的构造。且不能用于 interface！！！

```TypeScript
type name = 'firstName' | 'lastName';
type TName = {
  [key in name]: string;
};

// 结果
type TName = {
    firstName: string;
    lastName: string;
}

```

## 例子：

这是个[`gcoord`](https://github.com/hujiulong/gcoord#crs)坐标转换库中的一段源码。其中就把这三类，全部用上了。

```JavaScript
export enum CRSTypes {
  // WGS84
  WGS84 = 'WGS84',
  WGS1984 = WGS84,
  EPSG4326 = WGS84,

  // GCJ02
  GCJ02 = 'GCJ02',
  AMap = GCJ02,

  // BD09
  BD09 = 'BD09',
  BD09LL = BD09,
  Baidu = BD09,
  BMap = BD09,

  // BD09MC
  BD09MC = 'BD09MC',
  BD09Meter = BD09MC,

  // EPSG3857
  EPSG3857 = 'EPSG3857',
  EPSG900913 = EPSG3857,
  EPSG102100 = EPSG3857,
  WebMercator = EPSG3857,
  WM = EPSG3857,
}

export interface CRS {
  to: {
    [key in keyof typeof CRSTypes]?: Function;
  };
  // 这里typeof CRSTypes先把CRSTypes枚举类型变为
}
```
