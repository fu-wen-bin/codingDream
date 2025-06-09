// 1. 声明对象  --属性区分一定要加逗号
let FWB = {
  uname: '傅文斌',
  age: 18,
  gender: '男',
  'school': 'ECUT',
}

// new 方法格式
const o = new Object()
o.uname = 'new方法'
console.log(o)

// new简写格式
const ob = new Object({ uname: 'new方法简写格式' })
console.log(ob)

// 字面量格式
const obj3 = {
  uname: '字面量格式',
}
console.log(obj3)


// 2. 查询对象  --对象名.属性名  /  对象名['字符串类型属性名']
console.log(FWB.uname)
console.log(FWB.age)
console.log(FWB.gender)
console.log(FWB['school'])

// 3. 修改对象  --对象名.属性名 = 新值   --属性已存在则为修改，不存在则为新增属性
FWB.age = 20

// 4.js. 删除对象  --delete
delete FWB.age
console.log(FWB)

// 5. 对象中的方法
let obj = {
  uname: '刘德华',
  // 方法
  song: function (x, y) {
    console.log('冰雨')
    console.log(x + y)
  },
  dance: function () {
    console.log('跳舞')
  },
}
obj.song(1, 2) //调用对象方法
obj.dance()

// 6. 遍历对象  --for in 语句遍历对象
let obj2 = {
  uname: '傅文斌',
  age: 18,
  gender: '男',
}
//for in
for (let key in obj2) {
  console.log(key) //取出来的是字符串类型 'uname' 'age' 'gender'
  console.log(obj2[key]) //因为 obj.key 相当于 obj.'属性'，语法错误！！  只能用obj['属性名']！！
}

// 7. 遍历数组对象
let students = [
  { name: '小明', age: 18, gender: '男', hometown: '河北省' },
  { name: '小红', age: 19, gender: '女', hometown: '河南省' },
  { name: '小刚', age: 17, gender: '男', hometown: '山西省' },
  { name: '小丽', age: 18, gender: '女', hometown: '山东省' },
]

//数组使用for循环遍历
for (let i = 0; i < students.length; i++) {
  console.log(students[i]) //每个对象
  console.log(students[i].name) //取出每个对象的具体属性
  console.log(students[i].age)
  console.log(students[i].gender)
  console.log(students[i].hometown)
}
