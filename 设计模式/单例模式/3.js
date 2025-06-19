class SingleDog {
  show () {
    console.log('我是一个单身狗')
  }

  static getInstance () {
    // 1. 如果实例不存在则 new 一个
    if (!SingleDog.instance) {
      SingleDog.instance = new SingleDog()
    }
    // 2. 如果实例存在则直接返回
    return SingleDog.instance
  }
}

const s1 = SingleDog.getInstance
const s2 = SingleDog.getInstance
console.log(s1) // SingleDog的原型对象
console.log(s2) // SingleDog的原型对象
console.log(s1 === s2) // true

