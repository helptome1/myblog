module.exports = {
  title: "一筐杂学",
  description: "我的前端成长日记",
  theme: 'reco',
  themeConfig: {
    // type设置网站类型
    type: 'blog',
    //在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    subSidebar: 'auto',
    // 博客配置
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: '标签'      // 默认文案 “标签”
      },
      // socialLinks: [     // 信息栏展示社交信息
      //   { icon: 'reco-github', link: 'https://github.com/helptome1' },
      // ]
    },
    // 顶部导航栏配置
    nav: [
      {
        "text": "首页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间线",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "关于我",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/helptome1/helptome1.github.io",
            "icon": "reco-github"
          },
          {
            "text": "weChat",
            "link": "",
            "icon": "reco-wechat"
          }
        ]
      }
    ],
    // 评论插件
    valineConfig: {
      appId: '8DW7GjD96TDJ5lPb8IH7zkb9-gzGzoHsz',// your appId
      appKey: '9rHN0O43CAXPaOayFXAwi8Uz', // your appKey
    },
    logo: "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "hezg",             //版权信息
    authorAvatar: "/avatar.png",//头像信息
    record: "hezg's blog",             //备案信息
    startYear: "2021"           //开始年份
  }
}