import express from 'express'
import { env, pipeline } from '@huggingface/transformers'

const app = express()
app.use(express.json())

// 启用本地模型
env.allowLocalModels = true

// 初始化模型
let sentimentPipeline
const initModel = async () => {
  console.log('正在加载模型...')
  sentimentPipeline = await pipeline(
    'sentiment-analysis',
    '../onnx_model', // 本地模型目录
    {
      device: 'gpu',
      dtype: 'fp32',
      revision: undefined,
      localFilesOnly: true, // 强制使用本地文件
    },
  )
  console.log('模型加载完成')
}

// api
app.post('/api/sentiment', async (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: '请输入文本' })
  }
  try {
    const result = await sentimentPipeline(text)
    res.json(result)
  } catch (error) {
    console.error('模型推理错误:', error)
    console.error('错误详情:', error.message)
    console.error('错误堆栈:', error.stack)
    res.status(500).json({ error: '模型推理错误', details: error.message })
  }
})

// 启动服务器
const port = 3000
app.listen(port, async () => {
  await initModel()
  console.log(`服务器运行在 http://localhost:${port}`)
})