---
title: Vue2和Vue3中的v-model的区别
date: 2022-08-12
categories:
  - Vue
tags:
  - Vue
---

# vue2和vue3中的v-model

### 单个数据双向绑定
vue2中自定义组件的v-model是：
`v-bind:value`和`@input`的语法糖。自组件中使用`props:['value']` 来接受父组件的传值。
通过`this.$emit('input', Math.random())`来触发修改value的方法。
例如：

```html
<template>
  <div>
    <input v-model="name" class="com-input">
    <new-com v-model="name" class="new-com"></new-com>
  </div>
</template>
```
这个自定义组件通过 value 和 input 搭配来让组件支持 v-model.
```html
<!--new-com组件-->
<template>
  <div>
    <div> {{value}} </div>
    <button @click="random">随机</button>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
  },
  methods: {
    random() {
      this.$emit('input', Math.random())
    }
  }
}
</script>
```
但是这样只能绑定一个属性。那有没有办法，双向绑定多个属性呢？答案当然是有的。vue给我们提供了.sync修饰符。

### 多个数据双向绑定.sync修饰符
`.sync`修饰符可以实现子组件与父组件的双向绑定，并且可以实现子组件同步修改父组件的值。
```html
// 正常父传子： 
<son :a="num" :b="num2"></son>

// 加上sync之后父传子： 
<son :a.sync="num" .b.sync="num2"></son> 

// 它等价于
<son
  :a="num" @update:a="val=>num=val"
  :b="num2" @update:b="val=>num2=val"></son> 

// 相当于多了一个事件监听，事件名是update:a，回调函数中，会把接收到的值赋值给属性绑定的数据项中。
```
这里面的传值与接收与正常的父向子传值没有区别,唯一的区别在于往回传值的时候`$emit`所调用的事件名必须是`update:`属性名,事件名写错不会报错,但是也不会有任何的改变,这点需要多注意。

## Vue3中的双向数据绑定

> Vue2 比较让人诟病的一点就是提供了两种双向绑定：`v-model` 和 `.sync`，在 Vue3 中，去掉了 `.sync` 修饰符，只需要使用 `v-model`进行双向绑定即可。

为了让 v-model 更好的针对多个属性进行双向绑定，Vue3 作出了以下修改：

- 当对自定义组件使用 `v-model` 指令时，绑定的默认属性名由原来的 `value` 变为 `modelValue`，事件名由原来的 `input` 变为 `update:modelValue`
- 去掉了 `.sync` 修饰符，它原本的功能由 `v-model` 的参数替代
- `model` 配置被移除
- 允许自定义 `v-model` 修饰符

Vue3中数据的双向绑定其实是`v-bind:xxx`和`@update:xxx`的语法糖。

### 单个数据双向绑定
可以看到我们默认的属性是`modelValue`，那么自组件接收时也是通过`props`的`modelValue`接收到传递的值，再通过`@update:modelValue`事件改变`modelValue`的值。
```html
<child-comp v-model="msg" /> 
  
//可翻译为
<child-comp :modelValue="msg" @update:modelValue="msg=$event" /> 
```
通过一个例子:
```html
//父组件代码
<child-comp v-model="name" />
  
子组件代码：
<template>
 <input type="text" v-model="newValue">
</template>

<script>
export default {
 props:{
  modelValue:{
   type:String,
   default:''
  }
 },
 computed:{
  newValue:{
   get:function(){
    return this.modelValue
   },
   set:function(value){
    this.$emit('update:modelValue',value)
   }
  }
 }
}
</script>
```
### 多个数据双向绑定
在 vue3 中去掉了Vue2的`.sync` 修饰符。一个组件可以使用多个 `v-model` ，统一了 vue2 的 v-model 和 `.sync`修饰符。

写法就是`v-model:xxx`，它是`v-bind:xxx`和`@update:xxx`的语法糖。
```html
<child-comp v-model:name="name" v-model:age="age" /> 
  
  //可翻译为
<child-comp 
  :name="name" @update:name="name=$event"
  :age="age" @update:age="age=$event" /> 
```

那么要让组件支持双向数据绑定，vue3组件需要怎么写呢？这里使用computed的get和set方法，注意不要搞混了。
```html
//父组件代码
<child-comp v-model:name="name" v-model:age="age" /> 
  
 //子组件代码
<template>
 <div>
  <input type="text" v-model="newName">
  <input type="text" v-model="newAge">
 </div>
</template>
<script>
export default {
 props:{
  name:{
   type:String,
   default:''
  },
  age:{
   type:String,
   default:""
  }
 },
 emits:['update:name','update:age'],
 computed:{
  newName:{
   get:function(){
    return this.name
   },
  set:function(value){
    this.$emit('update:name',value)
   }
 },
 newAge:{
  get:function(){
   return this.age
  },
  set:function(value){
   this.$emit('update:age',value)
  }
  }
 }
}
</script>  
```
## 总结
Vue2的`v-model`是`v-bind:value`和`@input`的语法糖。多个数据绑定需要使用.sync修饰符。它是`v-bind:xxx`和`@update:xxx`的语法糖，这点和vue3保持一致。

Vue3的`v-model`是`v-bind:xxx`和`@update:xxx`的语法糖。xxx默认是modelValue