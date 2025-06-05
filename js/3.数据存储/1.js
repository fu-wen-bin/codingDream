let num = 123  // Number
console.log(num)
console.log(num.toString()) // String

let flag = false // boolean
console.log(flag)

let un = undefined

let nu = null

// 以上都是字面量创建方式

// 以下都是构造函数创建写法  --不推荐

let str1 = new String('hello')
let str2 = new Number('hello')

let sy1 = Symbol('hello')
let sy2 = Symbol('hello')
console.log(sy1 === sy2) //false --symbol保证唯一性

