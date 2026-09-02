# 一筐杂学 · Blog

> 个人前端技术博客仓库。VuePress 1.x + vuepress-theme-reco 构建，40 篇技术笔记按 10 个分类归档。

[在线博客 →](https://helptome1.github.io/blog/)

## 📦 技术栈

VuePress 1.x · vuepress-theme-reco · yarn · Node 18/20 + `--openssl-legacy-provider`

## 📁 内容结构

- `docs/` 下每个子目录是一个技术分类（`javascript/`、`vue/`、`typescript/`、`network/`、`node/` 等），目录名即分类
- 单篇文章 = 独立 `.md` 文件，frontmatter 含 `title / date / categories / tags`
- 图片等静态资源放 `docs/.vuepress/public/`，文章以 `/文件名` 根路径引用
- 站点配置唯一入口：`docs/.vuepress/config.js`

## 🚀 本地运行

```bash
yarn          # 安装依赖（Node 18/20 或更低版本）
yarn dev      # 本地热更新 → http://localhost:8080/blog/
yarn build    # 构建静态站到 docs/.vuepress/dist
yarn deploy   # 构建 + force push 到 GitHub Pages
```

## ✍️ 写作约定

- 文章放入对应分类目录；frontmatter 必须含 `title / date / categories / tags`，否则不被 reco 主题收录进首页、分类页、时间线
- 想让日期在首页按新到旧排，`date` 写当天即可
- 首页与侧边栏由主题按 frontmatter 自动生成，无需手动维护

## 📝 License

MIT
