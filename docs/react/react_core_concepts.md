---
title: React的核心概念和原理
date: 2025-03-15
categories:
  - React
tags:
  - React
---

## React 的核心概念

### 1. 项目的入口文件对比

main.jsx 入口文件分析与 vue3 的差异

```jsx
/**
 * 从 react 包中导入 StrictMode 组件
 * StrictMode 是 React 的严格模式组件,类似于 Vue 3 的开发模式检查
 * 它会在【开发环境】下进行额外的检查和警告,帮助你发现潜在问题
 * 不会渲染任何可见的 UI,也不会影响生产构建
 */
import { StrictMode } from 'react'

/**
 * 从 react-dom/client 包中导入 createRoot 方法
 * 这是 React 18 新的渲染 API,类似于 Vue 3 的 createApp()
 * 用于创建一个 React 根节点,然后将组件渲染到 DOM 中
 *
 * 对比 Vue 3:
 * Vue 3: createApp(App).mount('#app')
 * React: createRoot(document.getElementById('root')).render(<App />)
 */
import { createRoot } from 'react-dom/client'

/**
 * 导入全局样式文件
 * 类似于 Vue 3 中在 main.js 里 import './style.css'
 */
import './index.css'

/**
 * 导入根组件 App
 * 类似于 Vue 3 中的 import App from './App.vue'
 * 注意:React 组件文件通常使用 .jsx 或 .js 扩展名
 */
import App from './App.jsx'

/**
 * React 应用的启动流程(链式调用):
 *
 * 1. createRoot() - 创建 React 根节点
 *    参数:DOM 元素,这里获取 id 为 'root' 的 div
 *
 * 2. .render() - 将组件渲染到根节点
 *    参数:要渲染的 React 元素(JSX)
 *
 * 对比 Vue 3 的启动方式:
 *
 * Vue 3:
 * createApp(App).mount('#app')
 *
 * React 18:
 * createRoot(document.getElementById('root')).render(<App />)
 *
 * 主要区别:
 * - Vue 使用字符串选择器 '#app'
 * - React 需要传入实际的 DOM 元素对象
 */
createRoot(document.getElementById('root')).render(
  /**
   * StrictMode 包裹根组件
   * 在开发模式下会:
   * 1. 识别不安全的生命周期方法
   * 2. 检测意外的副作用
   * 3. 检测过时的 API
   * 4. 组件会渲染两次(仅开发模式),帮助发现副作用问题
   *
   * 类似于 Vue 3 开发工具的警告功能,但更严格
   */
  <StrictMode>
    {/*
      渲染 App 根组件
      JSX 语法:类似于 Vue 的模板语法,但实际上是 JavaScript
      <App /> 等同于 React.createElement(App)

      对比:
      Vue 3 模板: <App />
      React JSX: <App />

      看起来相同,但 React 的 JSX 需要编译成 JavaScript 函数调用
    */}
    <App />
  </StrictMode>
)
```

### 2. JSX 中 DOM 属性保留字

React 中的 JSX 语法中,DOM 元素的属性名是小驼峰命名法,例如 `className 而不是 class`。

| HTML           | React JSX      |
| -------------- | -------------- |
| `class`        | `className`    |
| `for`          | `htmlFor`      |
| `tabindex`     | `tabIndex`     |
| `readonly`     | `readOnly`     |
| `maxlength`    | `maxLength`    |
| `autocomplete` | `autoComplete` |

### 3. 插值赋值

React 中的 JSX 语法中,可以使用赋值语句来设置元素的属性值。

```jsx
export const UserPerfile = () => {
  const name = 'hzg'
  const age = 18
  const isTrue = true
  return (
    <div>
      <p>
        Hi, my name is {name},{age} ages old
      </p>
      <p>{isTrue ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

### 4. 组件通讯——props

#### 4.1 父传子组件
React 中,组件之间可以相互通信,这通过 props 来实现。
props可以传递的数据类型有：
- 字符串
- 数字
- 布尔值
- 数组
- 对象
- 函数
- DOM结构
- null
- undefined

```jsx
// 这里props用了js的结构,并且给props赋值的默认值
// ! props如果传递null或者0，默认值不会生效
export const Child = ({ productName = 'apple phone', price = 1234, categries = ['18', '18pro', '18promax'] }) => {
  return (
    <div>
      <h1>product:{productName}</h1>
      <h1>price:${price}</h1>
      <h1>product:{categries.join(', ')}</h1>
    </div>
  )
}
```

如果父组件的 props 中有子组件所需的所有属性，爷孙之间通讯。可以使用 js 的结构赋值来实现。

```js
// 这里props用了js的结构,并且给props赋值的默认值
export const Child = ({ productName = 'apple phone', price = 1234, categries = ['18', '18pro', '18promax'] }) => {
  return (
    <div>
      <h1>product:{productName}</h1>
      <h1>price:${price}</h1>
      <h1>product:{categries.join(', ')}</h1>
    </div>
  )
}
// 夫组件
export const Father = ({ name, ...rest }) => {
  return (
    <div>
      <h1>Son name: {name}</h1>
      <Child {...rest} />
    </div>
  )
}
```
#### 4.2 子传父组件
通过props传递的函数，子组件可以调用父组件的函数。子组件可以将数据传递给父组件，父组件可以将数据传递给其他组件。
```jsx
// 子组件
// 使用父组件传递的函数，将数据传递给父组件
export const Child = ({ productName, price, categries, callback }) => {
  return (
    <div>
      <h1>product:{productName}</h1>
      <h1>price:${price}</h1>
      <h1>product:{categries.join(', ')}</h1>
      <button onClick={() => callback({ productName, price, categries })}>Add to Cart</button>
    </div>
  )
}
// 父组件实现callback函数
export const Father = ({ name, ...rest }) => {
  // 定义一个函数，用于处理子组件传递的数据
  const handleAddToCart = (data) => {
    console.log(data)
  }
  return (
    <div>
      <h1>Son name: {name}</h1>
      <Child {...rest} callback={handleAddToCart} />
    </div>
  )
}
```

### 5. React 的插槽

React 中的插槽也是通过 props 中的 children 来实现的。props 中的 children 是一个数组,可以包含多个子元素。子元素可以是 DOM 元素,也可以是 React 组件。

```jsx
/**
 * 插槽
 */
export const CardWrapper = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {/* 插槽内容 */}
      <div className="cardContent">{children}</div>
    </div>
  )
}
```

### 6. 条件渲染

React 的条件渲染是通过 JSX 的语法来实现的。

#### 6.1 if...else 条件渲染

适合完全不同的渲染结构或者为 null 的情况

```jsx
export const ConditionRenderComponent = ({ name, isOnline, role }) => {
  if (!isOnline) return null
  else {
    return <div>renderComponent</div>
  }
}
```

#### 6.2 三元运算符

适合简单的渲染结构或者为 false 的情况，情况之间做选择。

```jsx
export const ConditionRenderComponent = ({ name, isOnline, role }) => {
  return isOnline ? <div>renderComponent</div> : null
}
```

#### 6.3 逻辑与运算符

适合显示或者隐藏的场景，当 isOnline 为 true 时，渲染 renderComponent，否则不渲染。

```jsx
export const ConditionRenderComponent = ({ name, isOnline, role }) => {
  return isOnline && <div>renderComponent</div>
}
```

#### 6.4 变量条件渲染

适合处理可以让我们逻辑变得复杂的场景。
例如，根据变量的值来渲染不同的组件，或者根据变量的值来渲染不同的属性。

```jsx
export const ConditionRenderComponent = ({ name, isOnline, role }) => {
  // 1. 条件渲染
  if (!isOnline) return null
  // 4.变量赋值
  let roleBange = null
  if (role === 'vip') {
    roleBange = <span>💎VIP</span>
  } else if (role === 'admin') {
    roleBange = <span>👮‍♂️Admin</span>
  }
  return (
    <div>
      <h1>ConditionRenderComponent</h1>
      <h3>name: {name}</h3>
      <span>{isOnline ? ' online' : 'office'}</span>
      {/* 2. 逻辑与运算符 */}
      <p>{isOnline && 'Not available'}</p>
      {/* 3. 三元运算符 */}
      {isOnline ? <button>Edit</button> : <small>Check back later</small>}
      {/* 4. 变量渲染 */}
      {roleBange}
    </div>
  )
}
```

#### 6.5 Activity 组件

待补充

### 7. 循环渲染

渲染重复结构的列表，例如商品列表、用户列表等。

- key 时 react 高效更新 UI 的关键，它可以帮助 react 识别出哪些元素发生了变化，从而只更新这些元素，而不是整个列表。也就是 diff 算法。

```jsx
/**
 * 渲染商品列表
 */
export const ProductList = ({ products }) => {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h1>{product.name}</h1>
          <p>price:${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

#### 7.1 不建议使用数组索引作为 key

- 数组索引是不稳定的，它可能会在数组重新排序时改变。
- 数组索引作为 key 会导致性能问题，因为 react 需要在每次渲染时都重新计算 key 的值。

如果是使用数组索引作为 key，遇到类似 todolist 的排序的情况，会导致数据发生错乱。

### 8. React 样式

#### 8.1 内联样式

使用`{{}}`来定义内联样式。

```jsx
/**
 * 内联样式
 */
export const Alert = ({ children, type = 'success' }) => {
  return (
    <div
      style={{
        backgroundColor: type === 'success' ? 'green' : 'red',
        color: 'black',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px 0'
      }}
    >
      {children}
    </div>
  )
}
```

#### 8.2 外置 css 文件

使用 import 语句引入 css 文件，然后在组件中使用 className 来应用样式。

```js
import './style/Alert.css'
export const Alert = ({ children, type = 'success' }) => {
  return <div className={`alert ${type}`}>{children}</div>
}、
```

```css
// style/Alert.css
.alert {
  padding: 10px;
  border-radius: 5px;
}

.success {
  background-color: green;
}

.error {
  background-color: red;
}
```

但是因为这种引入 css 是全局的，所以这种方式会导致样式冲突。

```jsx
export const Button = () => {
  // 背景颜色也会变成红色， 因为Alert组件的样式是全局的
  return <button className="error">Click me</button>
}
```

#### 8.3 模块化 css

使用 css 模块化来避免样式冲突。将 css 文件的类名转换为 js 对象，然后在组件中使用对象的属性来应用样式。

```js
// 修改Alert.css为Alert.module.css，导入的styles是一个对象，对象的属性是类名，属性的值是类名的css代码
import styles from './Alert.module.css'
export const Alert = ({ children, type = 'success' }) => {
  return <div className={`${styles.alert} ${styles[type]}`}>{children}</div>
}
```

### 9. React 事件处理

使用 on+事件名来绑定事件处理函数。

```jsx
/**
 * 点击事件
 */
export const CustomButton = ({ text }) => {
  const handleClick = (e) => {
    console.log('Button clicked!', e)
  }
  return <button onClick={handleClick}>{text}</button>
}
```

#### 9.1 事件传递 props

事件传递 props 是一种将事件处理函数作为 props 传递给子组件的方式。子组件可以在事件处理函数中使用 props 来访问父组件的状态。

```jsx
/**
 * 事件传递props
 */

// 子组件
export const CustomButton = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>
}
// 父组件
export const Parent = ({}) => {
  const parentHandle = (e) => {
    console.log('Parent clicked!', e)
  }
  return (
    <div>
      <CustomButton text="Click me" handleClick={parentHandle} />
    </div>
  )
}
```

### 10. React 的 State

React 的 State 是一种在组件中定义状态管理的方式。React 通过 hooks 的方式来添加。

- 组件有各自的 state，每个组件的 state 是独立的，不会影响其他组件的 state。
- 组件的 state 可以是任意类型，包括对象、数组、函数等。
- 组件的 state 可以是异步的，即在组件的渲染过程中，state 可能会被更新，但是组件的渲染结果可能会与 state 不一致。

```jsx
/**
 * 状态管理
 */
import { useState } from 'react'
export const Counter = () => {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

#### 10.1 hooks 的规则

- hooks 只能在组件的顶层调用，不能在循环、条件语句，try...catch 中调用。
- hooks 只能在组件中调用，不能在常规 js 函数中调用。
- hooks 只能在组件中调用，不能 在事件处理函数中调用。

**有个插件可以检查 hooks 的使用是否符合规则，例如 eslint 的 eslint-plugin-react-hooks 插件**

#### 10.2 State Snapshot 与批量更新

React 的重新渲染分为三个阶段： 1.触发更新； 2. 快照行为； 3. 更新函数处理依赖更新；4. 批处理重新渲染组件

UI 视图的更新是发生在第 3 阶段的。所以只有在 ui 重新渲染时，页面上的元素才会更新。

```js
export const Counter = () => {
  const [count, setCount] = useState(0)
  console.log('re-render', count) // 10
  const handleClick = () => {
    setCount(count + 1)
    console.log('count + 1', count) // 0
    setCount(count + 5)
    console.log('count + 5', count) // 0
    setCount(count + 10)
    console.log('count + 10', count) // 0
  }
  return (
    <div>
      <h1>Counter</h1>
      <button className="counter" onClick={handleClick}>
        Increment,Count: {count}
      </button>
    </div>
  )
}
```

**上面的例子中，点击按钮后，执行了三次 setCount，相当于给 React 提交了三次更新请求**。最终在渲染阶段 count 的值会从 0 变成 10，而不是从 0 变成 15。是因为，触发阶段，会产生一个 state 值的快照，快照是 0，哪怕使用了三次 setCount, count 的值也不会递增，还是 0+10。

`setCount` 不会立即修改当前函数里的 `count`。
`setCount(count + 1)`：把一个**计算好的值** 1 放进更新队列。
`setCount(prev => prev + 1)`：把一个**更新函数**放进更新队列，React 处理队列时再根据“最新状态”计算。

```text
点击事件
   ↓
提交更新 setCount(count + 1)
   ↓
提交更新 setCount(count + 5)
   ↓
提交更新 setCount(count + 10)
   ↓
React 统一处理
   ↓
重新渲染
```

> 需要注意的是：setCount 是“请求 React 更新状态”，不是直接修改当前 render 里的 count 变量。

如果想要在点击按钮 后，count 的值从 0 变成 15？React 的 setState 函数中可以传递一个函数

```js
export const Counter = () => {
  const [count, setCount] = useState(0)
  console.log('re-render', count) // 16
  const handleClick = () => {
    setCount((prev) => prev + 1)
    console.log('prev => prev + 1', count) // 0
    setCount((prev) => prev + 5)
    console.log('prev => prev + 5', count) // 0
    setCount((prev) => prev + 10)
    console.log('prev => prev + 10', count) // 0
  }
  return (
    <div>
      <h1>Counter</h1>
      <button className="counter" onClick={handleClick}>
        Increment,Count: {count}
      </button>
    </div>
  )
}
```

例子中，count 输出还是 0，那是因为，触发阶段，会产生一个 state 值的快照，快照是 0，哪怕使用了三次 setCount, count 的值也不会递增。

但是 setCount 内部，会使用上一次更新的 prev 进行重新赋值的计算。

> 总结：
>
> - 批量更新：同一事件中的多次 setState 会被合并，只触发一次渲染。
> - 值更新：React 只使用最后一次传入的值作为新 state（因为每次都是基于同一个旧 state 计算）。
> - 函数更新：React 将更新函数放入队列，渲染时依次执行，前一个的返回值作为下一个的参数，因此可以基于最新值连续累加。

#### 10.3 State 的对象更新方法。

React 的 setState 函数中可以传递一个对象，对象的 key 是 state 的 key，value 是新的 state 值。

```js
import { useState } from 'react'

export const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'Hzg',
    age: 12,
    email: 'hzgdeemail@163.com'
  })

  const updateName = () => {
    setUser({
      ...user,
      name: 'hyy'
    })
  }

  return (
    <div>
      <h3>name: {user.name}</h3>
      <p>age: {user.age}</p>
      <p>email: {user.email}</p>
      <button className="btn" onClick={updateName}>
        Click to Change name
      </button>
    </div>
  )
}
```

#### 10.4 Reducer 函数

通过`dispatch`派发动作，来更新状态。

```js
const [state, dispatch] = useReducer(reducer, initialState)
```

| 角色       | 作用                       | 类比                     |
| ---------- | -------------------------- | ------------------------ |
| `state`    | 当前状态                   | 银行余额                 |
| `dispatch` | 发送"我要做什么"的动作     | 填转账单                 |
| `reducer`  | 根据动作计算新状态的纯函数 | 银行的柜台规则，见单办事 |

```js
import { useReducer } from 'react'

// 1. reducer：纯函数，(旧状态, 动作) => 新状态
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    default:
      throw new Error(`未知动作: ${action.type}`)
  }
}

const initialState = { count: 0 }

export function Counter() {
  // 2. 创建 state 和 dispatch
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <h1>Count: {state.count}</h1>
      {/* 3. 派发动作，而不是直接改 state */}
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  )
}
```

何时使用 useState 和 useReducer
| 场景 | 推荐 |
| ---------------------- | --------------------------------- |
| 单个简单值（计数器开关、输入框） | `useState` |
| 状态是复杂对象，且更新方式有多种（增删改查） | `useReducer` |
| 多个状态的更新**总是一起发生**、互相关联 | `useReducer`（一个 state 对象统一管理） |
| 想在不同组件复用同一套更新逻辑 | `useReducer`（reducer 函数可以提到组件外复用） |
| 想给状态流转写测试 | `useReducer`（reducer 是纯函数，测试极其容易） |

### 11. 组件通讯

#### 11.1 状态提升

状态提升是指将组件的状态提升到父组件中，而不是在子组件中管理状态。方便兄弟组件之间的通信。

**当两个组件依赖同一组状态时，状态提升是一个好选择。**

```jsx
import { useState } from 'react'
// 购物车组件
// 购物车组件的状态提升到父组件中，而不是在子组件中管理状态。
export const ShopingCart = () => {
  const [cartItems, setCartItems] = useState({
    reactCourseCount: 0,
    vueCourseCount: 0
  })
  const prices = {
    reactCoursePrice: 50,
    vueCoursePrice: 40
  }

  const addReactCourseToCart = () => {
    setCartItems({
      ...cartItems,
      reactCourseCount: cartItems.reactCourseCount + 1
    })
  }
  const addVueCourseToCart = () => {
    setCartItems({
      ...cartItems,
      vueCourseCount: cartItems.vueCourseCount + 1
    })
  }
  return (
    <div>
      <ShopChoose name="React Course" price={prices.reactCoursePrice} quanlity={cartItems.reactCourseCount} addToCart={addReactCourseToCart}></ShopChoose>
      <ShopChoose name="Vue Course" price={prices.vueCoursePrice} quanlity={cartItems.vueCourseCount} addToCart={addVueCourseToCart}></ShopChoose>
      <CartSummary prices={prices} cartCount={cartItems}></CartSummary>
    </div>
  )
}
// 商品组件
export const ShopChoose = ({ name, price, quanlity, addToCart }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>${price}</p>
      <p>quanlity: {quanlity}</p>
      <button onClick={addToCart}>add to Cart</button>
    </div>
  )
}
// 购物车摘要组件
export const CartSummary = ({ prices, cartCount }) => {
  const sum = cartCount.reactCourseCount + cartCount.vueCourseCount
  const sumPrices = cartCount.reactCourseCount * prices.reactCoursePrice + cartCount.vueCourseCount * prices.vueCoursePrice
  return (
    <div>
      <p>SumQuantity: {sum}</p>
      <p>Price:{sumPrices}</p>
    </div>
  )
}
```

#### 11.2 跨组件传值——useContext

当组件嵌套很深的时候我们想要从顶层往下传递值时可以使用 useContext hook。

用来跨组件共享数据，避免通过 props 一层层手动传递（也就是常说的“prop drilling”）。

```jsx
// 文件结构
Header
├── UserInfo
│   └── Avatar
// useContext.jsx
import { createContext, useContext } from 'react'
// 创建一个上下文, 用于传递值
const MyContext = createContext({
  name: 'Panda Q',
  age: 12
})

// Header.jsx
import { UserContext } from './UserContext'
import { UserInfo } from './UserInfo'
export const Hearder = () => {
  const user = {
    name: 'hjzg',
    age: 145
  }
  return (
    // 使用UserContext包裹UserInfo组件, 传递user对象
    <UserContext value={user}>
      <div>
        <UserInfo />
      </div>
    </UserContext>
  )
}

// avatar.jsx
// 这里也可以使用use来获取上下文，两者的区别是use不需要遵守hooks的规范。
import { useContext } from 'react'
import { UserContext } from './UserContext'
export const Avater = () => {
  const user = useContext(UserContext)
  return (
    <div>
      <h3>name: {user.name}</h3>
      <p>age: {user.age}</p>
    </div>
  )
}
```

### 12. useEffect
`useEffect` 是 React 中最常用的 Hook 之一，用来处理副作用。所谓副作用，就是那些不能直接在渲染期间执行的操作，比如：请求数据、订阅事件、手动修改 DOM、设置定时器等。

**简单理解：组件渲染完之后，你想做一些额外的事情，就用 useEffect。**


#### 12.1 基本用法
```js
import { useEffect } from 'react';

useEffect(() => {
  // 副作用代码（组件渲染后执行）
}, [依赖项]);
```
- 第一个参数是一个函数，里面写副作用代码。
- 第二个参数是依赖数组，控制这个副作用什么时候重新执行。

#### 12.2 依赖项三种情况

- 依赖项为空：每次渲染后都执行
```js
useEffect(() => {
  console.log('组件每次渲染后都会执行');
});
```
很少这样用，因为可能造成性能浪费或无限循环（如果在里面 setState 且没有条件控制）。

- 空数组：副作用只在组件渲染时执行一次，不会在依赖项变化时重新执行。
```js
useEffect(() => {
  console.log('只在组件第一次挂载时执行');
}, []);
```

- 非空数组：副作用在组件渲染时执行一次，当依赖项变化时重新执行。
```js
useEffect(() => {
  console.log('依赖项变化后执行');
}, [依赖项]);
```

### 12.3 清理副作用
有些副作用需要清理，比如清除定时器、取消订阅、移除事件监听，防止内存泄漏。

在 useEffect 的函数里返回一个函数，这个返回的函数就是清理函数。它会在**组件卸载时**和**下一次副作用执行前**被调用。


```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('每秒执行一次');
  }, 1000);

  // 清理函数
  return () => {
    clearInterval(timer);
    console.log('定时器被清除');
  };
}, []);
```
### 12.4 示例：
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let ignore = false; // 用于避免组件卸载后 setState
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setUser(data);
      });

    return () => {
      ignore = true; // 清理函数：标记已卸载
    };
  }, [userId]); // userId 变化时重新请求

  if (!user) return <div>加载中...</div>;
  return <div>{user.name}</div>;
}
```



### React.Fragment

React.Fragment 是 React 提供的一种特殊的组件，用于在不创建额外的 DOM 元素的情况下，将多个子元素组合在一起。

```jsx
/**
 * 使用 React.Fragment 组合多个子元素
 */
<React.Fragment>
  <h1>Hello, React!</h1>
  <p>这是一个 React.Fragment 组件</p>
</React.Fragment>

// 渲染结果:
//   <h1>Hello, React!</h1>
//   <p>这是一个 React.Fragment 组件</p>
```

但是每次这么写都很麻烦，所以我们可以直接使用 React.Fragment 组件的语法糖，即 `<>...</>`。

```jsx
/**
 * 使用 React.Fragment 组件的语法糖
 */
<>
  <h1>Hello, React!</h1>
  <p>这是一个 React.Fragment 组件</p>
</>
```
