---
title: What is Lined List
date: 2022-06-15
categories:
  - Arithmetic
tags:
  - Arithmetic
---

# 链表

## 什么是链表
通常我们在程序中想要存储多个元素，数组可能是最常用的数据结构，数组这种数据结构非常方便，它甚至可以通过非常简单的方式即 [] 这种语法来访问其元素。

而链表存储的也是有序的元素集合，但不同于数组的是，链表中的元素在内存中并不是连续的，每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也可以称为指针）组成
<img :src="$withBase('/arithmetic/linked_list.png')" alt="foo">

## 单向链表
单向链表每个元素由一个存储元素本身的节点和一个指向下一个元素的指针构成，如下图

<img :src="$withBase('/arithmetic/linked_list2.png')" alt="foo">

### 实现一个单链表
```js
class Node {  //节点类
    //构造函数
    constructor(val) { 
        this.val = val;
        this.next = null;
    }
}
class LinkedList {  // 链表类
    //构造函数
    constructor() { 
        this.head = null;
        this.length = 0;
    }
    //新增节点
    append(val) { 
        let node = new Node(val);
        let current; //暂存当前位置
        if(this.head === null) { // 如果头结点为空,当前节点作为头结点
            this.head = node;
        } else { 
            current = this.head;
            while(current.next) {     //遍历找到链表尾部
                current = current.next;
            }
            current.next = node;    //在链表尾部加入新节点
        }
        this.length++; //更新链表长度
    }
    //删除节点,并获得删除节点的值
    removeAt(index) { 
        if(index > -1 && index < this.length) { //预防下标越界
            var current = this.head;//暂存当前位置
            var previous; //暂存当前位置的前一个
            var position = 0;
            if(index === 0) {  //要删除的是第一个位置，就得改变头指针指向
                this.head = current.next;
            } else { 
                while(position++ < index) { //遍历直到current处于index位置
                    previous = current;
                    current = current.next;  //此时current处于index处,previous在index-1处
                }
                previous.next = current.next; //改变链表结构,跳过index处
            }
            this.length--; //更新链表长度
            return current.val; //返回index处的值
        } else { 
            return null;    //下标越界返回空
        }
    }
    //插入节点
    insert(index,val) {
        if(index > -1 && index <= this.length) { 
            let node = new Node(val);
            let current = this.head;
            let previous;
            let position = 0;
            if(index === 0) { 
                node.next = current;
                this.head = node;
            } else { 
                while(position++ < index) { 
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            length++;
            return true; //插入成功
        } else { 
            return false; //插入失败
        }
    }
    //获取索引
    indexOf(val) { 
        let current = this.head;
        let position = 0;
        while(current) { 
            if(current.val === val) { 
                return position;
            }
            position++;
            current = current.next;
        }
        return -1; //未找到索引
    }
    //将链表转换成字符串
    toString() { 
        let current = this.head;
        let string = '';
        while(current) { 
            string += current.val + ((current.next ? ',': ''));
            current = current.next;
        }
        return string;
    }
    //链表长度
    size() { 
        return this.length;
    }
    //判断链表是否为空
    isEmpty() { 
        return this.length === 0;
    }
}

```

## 双向链

单向链表中每一个元素只有一个 next 指针，用来指向下一个节点，我们只能从链表的头部开始遍历整个链表，任何一个节点只能找到它的下一个节点，而不能找到它的上一个节点，双向链表中的每一个元素拥有两个指针，一个用来指向下一个节点，一个用来指向上一个节点，双向链表中，除了可以像单向链表一样从头部开始遍历之外，还可以从尾部进行遍历，如下图：

<img :src="$withBase('/arithmetic/linked_list3.png')" alt="foo">

### 实现

它比单向链表多一个指针prev，指向上一个节点。
```js
/**
 * @description: 创建双向链表单节点类
 * @param {*} val 节点值
 * @return {*}
 */
function ListNode(val) {
  this.val = val
  this.next = null
  this.prev = null
}
/**
 * @description: 创建双向链表类
 * @param {*}
 * @return {*}
 */
function DoubleLinkedList() {
  this.length = 0
  this.head = null
  this.tail = null
}
// 在双向链表的指定位置插入节点
DoubleLinkedList.prototype.insert = function (index, val) {
  if (index < 0 || index > this.length) return false

  // 插入到尾部
  if (index === this.length) {
    this.append(val)
  } else {
    let node = new ListNode(val)

    if (index === 0) { // 插入到头部
      if (this.head === null) {
        this.head = node
        this.tail = node
      } else {
        node.next = this.head
        this.head.prev = node
        this.head = node
      }
    } else { // 插入到中间位置
      let curNode = this.getElementAt(index)
      let prevNode = curNode.prev
      node.next = curNode
      node.prev = prevNode
      prevNode.next = node
      curNode.prev = node
    }
    this.length++
  }
  return true
}
// 向双向链表中追加节点
DoubleLinkedList.prototype.append = function (val) {
  let node = new ListNode(val)

  if (this.head === null) {
    // 链表为空，head 和 tail 都指向当前添加的节点
    this.head = node
    this.tail = node
  }
  else {
    // 链表不为空，将当前节点添加到链表的尾部
    this.tail.next = node
    node.prev = this.tail
    this.tail = node
  }

  this.length++
}

```

