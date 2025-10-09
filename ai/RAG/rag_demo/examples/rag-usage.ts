import { SimpleRag } from '../src'

async function main () {
  const rag = new SimpleRag()
  await rag.initialize()
  const inserted = await rag.add('RAG技术原理') // 插入向量 存入知识
  console.log(JSON.stringify(inserted))

  const res = await rag.query('RAG是什么?') // 如果是“RAG技术原理”，说明向量检索成功
  console.log(JSON.stringify(res))

  const res2 = await rag.add('无关紧要的问题')
  console.log(JSON.stringify(res2))
}

main()