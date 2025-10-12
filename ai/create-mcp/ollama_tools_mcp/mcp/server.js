import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { exec } from 'child_process'

// 创建一个 MCP 服务器
const server = new McpServer({
  name: 'Demo',
  version: '1.0.0',
})

// 往 mcp 对象上添加一个工具
server.tool('listFiles', '列出指定目录下的所有文件', { path: z.string() }, async ({ path }) => {
  return new Promise((resolve, reject) => {
    exec(`ls -al ${path}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`命令执行错误: ${error.message}`)
        resolve({
          content: [{ type: 'text', text: `命令执行错误: ${error.message}` }],
        })
        return
      }
      if (stderr) {
        console.error(`命令执行错误: ${stderr}`)
      }
      resolve({
        content: [
          {
            type: 'text',
            text: `已获取到目录 ${path} 下的文件列表: \n\`\`\`\n${stdout}\`\`\`\n`,
          }],
      })
    })
  })
})

// 创建一个标准输入输出传输通道
const transport = new StdioServerTransport()
await server.connect(transport)
console.error('MCP 服务器已连接')

// 创建一个 MCP 服务器
const server = new McpServer({
  name: 'Demo',
  version: '1.0.0',
})

// 往 mcp 对象上添加一个工具
server.tool('listFiles', '列出指定目录下的所有文件', { path: z.string() }, async ({ path }) => {
  return new Promise((resolve, reject) => {
    exec(`ls -al ${path}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`命令执行错误: ${error.message}`)
        resolve({
          content: [{ type: 'text', text: `命令执行错误: ${error.message}` }],
        })
        return
      }
      if (stderr) {
        console.error(`命令执行错误: ${stderr}`)
      }
      resolve({
        content: [
          {
            type: 'text',
            text: `已获取到目录 ${path} 下的文件列表: \n\`\`\`\n${stdout}\`\`\`\n`,
          }],
      })
    })
  })
})

// 创建一个标准输入输出传输通道
const transport = new StdioServerTransport()
await server.connect(transport)
console.error('MCP 服务器已连接')

