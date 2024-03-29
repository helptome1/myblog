---
title: 浏览器输入地址之后发生了什么
date: 2021-09-25
categories:
  - NetWork
tags:
  - NetWork
---

# 浏览器输入地址之后发生了什么
### WWW万维网
www，其实是World Wide Web的缩写，中文翻译为万维网。互联网并不等同万维网（WWW），万维网只是一个基于超文本相互链接而成的全球性系统，且是互联网所能提供的服务其中之一。

互联网带有范围广泛的信息资源和服务，除此以外还有文件传输（FTP）、电子邮件（E-mail）、远程登录（Telnet）等。

而为了区分互联网中的各种应用，就有了不同的子域名，比如互联网就以www作为子域名，文件传输以ftp作为子域名，电子邮件以mail作为子域名。

购买域名时需要配置域名解析，解析时需要填入主机记录部分：
<img :src="$withBase('/network/http_insert/16757487052395.jpg')" alt="foo">

当我们设置www作为域名前缀的时候，那么访问www.aliyun.com即可访问网站。当我们设置@作为域名前缀的时候，直接访问aliyun.com就可以访问网站了。

**也正是因为万维网是互联网中最重要的一部分，很多域名的最主要用途也是搭建web网站，所以，会有很多公司直接忽略www。
**

这也解释了，为什么像github.com不需要www前缀就可以访问的原因。


### DNS
#### DNS是什么
DNS（Domain Name Server）,用来将域名转换为IP地址。一个域名对应一个ip，但是一个ip可以对应多个域名。

DNS中保存了一张域名与ip地址的表。

gTLD： generic Top-Level DNS Server顶级域名服务器。为所有.com .net .edu后缀做域名服务器解析。

#### DNS服务器
① **根域名服务器**：在有些场合，www.xxx.com 被写成 www.xxx.com. 即最后还会多出一个点。这个点就是根域名。
理论来说：所有域名的查询都必须先查询根域名。ICANN 维护着一张列表（根域名列表），里面记载着顶级域名和对应的托管商。

② **顶级域名服务器**：用来管理注册在该顶级域名下的所有二级域名的，记录这些二级域名的 IP 地址。

③ **权限域名服务器**：那么权限域名服务器就是负责管理一个“区”的域名服务器。而不是三级或者四级域名。

<img :src="$withBase('/network/http_insert/16757595088467.jpg')" alt="foo">

区和域是不同的，区可以有多种不同的划分方法。这个需要根据公司来具体划分。

④**本地域名服务器**：是电脑解析时的默认域名服务器，即电脑中设置的首选 DNS 服务器和备选 DNS 服务器。

当我们输入域名时，这个查询请求报文就发送给该主机的本地域名服务器。本地域名服务器管理本地域名的解析和映射，并且能够向上级域名服务器进行查询。

#### DNS缓存
由于每个时刻都有无数网民要上网，那每次都去访问本地域名服务器去获取 IP 地址显然是不实际的。解决方法就是使用缓存保存域名和 IP 地址的映射。

计算机中 DNS 记录在本地有两种缓存方式：浏览器缓存和操作系统缓存。

1. 浏览器缓存：浏览器在获取网站域名的实际 IP 地址后会对其进行缓存，减少网络请求的损耗。每种浏览器都有一个固定的 DNS 缓存时间，如 Chrome 的过期时间是 1 分钟，在这个期限内不会重新请求 DNS
2. 操作系统缓存：操作系统的缓存其实是用户自己配置的 hosts 文件。比如 Windows10 下的 hosts 文件存放在 C:\Windows\System32\drivers\etc\hosts
#### DNS查询方式：
1. **递归查询：** 如果请求的接收者不知道所请求的内容，那么**接收者将扮演请求者**，发出有关请求，直到获得所需要的内容，然后将内容返回给最初的请求者。
<img :src="$withBase('/network/http_insert/16757598158776.jpg')" alt="foo">
    
2. **迭代查询：** 迭代是指，遍历域名服务器，由本地服务器分别请求各域名服务器进行ip地址的查询。
<img :src="$withBase('/network/http_insert/16757599521952.jpg')" alt="foo">


#### DNS服务器解析流程
当在浏览器输入域名后：
1. 浏览器缓存
2. 本地hosts文件（本地DNS缓存）
3. 本地DNS服务器缓存
4. 本地DNS服务器
5. DNS服务器递归查找

##### 1. 浏览器缓存
首先搜索浏览器的 DNS 缓存，缓存中维护一张域名与 IP 地址的对应表；

##### 2. 本地hosts文件
若没有命中，则继续搜索操作系统重的DNS缓存。即：host文件，修改hosts文件对于开发者来说并不陌生，这样我们可以不改变线上域名的配置，然后直接通过域名访问我们想要访问的机器。

##### 3. 本地DNS服务器缓存
若仍然没有命中。本地操作系统将域名发送到本地域名服务器，本地域名服务器查询自己的DNS缓存，查找到就返回结果。（注意：主机和本地域名服务器之间的查询方式是递归查询）

如果之前已经解析过，本地的DNS缓存里就有对应的ip地址。如果是一次访问，那本地DNS服务器并没有这个域名的ip地址。

##### 3. 本地DNS服务器迭代查询域名服务器：
若本地域名服务器也没有命中，那么就有本地域名服务器向上级域名服务器进行查询。本地域名服务器和其他域名服务器之间的查询方式是迭代查询，防止根域名服务器压力过大；
<img :src="$withBase('/network/http_insert/16757603912815.jpg')" alt="foo">
1. 首先本地域名服务器向根域名服务器发起请求，根域名服务器是最高层次的，它并不会直接指明这个域名对应的 IP 地址，而是返回顶级域名服务器的地址，也就是说给本地域名服务器指明一条道路，让他去这里寻找答案。
2. 本地域名服务器拿到这个顶级域名服务器的地址后，就向其发起请求，获取权限域名服务器的地址。
3. 本地域名服务器根据权限域名服务器的地址向其发起请求，最终得到该域名对应的 IP 地址。
4. 本地域名服务器将得到的 IP 地址返回给操作系统，同时自己将 IP 地址缓存起来
5. 至此，浏览器就得到了域名对应的 IP 地址，并将 IP 地址缓存起来






