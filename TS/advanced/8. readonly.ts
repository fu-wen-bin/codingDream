// const PI = 3.14 // 常量
// PI = 3.1415926 // 常量不能被重复赋值

class Per {
  readonly name: string | undefined // 只读属性
}

let p1 = new Per()
p1.name = 'Alice' // 只读属性不能被重新赋值