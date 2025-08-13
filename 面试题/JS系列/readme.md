# 一、JS数组上常用的的方法有哪些？

* 增：`push()`, `unshift()`, `concat()`, `splice()`
* 删：`shift()`, `pop()`, `slice()`, `splice()`
* 改：`splice()`
* 查：`includes()`, `indexOf()`, `find()`, `findIndex()`, `lastIndexOf()`, `findLastIndex()`
* 遍历：`forEach()`, `map()`, `filter()`, `every()`, `some()`, `sort()`, `reduce()`

# 二、如何实现数组扁平化？flat方法？

- 是什么

flat是Array原型上的函数，用于将高维数组处理成低维数组

- 原理

1. 递归
2. reduce + 递归
3. while + 解构
4. toString()

# 三、字符串上常用的方法有哪些？

- 增：`concat()`
- 删：`slice()`, `substring()`, `substr()`
- 改：`replace()`, `toUpperCase()`, `toLowerCase()`, `trim()`,
`trimStart()`, `trimEnd()`, `repeat()`, `padEnd()`, `padStart()`
- 查：`includes()`, `indexOf()`, `lastIndexOf()`, `charAt()`, `startWith()`, `endWith()`, `match()`