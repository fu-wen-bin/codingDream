import ollama from 'ollama'

// @ts-ignore
async function main () {
  const res = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: 'RAG是什么',
  })

  console.log(res) // 向量数组
}

main()