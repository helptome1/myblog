---
title: What is BinarySearchTree
date: 2022-05-21
categories:
  - Arithmetic
tags:
  - Arithmetic
---

# What is BinarySearchTree

## 什么是二叉树？

二叉树的节点包含两个子节点，一个是左侧子节点，另一个是右侧子节点。而**二叉搜索树**也是二叉树的一种，**但是只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大的值。**

我们通过指针（引用）来表示节点之间的关系，每一个节点都有三个指针，分别指向不同的值。

![](https://secure2.wostatic.cn/static/hgesVt4cQvXuU1FLg7KqYY/二叉树节点关系.svg?auth_key=1679217549-7itNzui8K9cM9fZnWd8Rfm-0-98ba18b7ea663881735b3d08dc48b826)

# 如何实现一个二叉搜索树？

### Node 类

首先创建一个 Node 类来表示二叉搜索树中的每一个节点。它包含当前节点的值，以及左右节点的指针

```JavaScript
/**
 * 首先需要创建一个二叉树的节点类
 */
class Node {
  constuctor(key) {
    // 二叉树的左节点
    this.left = null
    // 二叉树的右节点
    this.right = null
    // 二叉树的当前节点
    this.key = key
  }
}
```

除此之外，一个二叉树还应该具备一下功能，

`insert(key)`：向树中插入一个新的键。

`search(key)：`在树中查找一个键。如果节点存在，则返回 true；如果不存在，则返回 false。

`inOrderTraverse()：`通过中序遍历方式遍历所有节点。

`preOrderTraverse()：`通过先序遍历方式遍历所有节点。

`postOrderTraverse()：`通过后序遍历方式遍历所有节点。

`min()：`返回树中最小的值/键。

`max()：`返回树中最大的值/键。

`remove(key)：`从树中移除某个键

### `Insert（key）`

首先实现插入二叉搜索树节点的功能。使用二分法把值插入到对应的位置，便于后续的查找等等一系列操作。

```JavaScript
// 数组中的每个元素都是一个二叉树的节点

/**
 * 首先需要创建一个二叉树的节点类
 */
class Node {
  constuctor(key) {
    // 二叉树的左节点
    this.left = null
    // 二叉树的右节点
    this.right = null
    // 二叉树的当前节点
    this.key = key
  }
}
/**
 * 二叉树类
 */
class BinaryTree {
  constructor() {
    // 二叉树的根节点
    this.root = null
  }
  /**
   * 插入一个节点
   */
  insert(key) {
    // 创建一个新的节点
    const newNode = new Node(key)
    // 如果二叉树为空，则将新节点作为二叉树的根节点
    if (this.root === null) {
      this.root = newNode
    } else {
      // 如果二叉树不为空，则将新节点插入到二叉树中
      this.inOrderTraverNode(this.root, newNode)
    }
  }

  /**
   * 使用二分法把新插入的节点放到当前节点下的正确位置
   * @param {*} node 当前节点
   * @param {*} newNode 需要插入的节点
   */
  inOrderTraverNode(node, newNode) {
    // 如果当前节点的值大于新节点的值，则将当前节点的左节点作为当前节点
    if (newNode.key < node.key) {
      // 如果当前节点的左节点为空，则将新节点作为当前节点的左节点
      if (node.left !== null) {
        node.left = newNode
      } else {
        // 否则使用递归找到当前节点子节点的左节点
        this.inOrderTraverNode(node.left, newNode)
      }
    }
    // 如果当前节点的值小于新节点的值，则将当前节点的右节点作为当前节点
    else {
      if (node.right !== null) {
        node.right = newNode
      } else {
        this.inOrderTraverNode(node.right, newNode)
      }
    }
  }
}

const binaryTree = new BinaryTree()
const node = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
node.map(item => {
  binaryTree.insert(item)
})

console.log(binaryTree)

```

### `search（node, key）`

在二叉树中搜索某一个键值, 可以从某一个节点开始搜索其下子树的值。

```JavaScript
  /**
   * 搜索某一个节点
   */
  search(node, key) {
    if (node === null) {
      return false
    }
    if (key === node.key) {
      return true
    }
    if (key < node.key) {
      return this.search(node.left, key)
    } else if (key > node.key) {
      return this.search(node.right, key)
    }
  }
```
