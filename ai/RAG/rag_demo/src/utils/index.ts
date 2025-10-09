/*
* 工具函数集合
*/
import ollama from 'ollama'

function getEmbedding (text: string) {
  return ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  })
}

// 过长的文本不适合处理成一个向量，需要切割为多个子文本
function splitText (text: string, overlap = 50, chunkSize = 300) { // 将长文本拆分为多个子文本
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize))
    start += chunkSize - overlap
  }
  return chunks
}

export async function getVector (text: string) {
  return (await getEmbedding(text)).embedding
}

export async function getEmbeddings (text: string) { // 将长文本且各位多个子文本，将每个子文本分别生成向量
  const chunks = splitText(text)
  // @ts-ignore
  const embeddings = await Promise.all(
    chunks.map(async (chunk) => getEmbedding(chunk)))
  return embeddings.map((item: { embedding: any }, i: string | number) => ({
    vector: item.embedding,
    metadata: {
      text: chunks[i],
    },
  }))
}

