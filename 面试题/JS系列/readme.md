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

# 四、谈谈js 中的类型转换机制

- 是什么
  js 引擎在执行各种运算符对于数据的类型是有要求的，如何数据类型和预期的不符合，就会发生类型转换

- 特点：

1. 显示类型转换
2. 隐式类型转化

- 显示类型转换：人为借助构造函数来将一种类型转换成希望的类型，这其中如果是原始值转原始值，官方给出了直接的转换结果。但如果是引用类型转原始类型：Number([1, 2])

1. ToNumber([1, 2])  || ToString()
2. ToPrimitive([1, 2], Number)
3. 判断 参数 是否为原始类型，是则返回
4. 否则，调用 xxx.valueOf()，得到原始值则返回
5. 否则，调用 xxx.toString()，得到原始值则返回
6. 否则报错

   <!-- String([1, 2]) -->

- 隐式类型转化：通常发生在 四则运算（+ - * / %），比较运算（== != > < ）判断语句（if while）

# 五、介绍一下 js 中的拷贝问题

- 是什么

  因为js 中的原始类型存在栈中，引用类型存在堆中，再把引用地址存在栈中。所以拷贝通常只发生在引用类型上。效果是创建一份新的数据，让新数据拥有原数据一样的属性值

- 方法

1. 浅拷贝：拷贝对象的属性，值如果是引用类型，则共用同一个地址
2. 深拷贝：拷贝对象的属性，值如果是引用类型，则创建新的子对象来进行新的拷贝，实现层层拷贝

- 浅拷贝:
  slice(),
  [].concat(arr),
  [...arr], Object.create()
  arr.toReversed().reverse()
  Object.assign({}, obj)

- 深拷贝：

1. JSON.parse(JSON.stringify(obj))  --- 不能处理，undefined, function, symbol, 不能处理循环引用

2. structuredClone()  --- 不能处理 function, symbol, bigint

3. MessageChannel()  --- 不能处理 function, symbol


- 原理

  深拷贝：递归拷贝，判断是否是引用类型，如果是则递归拷贝，否则直接赋值

# 六、说说你对闭包的理解

- 是什么

  根据作用域链的查找规则，内部函数一定有权力访问外部函数的变量。另外，一个函数执行完后它的执行上下文会被销毁。那么当函数A内部声明一个函数B,而函数B被拿到函数A外部执行时，为了保证以上两个规则正常执行，A函数在执行完毕后会将B需要访问的变量保存在一个集合当中，并留在调用栈当中，这个集合就是闭包。

- 特点：

1. 用于封装模块，避免全局变量污染
2. 延长了变量的生命周期

3. 造成内存泄露

- 场景：

1. 柯里化
2. 单例模式