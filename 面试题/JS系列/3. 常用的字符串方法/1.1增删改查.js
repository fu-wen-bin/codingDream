// 增加字符
const str = 'hello world'

const ss = str.concat('!')
console.log(ss) // hello world!

// 删除字符

// 删除最后一个字符 -- slice(个数, 索引)
const sss = ss.slice(0, -1)

// substring(索引) -- 从索引开始保留到最后
const s = str.substring(2)
// substr(开始索引, 结束索引) -- 保留从2开始到4的字符
const s1 = str.substring(2, 4)
console.log(s)
console.log(s1) // ll

// 修改字符

// replace(要替换的字符, 替换后的字符) -- 只替换第一个匹配的字符
const s2 = str.replace('world', 'everyone')

// repeat(重复次数) -- 返回一个新字符串，包含指定次数的原始字符串
const s3 = str.repeat(2) // hello worldhello world

// toUpperCase() -- 将字符串转换为大写

const s4 = str.toUpperCase() // HELLO WORLD

// toLowerCase() -- 将字符串转换为小写
const s5 = str.toLowerCase() // hello world

// trim() -- 删除字符串两端的空格
const s6 = '   hello world   '.trim() // hello world

// 查找字符

// console.log(str.indexOf('e'));
// console.log(str.includes('e'));
// console.log(str.lastIndexOf('e'));

// console.log(str.charAt(2));
// console.log(str.startsWith('hell'));
console.log(str.endsWith('o'))

// req.url  /home?id=123

const text = 'dog,cat,fat,sat'
let pat = /.at/
const mattches = text.match(pat)
console.log(mattches[0])