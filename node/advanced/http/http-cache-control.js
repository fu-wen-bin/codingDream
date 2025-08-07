const http = require('http')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const checksum = require('checksum')

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', req.url))  // xxxx  www/index.html  path.resolve('a', 'b') => a/b
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath)
    // console.log(stat);
    if (stat.isDirectory()) {  // 是文件夹
      filePath = path.join(filePath, '/index.html')
    }
    if (fs.existsSync(filePath)) {
      // 获取文件后缀，方便设置响应头的Content-Type
      const { ext } = path.parse(filePath)
      /*const timeStamp = req.headers['if-modified-since']
      let status = 200
      if (timeStamp && Number(timeStamp) === stat.mtimeMs) { // 该资源没有更新
        status = 304
      }
      res.writeHead(status, {
        'Content-Type': mime.getType(ext),
        'Cache-Control': 'max-age=86400',
        // 'last-modified': stat.mtimeMs
        'etag': ''  // 文件指纹｜｜文件签名
      })

      if (status === 200) {
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
      } else {
        res.end()
      }*/

      checksum.file(filePath, (err, sum) => {
        // 将文件读取成流类型，边让浏览器解析边继续读取资源
        const resStream = fs.createReadStream(filePath)
        // sum  文件指纹，每次文件内容变化，指纹也会变化
        sum = `"${sum}"`

        // 浏览器会在请求头中携带上次请求的资源指纹'if-none-match'，
        if (req.headers['if-none-match'] === sum) {
          res.writeHead(304, {
            'Content-Type': mime.getType(ext),
            'Cache-Control': 'max-age=86400',
            'etag': sum,
          })
          res.end()
        } else {
          res.writeHead(200, {
            'Content-Type': mime.getType(ext),
            'Cache-Control': 'max-age=86400',
            'etag': sum,
          })
          resStream.pipe(res)
        }

      })

    }

  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>404 Not Found</h1>')
  }

})

server.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})