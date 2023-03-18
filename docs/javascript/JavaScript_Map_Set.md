---
title: JavaScript中的Map和Set
date: 2021-11-9
categories:
 - JavaScript
tags:
 - JavaScript
---


::: tip 
介绍Js中数据结构的Map和Set方法
:::

# JS对象Map()和Set()

在ES6新的标准中，加入了Map()和Set()方法。

## Map对象

Map对象用来保存**键值对** ，并且能够可以记住键的原始插入顺序。**任何值** （包括对象）都可以作为一个键或者值。拥有极快的查找速度。

之前做华为机试题时，碰到过一个算法题。需要根据名字找到对应学生的成绩。如果使用**Array** 来实现。可能得需要两个数组来实现。Array越长，查找时间越长。

```JavaScript
var names = ['Aoc', 'Bob', 'Tom'];
var scores = [100, 75, 85];
```


但是如果使用Map来实现，只需要一堆键值对，就可以根据名字来查找成绩，无论表多大，都可以快速查找。

```JavaScript
var newMap = new Map([['Aoc', 100], ['Bob', 75], ['Tom', 85]]);

newMap.get('Aoc'); // 100
```


当然有些人说了，这不是和对象的功能一样吗？注意上面我说的，Map可以把**任何值** 都当做**键** 或值！

1. 元素顺序

&ensp;&ensp;&ensp;&ensp;上面也说了，Map可以记住原始的插入顺序，而Object不行。

2. 键值支持任意格式。

&ensp;&ensp;&ensp;&ensp;Map的键值，可以是任意格式的数据。包括Object，Array。那么：Object可以吗🎉

```JavaScript
let map = new Map();
let names = ['Eric', 'Iven'];

map.set(names, 'Eric and Iven');
map.get(names);
// Eric and Iven

```


3. Map集成自`Object`

4. Map可以直接被迭代；Object需要以某种方式获取它的键然后才能迭代。


### Map的基本使用

Map支持一种方法来创建新的实例

```JavaScript
var map = new Map([[1, 2], [3, 4])
```


### map.get(`key`)

&ensp;&ensp;&ensp;&ensp;Map想要访问元素，可以使用Map本身的方法。

```JavaScript
Map.get(1)//2
Map.get(3)//4

```


### map.set(`key, value`)

&ensp;&ensp;&ensp;&ensp;Map可以使用set来添加一个值。

```JavaScript
Map.set("key") = value
Map.set("key", value)
//如果key已经存在，就会覆盖原始内容。
var map = new Map();
map.set('Hzg', 18)

```


### map.has(`kay`)

&ensp;&ensp;&ensp;&ensp;Map使用has方法来检查映射是否包含`key`元素，如果有则返回`true`

```JavaScript
Map.has('Hzg')//true
```


### map.delete(`kay`)

&ensp;&ensp;&ensp;&ensp;Map使用`delete`方法来删除映射中包含的`key`元素

```JavaScript
Map.delete('Hzg')//true
```


### map.clear()

&ensp;&ensp;&ensp;&ensp;Map从映射中移除所有元素。

```JavaScript
Map.clear()
```


### map.forEach(`item`, `key`, `mapObj`)

&ensp;&ensp;&ensp;&ensp;Map.forEach使用对映射中的每个元素执行指定操作

```JavaScript
var map = new Map();
map.set(1, "black");
map.set(2, "red");
map.set("colors", 2);
map.set({x:1}, 3);

map.forEach(function (item, key, mapObj) {
    document.write(item.toString() + "<br />");
});

document.write("<br />");
document.write(map.get(2));

// Output:
// black
// red
// 2
// 3
//
// red
```


### map.toString()

&ensp;&ensp;&ensp;&ensp;Map 返回映射的字符串表示形式。。

```JavaScript
Map.clear();
```


### map.valueOf()

&ensp;&ensp;&ensp;&ensp;Map 返回指定对象的原始值。

```JavaScript
Map.valueOf();
```


### 如何封装一个Map对象？

```JavaScript
Array.prototype.remove = function(s) {     
    for (var i = 0; i < this.length; i++) {     
        if (s == this[i])
            this.splice(i, 1);
    }     
}     
    
/**   
 * Simple Map   
 *    
 *    
 * var m = new Map();   
 * m.put('key','value');   
 * ...   
 * var s = "";   
 * m.each(function(key,value,index){   
 *      s += index+":"+ key+"="+value+"/n";   
 * });   
 * alert(s);   
 *    
 * @author dewitt   
 * @date 2008-05-24   
 */    
function Map() {     
    /** 存放键的数组(遍历用到) */    
    this.keys = new Array();     
    /** 存放数据 */    
    this.data = new Object();     
         
    /**   
     * 放入一个键值对   
     * @param {String} key   
     * @param {Object} value   
     */    
    this.put = function(key, value) {     
        if(this.data[key] == null){     
            this.keys.push(key);     
        }     
        this.data[key] = value;     
    };     
         
    /**   
     * 获取某键对应的值   
     * @param {String} key   
     * @return {Object} value   
     */    
    this.get = function(key) {     
        return this.data[key];     
    };     
         
    /**   
     * 删除一个键值对   
     * @param {String} key   
     */    
    this.remove = function(key) {     
        this.keys.remove(key);     
        this.data[key] = null;     
    };     
         
    /**   
     * 遍历Map,执行处理函数   
     *    
     * @param {Function} 回调函数 function(key,value,index){..}   
     */    
    this.each = function(fn){     
        if(typeof fn != 'function'){     
            return;     
        }     
        var len = this.keys.length;     
        for(var i=0;i<len;i++){     
            var k = this.keys[i];     
            fn(k,this.data[k],i);     
        }     
    };     
         
    /**   
     * 获取键值数组(类似Java的entrySet())   
     * @return 键值对象{key,value}的数组   
     */    
    this.entrys = function() {     
        var len = this.keys.length;     
        var entrys = new Array(len);     
        for (var i = 0; i < len; i++) {     
            entrys[i] = {     
                key : this.keys[i],     
                value : this.data[i]     
            };     
        }     
        return entrys;     
    };     
         
    /**   
     * 判断Map是否为空   
     */    
    this.isEmpty = function() {     
        return this.keys.length == 0;     
    };     
         
    /**   
     * 获取键值对数量   
     */    
    this.size = function(){     
        return this.keys.length;     
    };     
         
    /**   
     * 重写toString    
     */    
    this.toString = function(){     
        var s = "{";     
        for(var i=0;i<this.keys.length;i++,s+=','){     
            var k = this.keys[i];     
            s += k+"="+this.data[k];     
        }     
        s+="}";     
        return s;     
    };     
}     
    
    
function testMap(){     
    var m = new Map();     
    m.put('key1','Comtop');     
    m.put('key2','南方电网');     
    m.put('key3','景新花园');     
    alert("init:"+m);     
         
    m.put('key1','康拓普');     
    alert("set key1:"+m);     
         
    m.remove("key2");     
    alert("remove key2: "+m);     
         
    var s ="";     
    m.each(function(key,value,index){     
        s += index+":"+ key+"="+value+"/n";     
    });     
    alert(s);     
}

```


## Set对象

Set类似于数组，但是成员的值都是唯一的，没有重复的值。它本身是一个构造函数，用来生成Set数据结构。Set中没有重复的key。

创建Set需要提供一个`Array`作为参数.

```JavaScript
var set = new Set([1,2,3,'3',4]);
            //添加一个key
            set.add(5);
            //重复元素在Set中自动被过滤
            set.add(5);
            console.log(set);//Set {1, 2, 3, 4,5}
            //删除一个key
            set.delete(2);
            console.log(set);//Set{1, 3, "3", 4, 5}//注意数字3和字符串'3'是不同的元素。


```


#### Set.prototype.keys()

&ensp;&ensp;&ensp;&ensp;返回键名的遍历器。

```JavaScript
const set = new Set(['a', 'b', 'c'])
for (let item of set.keys()) {
 console.log(item)
}
// a
// b
// c
```


#### Set.prototype.values()

&ensp;&ensp;&ensp;&ensp;返回键值的遍历器。

```JavaScript
const set = new Set(['a', 'b', 'c'])
for (let item of set.values()) {
 console.log(item)
}
// a
// b
// c
```


#### Set.prototype.entries()

&ensp;&ensp;&ensp;&ensp;返回键值的遍历器。

```JavaScript
for (let item of set.entries()) {
 console.log(item)
}
// ["a", "a"]
// ["b", "b"]
// ["c", "c"]

```


### 应用

#### 数组去重

```JavaScript
const array = [1,2,3,4,5,4,3]
const unique = [...new Set(array)] //[1,2,3,4]

```


Array.from 方法可以将 Set 结构转为数组。我们可以专门编写使用一个去重的函数

```JavaScript
function unique(array) { 
  return Array.from(new Set(array))
}
unique([1,2,3,4,5,5])//[1,2,3,4,5]

```


#### 字符去重

另外 Set 是如此强大，因此使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。

```JavaScript

//并集
let union=new Set（[...a，..b]）；
//Set{1，2，3，4}
//交集
1et intersect=new set（[..…a].filter（x=>b.has（x）））；
//set{2，3}
//差集
1et difference=new Set（[.…a].filter（x=>lb.has（x）））；
//Set{1}
```