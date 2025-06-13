class Point {
  constructor (x, y) { // 构造器函数，固有的函数语法，可帮助类接收参数
    this.x = x
    this.y = y
  }

  toString () { // 类的实例方法
    return `(${this.x}, ${this.y})`
  }

  static toSum (a, b) { // 类的静态方法 私有方法，不会被实例对象继承
    return a + b
  }
}

var p = new Point(1, 2)
console.log(p.toString()) // 输出: (1, 2)