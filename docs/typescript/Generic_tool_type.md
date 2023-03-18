---
title: TS内置工具类型
date: 2022-6-22
categories:
 - typescript
tags:
 - typescript
---

::: tip 
Ts的使用除了基本的类型定义外，对于Ts的泛型、内置高级类型、自定义高级类型工具等会相对陌生。本文介绍了TypeScript中最常见的一些内置工具类型。并且会不断补充和更新本文。
:::

# 泛型工具类型

## Exclude

`Exclude`是TS中的一个高级类型，其作用是从第一个联合类型参数中，将第二个联合类型中出现的联合项全部排除，只留下没有出现过的参数。

简单来说，就是把第二个联合联合类型出现的项，从第一个联合类型中排除掉，只留下没有出现过的项。

```TypeScript
type A = Exclude<'key1' | 'key2', 'key2'> // 'key1'
type B = Exclude<'key1' | 'key2' | 'key3', 'key2' | 'key1'> // 'key3'

```

### 源码定义：

```TypeScript
type Exclude<T, U> = T extends U ? never : T
```

注意，源码就是使用了`extends` 关键字进行判断；注意如果`T`是`联合类型`，则使用分配率进行了判断。当泛型`T`可以分配给泛型`U`时，返回`never`，否则返回`T`本身。

### 示例：

```TypeScript
type A = `Exclude<'key1' | 'key2', 'key2'>`
// T = 'key1' | 'key2' U = 'key2'
// type Exclude<T, U> = T extends U ? never : T
// 等价于
type A = `Exclude<'key1', 'key2'>` | `Exclude<'key2', 'key2'>`
// =>
 type A = ('key1' extends 'key2' ? never : 'key1') | ('key'2 extends 'key2' ? never : 'key2')
// =>
// never是所有类型的子类型
type A = 'key1' | never = 'key1'
```

## Extract

高级类型`Extract`和上面的`Exclude`刚好相反，它是将第二个参数的联合项从第一个参数的联合项中`提取出来`，当然，第二个参数可以含有第一个参数没有的项。

### 源码

```TypeScript
type Extract<T, U> = T extends U ? T : never
```

### 示例

```TypeScript
type CombineC = Extract<'key1' | 'key2', 'key1'> // 'key1'
type CombineQ = Extract<'key1' | 'key2', 'key1' | 'key3'> // 'key1'

```

## Pick

`Pick<T, K extends keyof T>`  的作⽤是将某个类型中的⼦属性挑出来，变成包含这个类型部分属性的⼦类型。

`Pick`的意思是，从接口T中，将联合类型K中涉及到的项挑选出来，形成一个新的接口，其中`K extends `

`keyof T`则是用来约束K的条件，即，传入K的参数必须使得这个条件为真，否则ts就会报错，也就是

说，K的联合项必须来自接口T的属性。

### 源码示例

```TypeScript
// node_modules/typescript/lib/lib.es5.d.ts
 
/
 * From T, pick a set of properties whose *keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

首先用`in` 遍历K的属性，然后 `K extends keyof T`，用来判断`K`是否是`T`的键。。然后拿到`P`对应的类型

### 示例

```TypeScript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
// 报错：类型“"title" | "noSuchKey"”不满足约束“keyof A2 ”
type A2 = Pick<Todo , 'title' | 'noSuchKey'>

```

## `Partial<T>`

`Parial<T>`的作⽤就是将某个类型⾥的属性全部变为可选项  ? 。

### 源码定义：

```TypeScript
/
 * node_modules/typescript/lib/lib.es5.d.ts
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

⾸先通过 ` keyof T` 拿到  `T` 的所有属性名，然后使⽤ `in`进⾏遍历，将值赋给  `P`，最
后通过 `T[P]` 取得相应的属性值。中间的 `?`号，⽤于将所有属性变为可选。

### 示例：

```TypeScript
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
  title: "organize desk",
  description: "clear clutter"
};
 
const todo2 = updateTodo(todo1, {
  description: "throw out trash"
});
```

在上⾯的  `updateTodo  `⽅法中，我们利⽤  `Partial<T>`  ⼯具类型，定义  `fieldsToUpdate`的类型为

`Partial<Todo>`，即：

```TypeScript
{
  title?: string | undefined;
  description?: string | undefined;
}
```

## `Record<K, T>`

`Record<K extends keyof any, T>`的作⽤是将  `K `中所有的属性的值转化为 `T `类型。

### 定义：

```TypeScript
/
 * node_modules/typescript/lib/lib.es5.d.ts
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

首先遍历`K`中的所有属性，把所有属性的值转换为`T`类型。

### 示例

```TypeScript
interface PageInfo {
  title: string;
}
 
type Page = "home" | "about" | "contact";
 
const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" }
};
```

## `Required<T>`
该工具类型能够构造一个新类型，并将实际类型参数T中的所有属性变为必选属性。示例如下：
### 基本使用
```ts
interface A {
    x?: number;
    y: number;
}

type T0 = Required<A> // { x: number; y: number }
```
### 源码
```ts
/
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```
## `Readonly<T>`
该工具类型能够构造一个新类型，并将实际类型参数T中的所有属性变为只读属性。
### 基本使用
示例如下：
```js
interface A {
    x?: number;
    y: number;
}

// { readonly x: number; readonly y: number; }
type T = Readonly<A>;

const a: T = { x: 0, y : 0};
a.x = 1; // 编译错误，不允许修改
a.y = 1; // 编译错误，不允许修改
```

### 源码
```ts
/
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

```
tips：遍历T将所有属性转换为只读属性

## `Omit<T, K>`
`Omit<T, K>`工具类型与`Pick<T, K>`工具类型是互补的，它能够从已有对象类型中剔除给定的属性，然后构建出一个新的对象类型。

### 基础用法
```ts
interface Todo {
    title: string;
    description: string;
    completed: boolean;
    createdAt: number;
}

// { title: string, completed: boolean, createdAt: number }
type TodoPreview = Omit<Todo, "description">; 

const todo: TodoPreview = {
    title: "Clean room",
    completed: false,
    createdAt: 1615544252770,
};

// { title: string, description: string }
type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
    title: "Pick up kids",
    description: "Kindergarten closes at 5pm",
};
```

### 源码
```ts
/
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### 使用ts类型体操实现
```ts
interface Person {
    name: string;
    age: number;
    sex: string;
}
type MyOmit<T extends Record<string, any>, K extends keyof any> = {
    [
        Key in keyof T as Key extends K ? never : Key
    ]: T[Key]
}

type demo = MyOmit<Person, 'name'>
// {
//     age: number;
//     sex: string;
// }
```





