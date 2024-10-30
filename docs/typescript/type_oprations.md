---
title: TypeScirpt类型体操入门
date: 2022-10-30
categories:
 - TypeScript
tags:
 - TypeScript
---

# ts类型体操入门
ts的类型体操其实就是类型编程（if...else, 变量提取），TypeScript 给 JavaScript 增加了一套静态类型系统，通过 TS Compiler 编译为 JS，编译的过程做类型检查。

既然ts可以进行类型编程，那怎么实现类型编程？有几个关键字需要学习一下。
## 类型运算
### extends
作用：类型约束、继承和拓展。用来限定某个类型。
在类型体操中用于做条件判断（三元表达式）条件判断：`extends ? :`

#### 条件类型extends? : 
```ts
type res = 1 extends 2 ? true : false; // type res = false
```
![](media/17166967202923/17167012271400.jpg)

实际运用场景：上面的例子中我们使用的静态变量做类型推导，意义不大。因为已经知道结果。

所以，**类型运算逻辑都是用来做一些动态的类型的运算的**，也就是对类型参数的运算。

```ts
type isTwo<T> = T extends 2 ? true: false;

type res = isTwo<1>; // false
type res2 = isTwo<2>; // true

```
**高级类型**的特点是**传入类型参数**，经过一系列类型运算逻辑后，返回新的类型。

### infer
用来提取类型的一部分，例如提取数组的一部分

```ts
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R] ? T : never;

type res = First<[1,2,3]>; // 1

```

这里的`extends`是用来约束ts类型的。

#### 练习
#### Push
往原有的数组里加入新的类型。
```ts
type Push<Arr extends  unknown[], Ele> = [...Arr, Ele];
type pushRes = Push<[number, string], boolean>
```

#### First
提取数组类型的第一个类型
```ts
type GetFirst<Arr extends unknown[]> = 
    Arr extends [infer First, ...unknown[]] ? First : never;

type GetFirstRes = GetFirst<[string, number, boolean, Function]> // string
```
#### Last
提取最后一个类型：
```ts
// TODO
```
#### PopArr
弹出数组类型的最后一个类型
```ts
type PopArr<Arr extends unknown[]> = 
    Arr extends [] ? [] 
        : Arr extends [...infer Rest, unknown] ? Rest : never;
        
type PopArrRes = PopArr<[string, number, Function, boolean]> 
// [string, number, Function]

```
#### ShiftArr
去除数组的头一个元素
```
// TODO：

```

### 联合类型 ｜
联合类型（Union）类似 js 里的或运算符 |，但是作用于=，代表类型可以是几个类型之一。
```ts
type Union = 1 | 2 | 3;

```

### 交叉类型 &

交叉类型（Intersection）类似 js 中的与运算符 &，但是作用于类型，代表对类型做合并。

```ts
type ObjType = {a: number } & {c: boolean};
```

### 映射类型

对象、class 在 TypeScript 对应的类型是索引类型（Index Type），映射类型就是对**索引类型**进行修改。


首先复习一些ts操作符
- `keyof`：`keyof`返回一个类型的所有可访问公共属性名称的联合类型。
```ts
 interface Person {
   name: string;
   age: number;
   gender: string;
 }
 type PersonKeys = keyof Person; // "name" | "age" | "gender"
```

- `in` 是用于遍历联合类型的运算符。

映射类型修改对象的属性和类型:
```ts
type MapType<T> = {
    [Key in keyof T]: [T[Key], T[Key], T[Key]]
}
// keyof T => "a" | "b"
// Key in "a" | "b"
// "a": []

type res = MapType<{a: 1, b: 2}>;

```

## TS内置类型实现

### Partial
把类型中的所有属性变成可选的
```ts
type partialRes = Partial<{name: string, age: number}>
// {name?: string | undefined; age?: number | undefined;}

type myPartial<T> = {
  [Key in keyof T]?: T[Key] | undefined
}

type myPartialRes = myPartial<{name: string, age: number}>
```

### Required
把类型中的可选链接变成必填

```ts
type requiredRes = Required<{name?: string, age?: number}>
// {name: string, age: number}

type myRequired<T> = {
  [Key in keyof T]-? : T[Key]
}

type myRequiredRes = myRequired<{name?: string, age?: 18}>
```









