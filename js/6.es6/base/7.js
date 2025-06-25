const obj = {
  name: 'FWB',
  age: 18,
  // like: {
  //   n: '唱歌'
  // }
}

const key = 'sex'

obj[key] = 'boy'

console.log(obj);

// 链式判断
// 如果obj.like存在，则返回obj.like.n，否则返回undefined
// 赋值的时候不可使用 ?

// console.log(obj.like?.n);
