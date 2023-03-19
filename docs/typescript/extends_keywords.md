---
title: TS的extends关键字
date: 2022-11-15
categories:
 - TypeScript
tags:
 - TypeScript
---

::: tip 
单独写一篇内容来记录extends关键字。是因为它确实很重要，在项目中经常会用到它。而且，如果想更深层次的学习ts。extends关键字是不可避免的要精通的内容。
:::

## **`extends`**关键字
不同场景下有三种不同的作用：

1. 继承和拓展，
2. 泛型约束
3. 类型分配

### 继承

继承类型拓展; 但是但是注意：A extends B，是指类型A可以分配给类型B，而不是说类型A是类型B的子集

```TypeScript
/**
 * extends关键字
 * 不同场景下有三种不同的作用：1.继承和拓展，2.约束，3.分配
 */

// 1. 继承, 继承类型拓展; 但是但是注意：A extends B，是指类型A可以分配给类型B，而不是说类型A是类型B的子集
interface Animal {
  kind: string;
  bark(): void;
}

interface Dog extends Animal {
  bark(): void;
}

type DogType = keyof Dog //"bark" | "kind"


```



### 泛型约束

在书写泛型的时候，我们往往需要对类型参数作一定的限制，比如希望传入的参数都有 name 属性的数组我们可以这么写:

```TypeScript
// 2. 泛型约束
// 在书写泛型的时候，我们往往需要对类型参数作一定的限制，比如希望传入的参数都有 name 属性的数组我们可以这么写:

function getName<T extends { name: string }>(entry: T[]): string[] {
  return entry.map(item => item.name)
}

let getNameResult = getName([{ name: 'hezg', age: 18 }, { name: 'zoujw' }])
//[ 'hezg', 'zoujw' ]

```



### 类型分配

`extends`还有一大用途就是用来判断一个类型是不是可以分配给另一个类型，这在写高级类型的时候非常有用，举个例子

```TypeScript
  type Human = {
    name: string;
  }
  type Duck = {
    name: string;
  }
  type Bool = Duck extends Human ? 'yes' : 'no'; // Bool => 'yes'
```

但是如果Human中多一个属性

```TypeScript
  type Human = {
    name: string;
    occupation: string;
  }
  type Duck = {
    name: string;
  }
  type Bool = Duck extends Human ? 'yes' : 'no'; // Bool => 'no'
```

当我们给`Human`加上一个**`occupation`**属性，发现此时**`Bool`**是**`'no'`**，这是因为 **`Duck `**没有类型为**`string`**的**`occupation`**属性，类型**`Duck`**不满足类型**`Human`**的类型约束。因此，**`A extends B`**，**是指类型A可以分配给类型B，而不是说类型A是类型B的子集**，理解extends在类型三元表达式里的用法非常重要。

继续看代码：

```TypeScript
type A1 = 'x' extends 'x' ? string : number; // string
type A2 = 'x' | 'y' extends 'x' ? string : number; // number
  
type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'> // A3的类型是 string | number

```

P是带参数T的泛型类型，其表达式和`A1，A2`的形式完全相同，**`A3`**是泛型类型**`P`**传入参数`'x' | 'y'`得到的类型，如果将`'x' | 'y'`带入泛型类的表达式，可以看到和A2类型的形式是完全一样的，那是不是说明，A3和A2的类型就是完全一样的呢？结论显然不是一样的，为什么呢？



如果extends关键字前面是泛型。而且泛型的类型参数是联合类型，则使用**分配律**计算最终的结果；

**分配律**是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。看下面代码的分析：

```TypeScript
type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'>  // A3的类型是 string | number
// extends的前参为T，T是一个泛型参数。在A3的定义中，给T传入的是'x'和'y'的联合类型'x' | 'y'，满足分配律，于是'x'和'y'被拆开，分别代入P<T>
// P<'x' | 'y'> => P<'x'> | P<'y'>
'x' extends 'x' ? string : number // string
'y' extends 'x' ? string : number // number
// 总之，满足两个要点即可适用分配律：第一，参数是泛型类型，第二，代入参数的是联合类型

```



但是如果使用了**`[]`**把泛型包裹起来，即可阻断条件判断类型的分配，此时，传入参数T的类型将被当做一个整体，不再分配。

```TypeScript
  type P<T> = [T] extends ['x'] ? string : number;
  type A1 = P<'x' | 'y'> // number
  type A2 = P<never> // string
```







