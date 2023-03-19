---
title: Svg组件的封装
date: 2022-10-11
categories:
 - Vue
tags:
 - Vue
---

## vue 中 svg 图片的封装

#### 1. 首先需要安装`svg-sprite-loader`

```Bash
npm install svg-sprite-loader -D
```

#### 2. 配置 vue.config.js

其中 src/icons 就是本地 svg 图片存放的路径。注意由于 vue-cli 默认有处理 svg 的插件，所以先把 `src/icons` 的排除。

```JavaScript
module.exports = {
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}

```

无论是 `webpack.config.js`还是 `vue.config.js`配置，在 `options.symbolId` 都有一段 `icon-[name]` 的配置。这段也是我们组件识别到底使用哪个 svg 的关键，所以这里的 `icon-` 需要和组件返回的 `#icon-${name}` 格式一致。

如果不想叫 `icon-xxx` 那么改动的话记得组件和 webpack 配置都得同步修改即可。

当我们使用`import`在组件中导入 svg 图片后，在 html 的 body 中可以发现一个 svg 标签，里面保存着我们注册过的所有 svg，并用 symbol 标签包裹，每个`symbol`标签都有一个独立的 id。这些 id 就是我们引入的 svg

![](https://secure2.wostatic.cn/static/nnC7p3piKi1SpkkjeuWrpa/image.png?auth_key=1679216934-gugdhWVgRRoyGg8uix7G8y-0-7288f02442f65b323a5d5dfa62c622bd)

> 这个 loader 先把 svg 变成 symbol 在再外面套一个 svg，然后把这个 svg 放到 body 里面。

然后我们就可以在 svg 中使用 use 标签引入上面导入的 svg 了。

```HTML
<svg>
    <use :xlink:href="#icon-bi-public-back" />
</svg>
```

但是这样做是非常麻烦的，每个图片都需要`import`，因此我们可以封装为一个组件。

#### 3. 创建 svg 组件

封装一个 svg 组件，来实现标签记载 svg 图。

```Vue
<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>

```

#### 4. **在 src 下新建 icons 文件夹，及 icons 文件夹下 svg 文件夹、index.js 文件**

在 index.js 中全局导入 svg 图片个组件

```Vue
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

```

#### 5. 在 main.js 中导入 index.js

```JavaScript
import 'src/icons/index'
```

#### 6. 使用 SvgIcon 组件

```Vue
<svg-icon icon-class="user" :class="{ active: loginForm.username }"/>
```

## 动态创建 svg 标签

使用 js 动态绘制 svg 图片，需要创建一个具有指定的命名空间 URI 和限定名称的元素。使用

`document.createElementNS()` 来创建。

```JavaScript
let element = document.createElementNS(namespaceURI, qualifiedName[, options]);

```

namespaceURI —— 指定与元素相关联的[命名空间 URI](https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/glossary.html#dt-namespaceURI)的字符串。创建的元素的[namespaceURI (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/Element/namespaceURI)属性使用 namespaceURI 的值进行初始化。参见[有效的命名空间 URL](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElementNS#Valid_Namespace_URI's)。

### 有效的命名空间 URI

- HTML - 参阅 `http://www.w3.org/1999/xhtml`
- SVG - 参阅 `http://www.w3.org/2000/svg`
- XBL - 参阅 `http://www.mozilla.org/xbl`
- XUL - 参阅 `http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul`

使用`use`标签引入全局导入的`svg`时（经过`svg-sprint-loader`解析）。一定要注意命名空间的处理。

```TypeScript
  const SVG_NS = "http://www.w3.org/2000/svg";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const backIcon = document.createElementNS(SVG_NS, "svg");
  backIcon.setAttribute("class", "bi-svg svg-icon");
  backIcon.setAttribute("style", "width: 25px;height: 25px;");

  const use = document.createElementNS(SVG_NS, "use");
  // 要有命名空间才能引入svg文件
  use.setAttributeNS(xlinkns, "href", "#icon-bi-public-back");
  backIcon.appendChild(use);
  backDom.appendChild(backIcon);
```
