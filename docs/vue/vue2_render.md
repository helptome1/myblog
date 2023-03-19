---
title: Vue的Render函数
date: 2022-09-07
categories:
  - Vue
tags:
  - Vue
---
# Vue的Render函数
### Vue的整体流程

在学习render函数之前，咱们先看一下Vue的一些基本概念，从宏观了解vue的整体流程。

![](https://secure2.wostatic.cn/static/qSEsYRsjqqCfxMkBzo1tyP/vue-render-1.jpg?auth_key=1679217275-pPvamZkQUFUDM3zMxf7p4v-0-8f584c2b84e0647c87744d3c3709e44a)



从上图中，不难发现一个Vue的应用程序是如何运行起来的，模板通过编译生成AST，再由AST生成Vue

的`render`函数（渲染函数），渲染函数结合数据生成Virtual DOM树，Diff和Patch后生成新的UI。从

这张图中，可以接触到Vue的一些主要概念：



- **模板**：Vue的模板基于纯HTML，基于Vue的模板语法，我们可以比较方便地声明数据和UI的关系。
- **AST**：AST是**Abstract Syntax Tree**的简称，Vue使用HTML的Parser将HTML模板解析为AST，并且对AST进行一些优化的标记处理，提取最大的静态树，方便Virtual DOM时直接跳过Diff。
- **渲染函数**：渲染函数是用来生成Virtual DOM的。Vue推荐使用模板来构建我们的应用界面，在底层实现中Vue会将模板编译成渲染函数，当然我们也可以不写模板，直接写渲染函数，以获得更好的控制 （这部分是我们今天主要要了解和学习的部分）。
- **Virtual DOM**：虚拟DOM树，Vue的Virtual DOM Patching算法是基于**[Snabbdom](https://github.com/snabbdom/snabbdom)**的实现，并在些基础上作了很多的调整和改进。
- **Watcher**：每个Vue组件都有一个对应的`watcher`，这个`watcher`将会在组件`render`的时候收集组件所依赖的数据，并在依赖有更新的时候，触发组件重新渲染。你根本不需要写`shouldComponentUpdate`，Vue会自动优化并更新要更新的UI。



`render`函数可以作为一道分割线，`render`函数的左边可以称之为**编译期**，将Vue的模板转换为**渲染函**

**数**。`render`函数的右边是Vue的运行时，主要是基于渲染函数生成Virtual DOM树，Diff和Patch。

## render函数作用：

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，真的需要 JavaScript 的完全

编程的能力。这时可以用渲染函数，它比模板更接近编译器。

`render` 函数和 `template` 一样都是创建 html 模板的，但是有些场景中用 template 实现起来代码冗长繁

琐而且有大量重复，这时候就可以用 render 函数。

## render函数的使用

`render` 函数即渲染函数，它是个函数接收两个参数，第一个参数 `createElement` 也是个函数。第二个参数`context`存储了一些其他组件传过来的数据；

上边的代码中 `render: h => h(App)` ，这是 ES6的箭头函数的写法，可以把 `h` 当作 `createElement` 的

别名。所以这段代码其实相当于：

render函数会return一个虚拟dom，return什么该组件就渲染什么

```Vue
export default {
  name: 'Test',
  // render作用:会return一个虚拟dom，return什么该组件就渲染什么
  render: (h, context) => { // 第二个参数context存储了一些其他组件传过来的数据
    console.log('context', context)
    // h(标签名/组件,{虚拟dom配置},子集:子虚拟dom,也是虚拟dom节点信息,支持字符串与数组)
    return h('h3', { class: 'abc' }, [h('h4', { class: 'abc2' }, '我是h4')])
  }
}
```

### createElement函数

这个函数的作用就是生成一个 VNode节点，render 函数得到这个 VNode 节点之后，返回给 Vue.js 的 mount 函数，渲染成真实 DOM 节点，并挂载到根节点上。

`createElement`接收三个参数，

1. 一个 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。类型：String | Object | Function。必需。
2. 一个包含模板相关属性的数据对象，你可以在 template 中使用这些特性。类型：Object。可选。
3. 子虚拟节点 (VNodes)，由 createElement() 构建而成，也可以使用字符串来生成“文本虚拟节点”。类型：String | Array。可选。



```Vue
createElement 参数

// @return {VNode}
createElement(
  // {String | Object | Function}
  // 一个HTML标签字符串，组件选项对象，或者一个返回值类型为String/Object的函数。该参数是必须的
  'div',

  // {Object}
  // 一个包含模板相关属性的数据对象，这样我们可以在template中使用这些属性，该参数是可选的。
  {
    见下一个代码块
  },

  // {String | Array}
  // 子节点（VNodes）由 createElement() 构建而成。可选参数
  // 或简单的使用字符串来生成的 "文本节点"。
  [
    'xxxx',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'xxx'
      }
    })
  ]
)
```

第二个参数，数据对象的具体参数。



```Vue
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML attribute
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM property
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层 property
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
```

