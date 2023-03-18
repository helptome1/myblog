---
title: JavaScript中的Map和Set
date: 2022-4-15
categories:
 - openlayers
tags:
 - openlayers
---

# openlayers使用html2canvas生成图片空白问题

### 背景
在使用openlayers v6.14.0，使用html2canvas生成图片，导出的图片显示空白页。

控制台html2canvas报错：#1 6268ms Unable to clone canvas as it is tainted ，canvas被污染。

直接输出canvas图片，发现图片内容被污染。



解决办法：在添加地图，配置source时添加配置：

```JavaScript
crossOrigin: 'anonymous'
```
