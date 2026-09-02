# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人前端技术博客（"一筐杂学"），基于 **VuePress 1.x** + **vuepress-theme-reco**。内容全部是技术笔记类 Markdown，源码里没有业务代码，主要工作就是"写文章"和偶尔改博客主题配置。构建产物部署到 GitHub Pages（`helptome1/blog` 仓库）。

## 常用命令

依赖用 yarn 管理（`yarn.lock` 存在），需 Node 18/20 或更低版本配合 `--openssl-legacy-provider` 兼容旧版 webpack。

```bash
yarn                    # 安装依赖（无需改动时跳过）
yarn dev                # 本地开发，热更新，地址 http://localhost:8080/blog/
yarn build              # 构建静态站点到 docs/.vuepress/dist
yarn deploy             # 执行 bash deploy.sh：build 后 force push 到 blog 仓库
```

无 lint / 无测试脚本。

## 内容组织与写文章约定

- 所有内容都在 `docs/` 下。每个技术主题是一个子目录（`javascript/`、`vue/`、`typescript/`、`network/` 等），目录名即为分类。
- 每篇文章是一个独立 `.md` 文件。**frontmatter 必须有** `title`、`date`、`categories`、`tags`，否则 reco 主题不会把它收录进首页、分类页、标签页和时间线：

```yaml
---
title: 文章标题
date: 2026-09-02
categories:
  - JavaScript
tags:
  - JavaScript
---
```

- 新增文章时：放进对应的分类目录（目录与 `categories` 值一致），文件名无强制要求（历史多用英文下划线，也存在中文文件名，如 `javascript/宏任务于微任务.md`）。
- 正文内图片、gif 等静态资源放 `docs/.vuepress/public/`（可按主题建子目录，如 `network/http_cache/`），文章里以 `/xxx/文件名` 根路径引用。
- 想要日期在首页按新到旧排，`date` 写当天即可。
- `docs/README.md` 是博客首页（vuepress home layout），`README.md`（仓库根）仅作 GitHub 展示，非内容页。

## 架构要点

- `docs/.vuepress/config.js`：站点与主题的唯一配置源——站点标题、`base: '/blog/'`、导航栏 `nav`、reco 的 blogConfig（分类/标签菜单）、valine 评论、作者信息。
- 主题：`vuepress-theme-reco`，已开启 `subSidebar: 'auto'`（根据文章标题自动生成子侧边栏），**不需要手动维护侧边栏**。
- `deploy.sh`：构建后进入 `dist` 新建 git、force push 到 `git@github.com:helptome1/blog` 的 master 分支（若改动部署目标，改这里）。
- `docs/.vuepress/dist/` 是构建产物，已 gitignore（但本地存在）。
- `reco` 的导航：首页/时间线是主题内置路由（`/timeline/`），"关于我"等指向外链；新增一级导航改 config.js 的 `nav`。
