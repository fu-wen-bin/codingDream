const http = require('http')
const path = require('path')
const fs = require('fs')
const mime = require('mime')  // 用于获取文件的 MIME 类型

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', req.url))  // xxx/http/www/index.html
  if (fs.existsSync(filePath)) {  // 判断文件是否存在
    const stats = fs.statSync(filePath)  // 获取文件详情
    const isDirectory = stats.isDirectory()  // 判断是否是目录

    if (isDirectory) {
      filePath = path.join(filePath, 'index.html')  // 如果是目录，则默认访问 index.html
    }

    // 读取文件资源
    const content = fs.readFileSync(filePath)
    const { ext } = path.parse(filePath)  // 获取文件的扩展名
    /*if (ext === '.png') {
      res.writeHead(200, { 'Content-Type': 'image/png' })
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    }*/
    res.writeHead(200, { 'Content-Type': mime.getType(ext) })

    return res.end(content)  // 返回文件内容

  }

// 文件不存在
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end('<h1>404 not found</h1>')

})

server.listen(8080, () => {
  console.log('server is running at http://127.0.1:8080')
})