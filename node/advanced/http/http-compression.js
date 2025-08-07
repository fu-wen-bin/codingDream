const http = require('http')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const zlib = require('zlib') // 引入zlib模块，用于压缩响应内容

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', req.url)) // 默认访问index.html
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) { // 是文件夹
      filePath = path.join(filePath, '/index.html')
    }

    if (fs.existsSync(filePath)) {
      const { ext } = path.parse(filePath)
      const stat = fs.statSync(filePath)
      const timeStamp = req.headers['if-modified-since']
      let status = 200

      if (timeStamp && Number(timeStamp) === stat.mtimeMs) { // 该资源没有更新
        status = 304
      }

      const mimeType = mime.getType(ext)
      const responseHeaders = {
        'Content-Type': mimeType,
        'Cache-Control': 'max-age=86400',
        'Last-Modified': stat.mtimeMs,
      }

      // 判断前端支持哪种压缩方式
      const acceptEncoding = req.headers['accept-encoding']

      // 如果是文本或应用类型的文件，则进行压缩
      const compress = /^(text|application)\//.test(mimeType)

      if (compress) {
        // 字符串切割
        acceptEncoding.split(/\s*,\s*/).some(encoding => {
          if (encoding === 'gzip') {
            // 设置响应头，告知浏览器使用gzip解压缩
            responseHeaders['Content-Encoding'] = 'gzip'
            return true
          } else if (encoding === 'deflate') {
            // 设置响应头，告知浏览器使用deflate解压缩
            responseHeaders['Content-Encoding'] = 'deflate'
            return true
          } else if (encoding === 'br') {
            // 设置响应头，告知浏览器使用br解压缩
            responseHeaders['Content-Encoding'] = 'br'
            return true
          }
          return false
        })
      }

      res.writeHead(status, responseHeaders)

      const compressionEncoding = responseHeaders['Content-Encoding']

      if (status === 200) {
        const fileStream = fs.createReadStream(filePath)
        if (compress && compressionEncoding) {
          let comp = null

          // 根据浏览器支持的压缩方式创建对应的压缩流
          if (compressionEncoding === 'gzip') {
            comp = zlib.createGzip() // 创建gzip压缩流
          } else if (compressionEncoding === 'deflate') {
            comp = zlib.createDeflate() // 创建deflate压缩流
          } else if (compressionEncoding === 'br') {
            comp = zlib.createBrotliCompress() // 创建br压缩流
          }

          // 将文件流通过zlib的deflate方法进行压缩，然后再传输给浏览器
          fileStream.pipe(comp).pipe(res)
        } else {
          fileStream.pipe(res) // 直接将文件流传输给浏览器
        }
      } else {
        res.end()
      }
    }
  }
})

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
