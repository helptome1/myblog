---
title: Http的强缓存和弱缓存
date: 2022-01-15
categories:
 - NetWork
tags:
 - NetWork
---


# Http的强缓存和弱缓存
### 浏览器缓存机制
我们都知道当我们在浏览器中打开一个页面时，浏览器会根据你输入的URL到对应的服务器上请求你想要的数据资源。但这个过程中可能页面可能需要等待一段时间（白屏时间）才能渲染到你的页面中。

当你想要提高用户体验时，那就不得不提各种缓存技术了，例如：DNS缓存、CDN缓存。浏览器缓存、页面本地缓存等等，有一个良好的缓存策略可以减低重复资源的请求，降低服务器的开销，提高用户页面的加载速度。

其中HTTP是广泛使用的缓存形式之一。

### Http的缓存原理
浏览器在加载服务器资源的时候，会根据`response headers`中的`expires`和`cache-control`判断是否命中强缓存策略，判断是否向远程服务器请求资源还是去本地获取缓存资源。

### 强缓存
在浏览器中，强缓存分为`Expires`（http1.0规范）、`cache-control`（http1.1规范）两种。

#### Expires
`Expires`（是http1.0的规范，用于表示资源的过期时间的请求头字段，值是一个绝对时间，是由服务器端返回的。

该值是一个GMT时间格式个字符串，在浏览器第一个请求资源时，服务器端的响应头会附上`Expires`（这个响应字段，当浏览器在下一次请求这个资源时会根据上次的`Expires`（字段是否使用缓存资源（当请求时间小于服务端返回的到期时间，直接使用缓存数据）

<img :src="$withBase('/network/http_cache/16764418026301.jpg')" alt="foo">

> expires是根据本地时间来判断的，假设客户端和服务器时间不同，会导致缓存命中误差
在node中这样添加`Exprise`字段
```js
app.get('/', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html');
    fs.readFile(cssContent, function(err, data) {
          res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
        res.end(data);
    })
});
```

#### Cache-Control
上面我们提到了`Expires`有个缺点，当客户端本地时间和服务器时间不一致时会产生误差，浏览器会直接向服务器请求新的资源，为了解决这个问题，在http1.1规范中，提出了`cache-control`字段，且这个字段优先级高于上面提到的`Expires`，值是相对时间。

在cache-control中有常见的几个响应属性值，它们分别是

属性值	    | 值             | 备注
--------- | ------------- | -----------------
max-age   |3600           | 例如值为3600，表示（当前时间+3600秒）内不与服务器请求新的数据资源
s-maxage	 |               | 和max-age一样，但这个是设定代理服务器的缓存时间
private | | 内容只缓存到私有缓存中(仅客户端可以缓存，代理服务器不可缓存)，只能允许最终用户做缓存，最终用户即电脑、手机等等
public | | 所有内容都将被缓存(客户端和代理服务器都可缓存)
no-store | | 不缓存任何数据
no-cache| | 储存在本地缓存区中，只是在与原始服务器进行新鲜度再验证之前，缓存不能将其提供给客户端使用

在node中这样设置：
```js
app.get('/', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html');
    fs.readFile(cssContent, function(err, data) {
        res.setHeader("Cache-Control", "max-age=0");
        res.end(data);
    })
});
```

<img :src="$withBase('/network/http_cache/16764451013514.jpg')" alt="foo">

从上图中可以看到，此时浏览器已经接收到 `cache-control` 的值，那么这个时候浏览器再次发送请求时，它会先检查它的` cache-control `是否过期，如果没有过期则直接从本地缓存中拉取资源，返回到客户端，而无需再经过服务器。

如果缓存时间过期了，那么就会去服务器请求资源，服务器再一次返回资源和`cache-control`


### 协商缓存
上面提到的强缓存都是由<u>**本地浏览器在确定是否使用缓存**</u>，当浏览器没有命中强缓存时就会向服务器发送请求，验证协商缓存是否命中，如果缓存命中则返回304状态码，否则返回新的资源数据。

- 协商缓存，也叫对比缓存。
- 它是一种<u>**服务端的缓存策略**</u>，即通过服务端来判断某件事情是不是可以被缓存。
- 服务端判断客户端的资源，是否和服务端资源一样，如果一致则返回 304 ，反之返回 200 和最新的资源。

<img :src="$withBase('/network/http_cache/16764489964420.jpg')" alt="foo">

在上图中，表明了协商缓存的全过程。首先，如果客户端是第一次向服务器发出请求，则服务器返回资源和相对应的资源标识给浏览器。该资源标识就是对当前所返回资源的一种唯一标识，可以是`Etag`或者是`Last-Modified`，这两个字段将在图例结束后展开讲解。

之后如果浏览器再次发送请求时，浏览器就会带上这个资源标识。此时，服务端就会通过这个资源标识，可以判断出浏览器的资源跟服务端此时的资源是否一致，如果一致，则返回304，即表示Not Found 资源未修改。如果判断结果为不一致，则返回200，并返回资源以及新的资源标识。至此就结束了协商缓存的过程。

- Last-modified表示本地文件最后修改时间，由服务器返回
- if-modified-since是浏览器在请求数据时返回的，值是上次浏览器返回的Last-modified
- ETag是一个**文件的唯一标识符**，当资源发生变化时这个ETag就会发生变化。弥补了上面last-modified可能出现文件内容没有变化但是last-modified发生了变化出现重新向服务器请求资源情况。这个值也是又服务器返回的
- if-none-match是浏览器请求数据时带上的字段，值是上次服务器返回的ETag


#### Last-Modified

<img :src="$withBase('/network/http_cache/16764512838873.jpg')" alt="foo">

假设此时我们的协商缓存用 `Last-Modified` 来判断。当浏览器第一次发送请求时，服务器返回资源并返回一个 `Last-Modified` 的值给浏览器。这个`Last-Modified` 的值给到浏览器之后，浏览器会通过` If-Modified-Since` 的字段来保存 `Last-Modified` 的值，且 `If-Modified-Since `保存在请求头当中。

之后当浏览器再次发送请求时，请求头会带着 `If-Modified-Since` 的值去找服务器，服务器此刻就会匹配浏览器发过来的` If-Modified-Since `是否和自己最后一次修改的 `Last-Modified `的值相等。如果相等，则返回 304 ，表示资源未被修改；如果不相等，则返回200，并返回资源和新的 `Last-Modified` 的值。


#### Etag
<img :src="$withBase('/network/http_cache/16764514103271.jpg')" alt="foo">

假设此时我们的协商缓存用 `Etag` 来判断。当浏览器第一次发送请求时，服务器返回资源并返回一个 Etag  的值给浏览器。这个 `Etag` 的值给到浏览器之后，浏览器会通过 `If-None-Match` 的字段来保存 `Etag` 的值，且 `If-None-Match `保存在请求头当中。

之后当浏览器再次发送请求时，请求头会带着` If-None-Match `的值去找服务器，服务器此刻就会匹配浏览器发过来的` If-None-Match `是否和自己最后一次修改的 Etag 的值相等。如果相等，则返回 304 ，表示资源未被修改；如果不相等，则返回 200 ，并返回资源和新的 `Etag` 的值。

### 资源标识
在响应头部 Response Headers 中，有两种资源标识：
- `Last-Modified `资源的最后修改时间，对应请求头为` If-Modified-Since` ；
- `Etag` 资源的唯一标识，所谓唯一，可以想象成时人类的指纹，具有唯一性；但 Etag 的本质是一个字符串；对应请求头为 `If-None-Match `。

#### Last-Modiufied和Etag
- 当响应头部 `Response Headers` 同时存在 `Last-Modified `和 `Etag` 的值时，会优先使用 `Etag` ；
- `Last-Modified` 只能精确到秒级；
- 如果资源被重复生成，而内容不变，则 Etag 更精确
<img :src="$withBase('/network/http_cache/16764517034580.jpg')" alt="foo">
由上图可以看到，响应头中的 `Last-Modified` 对应请求头中的` If-Modified-Since` ， `Etag` 对应请求头中的 `If-None-Match `。

<img :src="$withBase('/network/http_cache/lct.png')" alt="foo">

### 刷新方式对缓存的影响

1. 正常操作
定义： 地址栏输入 url ，跳转链接，前进后退等。
对缓存的影响： 强制缓存有效，协商缓存有效。
2. 手动刷新
定义：  F5 ，点击刷新按钮，右击菜单刷新。
对缓存的影响： 强制缓存失效，协商缓存有效。
3. 强制刷新
定义： ctrl + F5 。
对缓存的影响： 强制缓存失效，协商缓存失效。







