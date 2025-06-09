// new 方法格式
const obj = new Object()
obj.uname = 'new方法'
console.log(obj)

// new简写格式
const obj2 = new Object({ uname: 'new方法简写格式' })
console.log(obj2)

// 字面量格式
const obj3 = {
  uname: '字面量格式',
}
console.log(obj3)

// 自定义构造函数创建  --可以快速创建多个对象
// 约定：
// 1. 命名必须以大写字母开头
// 2. 只能用 new 操作符执行

function Pig (uname, age) {
  this.uname = uname
  this.age = age
}

const p = new Pig('佩奇', 6)
console.log(p)

function Goods (name, price, count) {
  this.name = name
  this.price = price
  this.count = count
}

const mi = new Goods('小米', '1999', '20')
const hw = new Goods('华为', '3999', '50')
console.log(mi)
console.log(hw)

const date = new Date().toLocaleString()
console.log(date)