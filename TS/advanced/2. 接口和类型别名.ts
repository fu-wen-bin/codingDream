// 接口
interface Persons {
  name: string
}

function person (p: Persons) {
  return `Hello, I am ${p.name}`
}

// 类型别名
type abc = number | string // 联合类型 -- 满足其一
type def = Persons & { age: number } // 交叉类型 -- 同时满足

let obj: def = {
  name: 'Alice',
  age: 30
}