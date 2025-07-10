// let x: any = 'hello'
// let y: number = 123
// y = x  // any 可以赋值给其他人，会导致any污染

// let x: unknown
// x = 1
// x = '1'
// let z: string
// z = x // unknown 不可以赋值给其他人

// let x: never // 不可以被赋值成任何值
// x = true

const x: string = 'hello'
const y: String = 'world' // String 是对象类型，string 是基本类型
const z: boolean = true
const b: bigint = 13216549n // ES2020 新增的类型，老版本不支持
const n: null = null // 只能赋值为 null
const u: undefined = undefined // 只能赋值为 undefined
const s: symbol = Symbol('symbol') // ES2015 新增的类型，老版本不支持


const o: object = { foo: 123 } // object 是一个更宽泛的类型，可以是任何非原始类型的值
const o1: Object = { bar: 456 } // Object 约等于any


const aa: 'hello' = 'hello' // 值类型，只能固定值


const bb: 'hello' | 'world' = 'hello' // 联合类型，可以是 'hello' 或 'world'
const sex: 'male' | 'female' = 'male' // 联合类型


type sexType = string | number // 自定义类型
let an: sexType = 'female'


let arr: number[] = [1, 2, 3] // 数组类型
let arr2: (number | string)[] = [1, 2, '3'] // 数组类型
let arr3: Array<number | string> = [1, 2, '3'] // 泛型


// 元组类型，固定长度和类型的数组
let tuple: [number, string,Function] = [1, '2',function(){}]


interface Person {
  name: string;
  age: number;
  sex: 'male' | 'female'
}
let p: Person = { name: 'John', age: 20, sex: 'male' } // 接口类型，定义对象的结构