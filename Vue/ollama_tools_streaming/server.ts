import express from 'express'
import axios from 'axios'
import * as dotenv from 'dotenv'
import { exec } from 'child_process'

dotenv.config({
  path: ['.env.local', '.env'],
})

const app = express()
const port = 3000

app.use(express.json())

app.post('/chat', async (req, res) => {
  const { message } = req.body

  const model = process.env.OLLAMA_MODEL
  const base_url = process.env.OLLAMA_API

  const messages = [
    {
      role: 'system',
      content: '如果有需要，你可以调用DirFiles工具查找当前目录下的文件和文件夹',
    },
    {
      role: 'user',
      content: message,
    },
  ]

  try {
    const response = await axios.post(`${base_url}/api/chat`, {
      model,
      messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'DirFiles',
            description: '查找当前目录下的文件和文件夹',
          },
        }],
      stream: false,
    })
    const reply = response.data.message.content

    if (response.data.message.tool_calls &&
        response.data.message.tool_calls.length &&
        response.data.message.tool_calls[0].function?.name === 'DirFiles') {
      exec('ls -la', async (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 ls-la 命令时出错: ${error}`)
          res.status(500).json({ error: `执行 ls-la 命令时出错: ${error}` })
          return
        }
        if (stderr) {
          console.error(`ls-la 命令执行出错: ${stderr}`)
        }
        //
        messages.push({
          role: 'tool',
          name: 'DirFiles',
          content: `当前目录文件列表：\n\`\`\`\n${stdout}\`\`\` `,
        })
        const result = await axios.post(`${base_url}/api/chat`, {
          model,
          messages,
          stream: false,
        })

        // 返回AI 的回复和文件列表
        // res.json({ reply: `${reply}\n\n 当前目录文件列表：\n\`\`\`\n${stdout}\`\`\` ` });
        res.json({ reply: result.data.message.content })
      })
    }

  } catch (error) {
    console.error(`请求 Ollama API 时出错: ${error}`)
    res.status(500).json({ error: `请求 Ollama API 时出错: ${error}` })
  }

})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
