---
title: openlayers下矢量数据坐标系问题
date: 2022-07-20
categories:
 - openlayers
tags:
 - openlayers
---


# 解决 Openlayers 矢量数据坐标系和地图服务坐标系不同的情况

## 背景

使用 openlayers 加载使用[DataV.GeoAtlas](https://datav.aliyun.com/portal/school/atlas/area_generator#15.87/104.059907/30.641388)生成的 geojson 文件时，在 EPSG:3857 投影方式的地图上出现了位置偏差的问题。

图中绿色框， 应该遮住四川华西医院。但是可以看到，偏离了本来的位置。

![DataV.GeoAtals](https://secure2.wostatic.cn/static/tN1aG4Ne9BVYd6ks66jPaw/image.png?auth_key=1679218675-tvkqzDMcLXdc3YkgHGk3uA-0-b14cf99bd38297c4dfeab4b9103b66a3)

![在使用EPSG:3857投影的地图上出现偏差](https://secure2.wostatic.cn/static/vfPNsyrWwN4bTWHnXqePub/image.png?auth_key=1679218675-qiGPUeD3Xo6s9ytDccE3jm-0-3a213689ceaca21668047ffc8d42d0ba)

## 问题出现的原因：

使用 DataV.GeoAtalss 生成的 geojson 文件的坐标系仍然是 GCJ02。所以在 EPSG:3857 投影的坐标系上会出现位置的偏差。

## 解决办法：

两种解决方式：1. 使用[gcoord](https://github.com/hujiulong/gcoord#api)库文件，将 GCJ02 坐标系的 geojson 文件转换为 wsg84 坐标系的 geojson 文件。

1. 使用[proj4js ](https://github.com/proj4js/proj4js)库文件，使用 proj4.defs 方法定义拓展的 EPSG 坐标系。这样可以更优雅，但是需要研究一下。

我目前使用第一种方式，直接转换 geojson 文件的坐标。也非常的方便。

```Vue
    getGeoJson() {
      axios.get("/show/sichuanUniversity.geojson").then((res) => {
        const geojson = res.data;
        gcoord.transform(geojson, gcoord.GCJ02, gcoord.WGS84);
        this.addGeoJSON(geojson);
      });
    },
```
