---
title: Vue3中watch和Props
date: 2022-08-20
categories:
  - Vue
tags:
  - Vue
---

## Watch 监听

`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况下，它也是惰性的，即只有当被侦听的源发生变化时才执行回调。

### 侦听单个数据源

```JavaScript
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})

```

### 侦听多个数据源

侦听器还可以使用数组同时侦听多个源：

```JavaScript
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]

```

### 侦听响应式对象

使用侦听器来比较一个数组或对象的值，这些值是响应式的，要求它有一个由值构成的副本。

```JavaScript
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]

```

### 深度监听

尝试检查深度嵌套对象或数组中的 property 变化时，仍然需要 `deep` 选项设置为 true。

```JavaScript
const state = reactive({
  id: 1,
  attributes: {
    name: '',
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log(
      'not deep',
      state.attributes.name,
      prevState.attributes.name
    )
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log(
      'deep',
      state.attributes.name,
      prevState.attributes.name
    )
  },
  { deep: true }
)

state.attributes.name = 'Alex' // 日志: "deep" "Alex" "Alex"

```

## 组件传值

### 子父组件传值

父向子组件传值 子组件向父组件传值的代码：下面是父组件代码

```JavaScript
<template>
  <div>
    <h1>父组件</h1>
    <p>{{money}}</p>
    <hr>
    <Son :money="money"
         @changeMoney="updateMoney"></Son>
  </div>
</template>

<script>
import Son from './Son.vue'
import { ref } from 'vue'
export default {
  name: 'App',
  components: {
    Son
  },
  setup() {
    const money = ref(100)
    const updateMoney = (newMoney) => {
      money.value = newMoney
      console.log(newMoney)
    }
    return { money, updateMoney }
  }
}
</script>

```

子组件接受父组件传递的值时，可以在`setup`函数中加上`porps`参数。用来接受来自`props`属性接收父组件传来的值。

子组件要触发父组件的事件时，需要使用到`$emit`事件。需要给`setup`加上`context`参数，或者从`context`参数中结构出需要用到的方法。

子组件代码：

```JavaScript
<template>
  <div class="son">
    <h1>子组件</h1>
    <p>{{money}}</p>
    <button @click="changeMoney">向父借钱</button>
  </div>
</template>

<script>
export default {
  name: 'Son',
  props: {
    money: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    console.log(props.money)
    const changeMoney = () => {
      emit('changeMoney', 50)
    }
    return { changeMoney }
  }
}
</script>

```

### v-model 原理

#### vue2 中 v-model 传值

在 vue2.x 的时候，除了使用 v-model 实现双向数据绑定外；.sync 也可以实现双向数据绑定。

```JavaScript
//父组件
<Son :money="money" @input="fn"/>
```

但是当有多个数据需要父子组件之间双向绑定时，v-model 只能传其中一个值。这时候需要使用.sync 来实现其他数据的绑定。

```JavaScript
<Son :money.sync='money' />
```

从 2.3.0 起，vue 重新引入了 .sync 修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 监听器。

```JavaScript
//注意这里扩展的@update是固定写法。
<Son :money="bar" @update:money="val => bar = val"></Son>

```

当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：

```JavaScript
this.$emit('update:foo', newValue)
```

实例：

```JavaScript
<template>
  <div class="details">
    <myComponent
        :show.sync='valueChild'
        style="padding: 30px 20px 30px 5px;border:1px solid #ddd;margin-bottom: 10px;"
    >
    </myComponent>
    <button @click="changeValue">toggle</button>
  </div>
</template>
<script>
import Vue from 'vue'

Vue.component(
    'myComponent', {
      template: `
        <div v-if="show">
        <p>默认初始值是{{ show }}，所以是显示的</p>
        <button @click.stop="closeDiv">关闭</button>
        </div>`,
      props: ['show'],
      methods: {
        closeDiv() {
          this.$emit('update:show', false); //触发 input 事件，并传入新值
        }
      }
    })
export default {
  data() {
    return {
      valueChild: true,
    }
  },
  methods: {
    changeValue() {
      this.valueChild = !this.valueChild
    }
  }
}
</script>

```

#### vue2 中使用 v-model + .sync

由于 v-model 只能默认传进去一个值，剩下的需要使用.sync 实现双向绑定。

对于 v-model 传进来的数，子组件用 emit 方法向父组件的“input”传值（注：是 v-model 默认监听的方法）。

而对于.sync 传进来的数，则是通过在子组件中，使用 emit 向父组件的 update:绑定数据名，进行传值(注：默认提供了 update 方法，当然也可以自己在父组件中自定义一个修改绑定值的函数)。

父组件：

```JavaScript
<h1>name01:{{ name01 }} </h1>
<h1>age01:{{ age01 }} </h1>
<model01
         :model="age01"
         :name.sync="name01"
         >
</model01>
...

<script>
export default{
    data(){
        return{
            age01: 18,
            name01: "username"
        }
    }
}

</script>

```

子组件：

```JavaScript
<template>
  <div class="custom-input">
    <h1>vue2中的v-model</h1>
    <input
        type="text"
        :value="age"
        @input="$emit('input', $event.target.value)"
    />
    <!--上面的emit中的“input”是v-model默认监听的函数-->
    <br>
    <input type="text" :value="name" @input="$emit('update:name', $event.target.value)"/>
     <!--name使用的是.sync实现绑定的-->
  </div>
</template>

<script>
export default {
  name: "Model01",
  props: [
    'age',
    'name'
  ],
  model:{

  }
  methods: {
  }
}
</script>
```

#### vue3 中 v-model 传值

vue3 中，将之前的 v-model 和.sync 整合到一起了，并淘汰了.sync 写法。现在，v-model 在组件之间的使用再也不用像以前那样臃肿了，极其舒爽。

只需要在 v-model 上指定传值。例如下面的`v-model:money`：

```JavaScript
<Son :money="money" @update:money="fn"/>
```

```JavaScript
<Son v-model:money='money' />
```

```JavaScript
<model02 v-model:age="age02" v-model:name="name02"></model02>
```

这里就是将父组件中的 age02 变量传入到子模块的 props 中的 age 变量中。

子组件只要使用如下调用 update:age 的方式，就能将 age 的变化由子组件的 age 传入到父组件的 age02 变量上。

```JavaScript
$emit('update:age', 传给父组件的值);
```

父组件

```JavaScript
....
<h1>name02:{{ name02 }} </h1>
<h1>age02:{{ age02 }} </h1>
<!--     vue3写法-->
<model02
  v-model:age="age02"
  v-model:name="name02"
 ></model02>
....

```

子组件

```JavaScript
<template>
  <div class="custom-input">
    <h1>vue3中的v-model</h1>
    <input type="text" :value="age" @input="onAgeInput"/>
    <br>
    <input type="text" :value="name" @input="onNameInput"/>
  </div>
</template>

<script>
export default {
  name: "Model02",
  props: [
    'age',
    'name'
  ],
  methods: {
    onAgeInput(e) {
      this.$emit('update:age', parseFloat(e.target.value));
    },
    onNameInput(e) {
      this.$emit('update:name', e.target.value)
    }
  }
}
</script>

```

实现效果图：

![](https://img-blog.csdnimg.cn/20200925200740775.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxOTk2NDU0,size_16,color_FFFFFF,t_70#pic_center)
