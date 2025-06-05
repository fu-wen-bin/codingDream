function foo (person) {
  person.age = 20
  person = {
    name: '刘洋',
  }
  return person
}

let p1 = {
  name: '张三',
  age: 18,
}
let p2 = foo(p1)

console.log(p1)
console.log(p2)