const fs = require('fs')

// 同步
// const syncData = fs.readFileSync('./test.txt')
// console.log(syncData);

// 异步
// fs.readFile('./test.txt', 'utf-8', (err, data) => {
//   if (!err) {
//     console.log(data);
//   }
// })

// fs.promises.readFile('./test.txt', 'utf-8').then(res => {
//   console.log(res);
// })

// fs.writeFileSync('./newTest.md', 'hello world')

// const imgBuf = fs.readFileSync('./logo.jpg')
// // console.log(Buffer.isBuffer(imgBuf), imgBuf.length);
// fs.mkdirSync('./pic')
// fs.writeFileSync('./pic/newlogo.jpg', imgBuf)

// console.log(fs.statSync('./test.txt'));
// 

// fs.rmSync('pic/newlogo.jpg')