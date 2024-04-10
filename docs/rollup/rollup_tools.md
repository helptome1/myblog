---
title: Rollup打包工具
date: 2024-04-10
categories:
 - Rollup
tags:
 - Rollup
---

::: tip 
Rollup打包工具
:::

# Rollup
> Webpack和Rollup都是打包工具，Webpack那么强大为什么还要用Rollup?

## Rollup是什么
`Rollup` 是一种 `JavaScript` 模块打包工具，它可以将 `JavaScript` 模块打包成一个或多个独立的文件，**用于在浏览器或其他环境中运行**。它根据模块之间的依赖关系，将这些模块合并成一个或多个 `bundle` 文件。

听起来和`Webpack`很像，那与其他常见的打包工具（如`Webpack` 和`Parcel`）相比，Rollup 有什么特点呢：

- **Tree Shaking:** `Rollup` 通过静态分析代码，可以检测到哪些模块没有被使用到，并且会将这些没有使用到的模块删除，以减小最终的 bundle 文件的体积。这个过程被称为 Tree Shaking，有助于减少不必要的代码和提升应用的性能。

- **ES 模块（ESM）支持:**` Rollup` 原生支持 ES 模块的语法，可以直接处理 ES 块的导入和导出。这使得开发者可以使用最新的`JavaScript` 言特性，以更代化的方式组织和管理模块。

- **插件系统:** `Rollup` 提供了丰富的插件系统，允许开发者通过插件来扩展和定制构建过程。可以使用插件来进行代码转换、模块解析、资源处理等操作，以满足不同项目的需。

- **简单和轻量:** 相比于其他打包工具，`Rollup` 具有简单、轻量特点。它的配置简洁，配置选项较少，使用起来加直观和容易上手。

`Rollup` 是一个现代的 JavaScript 模块打包器，它以简约、高效和可扩展性而闻名。与其他打包器相比，Rollup 专注于 ES 模块，并且提供了强大的 Tree Shaking 来减少不必要的代码，最大限度的优化和提升应用的性能。


## Rollup的一些核心概念

1. **入口文件（Entry File）：** 入口文件是你的应用程序或库的主文件，更是 Rollup 开始构建的起点。入口文件指定了**依赖关系图**的根节点。

2. **依赖关系图（Dependency Graph）：** 依赖关系图是 Rollup 根据入口文件和所有相关依赖自动构建的一张图表。它了各个模块之间的依赖关系，包括每个模块依赖的其他模块和导出的内容。

3. **模块（Module）：** 模块是代码的单独单元，可以是一个文件或一个文件中的一个部分。每个模块都有自己的作域，并且可以导入和导出变量、函数和类等。

4. **导入（Import）和导出（Export）：** 通过导入和导出语法，模块可以与其他模块进行交互。导入语法允许模块使用其他模块中导出的内容，而导出语法允许模块将自己的内容暴露给其他模块使用。 

5. **Bundle：** `Bundle` 是 构建输出的最终文件。它包含所有被捆绑在一起的模块和它们的依赖关系。Bundle 可以是单个`JavaScript` 文件，也可以是多个文件组成的目录。

6. **模块格式（Module Format）：** 模块格式定义了将模块打包到`Bundle` 中的方式。常见的模块格式包括 `ES 模块（ESM）`，`CommonJS模块（CJS）`，`AMD 模块`以及全局变量`IIFE`等。

7. **插件（Plugins）：** 插件是`Rollup` 的扩展，用于在构建过程中自定义和增强功能。它们可以在各个阶段进行代码转换、优化、添加附加功能和处理其他任务。通过使用插件，你可以根据自己的特定需求来扩展和定制`Rollup` 的行为。

8. **Tree Shaking：** Tree Shaking 是`Rollup` 的一个重要特性，它能够通过静态分析准确识别未使用的代码，并将其从 Bundle 中删除。这样可以减小`Bundle` 的大小，优化应用的性能。

## 开始Rollup之旅

#### 安装参考：[Rollup官网](https://www.rollupjs.com)

#### 打包不同的模块格式
假设我们需要打包的入门文件名为`mian.js`, 并且希望将所有导入编译到一个名为`bundle.js`的单个文件中。那么我们只需要在cmd中执行一下命令：

1. iife格式：用于浏览器
```bash
# 编译为包含自执行函数（'iife'）的 <script>。
rollup main.js --file bundle.js --format iife
```

2. CommonJs格式, 用于Node.js
```bash
# 编译为一个 CommonJS 模块 ('cjs')
rollup main.js --file bundle.js --format cjs
```

3. UMD格式, 用于浏览器和 Node.js：
```bash
# UMD 格式需要一个包名
rollup main.js --file bundle.js --format umd --name "myBundle"
```
#### 配置文件







