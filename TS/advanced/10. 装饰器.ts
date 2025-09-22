function classDecorator<T extends {
  new (...arg: any[]): {}
}> (constructor: T) {
  return class extends constructor {
    newProperty = 'new property'
    hello = 'Tom'// 将会覆盖原有的hello属性
  }
}

@classDecorator
class Greeter { // Greeter == Greeter || classDecorator(Greeter)
  property = 'property'
  hello: string

  constructor (m: string) {
    this.hello = m
  }
}

console.log(new Greeter('world')) // 先执行被装饰的类的构造函数，再执行装饰器返回的类的构造函数
// 输出: Greeter { property: 'property', hello: 'Tom', newProperty: 'new property' }