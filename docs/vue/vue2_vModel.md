---
title: Vue中的v-model、model属性
date: 2022-06-12
categories:
  - Vue
tags:
  - Vue
---

# Vue中的v-model、model属性

## 1. 作用

通过**`v-model`**实现表单的双向绑定。这是一个官网的例子

```HTML
<input type="text" v-model="message">
<p>{{message}}</p>
```

而**`v-model`**仅仅是一个语法糖，真正的实现方式是通过**`v-bind`**和**`@input`**来实现的

```HTML
<input type="text" :value="message" @input="message = $event.target.value">
```

1. 将输入框的值绑定到 message 变量上，这只是单向的；改变 message 的值可以改变 input 的 value，但是改变 input 的输入不会改变 message。
2. 监听 input 事件，当输入类内容时改变 message 变量，从而实现了双向绑定。

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件，但是像单选框、复选框等

类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。

- **`v-model`\*\***在内部为不同的输入元素使用不同的属性并抛出不同的事件：\*\*

  text 和 textarea 元素使用 value 属性和 input 事件

  checkbox 和 radio 使用 checked 属性和 change 事件

  select 使用 value 和 change 事件

## 2. 自定义组件使用 v-model

当我们使用自定义组件的时候，要实现数据的双向绑定需要。需要用 props，和@xxx 事件来完成数据双向绑定的操作。

```Vue

// HTML部分
<div id="app">
    // 4.父组件的value值绑定到price
    <price-input :value="price" @input="onInput"></price-input>
</div>

// js部分
Vue.component('custom-input',{
    // 1.监听input,输入时触发自定义组件内部的updateVal事件
    template: `<input **:****value****='value' @****input****='updateVal($event.target.value)'** type='text'></input>`,
    // 5.通过props传递，实现父组件值绑定到输入框的value
    props: ['value'],
    methods: {
        // 2.触发父组件上的input事件
        updateVal(val){
            this.$emit('input', val);
        }
    }
});

var app = new Vue({
    el: '#app',
    data(){
        price: ''
    },
    methods: {
        // 3.传递过来的值赋给父组件的price变量，实现了输入框到父元素的单向绑定
        onInput(val){
            this.price = val;
        }
    }
})


```

可以看出来，value 的值是用 props 来接收的，input 用作事件处理。每次这样写就会很繁琐。而`model` 属性就可以来快速的实现数据的双向绑定，区分事件类型。

比如我们新建一个组件：

```Vue
<template>
    <input type="text" :value="uname" @input="updateVal($event.target.value)">
</template>

Vue.component('my-input',{
    model: {
        prop: 'uname',
        // 随便命名事件，对应下面$emit即可
        event: 'changeXXX'
    },
    props: {
        uname: {
            type: String,
            default: 'tom'
        }
    },
    methods: {
        updateVal(val){
            this.$emit('changeXXX',val)
        }
    }
})
```

父组件使用时：直接用 v-model 就可以了

```HTML
// name是父组件中的属性
<my-input v-model="name" value="some value"></my-input>
<p>{{name}}</p>
```

这里的 `name`的值将会传入这个名为 `uname`的 prop。同时当 `<my-input>` 触发一个 `changeXXX`事件并附带一个新的值的时候，这个 `name`的 property 将会被更新。

注意你仍然需要在组件的 `props` 选项里声明 `uname`这个 prop。

这样写等价于

```HTML
<my-input :uname='name' @changeXXX='val => {foo = val}' value='some value'></my-input>
```

这里的 `lovingVue` 的值将会传入这个名为 `checked` 的 prop。同时当 `<base-checkbox>` 触发一个 `change` 事件并附带一个新的值的时候，这个 `lovingVue` 的 property 将会被更新。
