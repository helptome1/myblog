---
title: npmrc 配置
date: 2025-12-16
categories:
  - npm
tags:
  - npmrc
---

# npmrc 配置

### 什么是 npmrc

`npmrc` 是 npm 的配置文件，它可以用来配置 npm 的行为。npmrc 文件的默认位置是在用户目录下的 `.npmrc` 文件。

### 常用配置项

- `registry`: 配置 npm 包的 registry 地址，默认是 `https://registry.npmjs.org/`。
- `shamefully-hoist=true`: 配置是否开启扁平化安装依赖，默认是 `false`。
- `audit=false`: 配置是否开启安全审计，默认是 `true`。
- `progress=false`: 配置是否开启安装进度显示，默认是 `true`。

### 配置示例

```bash
# 配置 npm 包的 registry 地址为淘宝镜像
registry=https://registry.npm.taobao.org/

# 开启扁平化安装依赖
shamefully-hoist=true
# 开启扁平化安装依赖可以解决依赖冲突的问题，但是也会导致一些问题，比如依赖的版本不一致。
# 用--模拟项目结构举个例子
# 假设我们有一个项目，它的依赖结构如下：
# project/
# ├── package.json
# ├── node_modules/
# │   ├── package.json
# │   ├── dep1/
# │   │   ├── package.json
# │   │   ├── dep2/
# │   │   │   ├── package.json
# │   │   │   ├── dep3/
# │   │   │   │   ├── package.json
# │   │   │   │   └── index.js
# │   │   │   └── index.js
# │   │   └── index.js
# │   └── dep4/
# │       ├── package.json
# │       └── index.js
# └── index.js
# 假设我们的项目依赖了 dep1 和 dep4，dep1 依赖了 dep2，dep2 依赖了 dep3。
# 当我们使用 npm install 安装依赖时，会按照依赖的顺序进行安装。
# 安装完成后，项目的依赖结构如下：
# project/
# ├── package.json
# ├── node_modules/
# │   ├── package.json
# │   ├── dep1/
# │   │   ├── package.json
# │   │   ├── dep2/
# │   │   │   ├── package.json
# │   │   │   ├── dep3/
# │   │   │   │   ├── package.json
# │   │   │   │   └── index.js
# │   │   │   └── index.js
# │   │   └── index.js
# │   ├── dep4/
# │   │   ├── package.json
# │   │   └── index.js
# │   └── index.js
# └── index.js
# 可以看到，dep3 被安装到了项目的 node_modules 目录下，而不是 dep2 的 node_modules 目录下。
# 这就是扁平化安装依赖的效果。

# 关闭安全审计
audit=false

# 关闭安装进度显示
progress=false




## 总结
