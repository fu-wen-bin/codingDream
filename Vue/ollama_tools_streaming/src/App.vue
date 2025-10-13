<template>
  <div class="container">
    <h1>Ollama Tools Streaming</h1>
    <div>
      <label>输入：</label>
      <input type="text" v-model="question"/>
      <button @click="update">发送</button>
    </div>
    <div class="output">
      <div class="think">{{ thinkContent }}</div>
      <div v-html="replyContent"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'

const question = ref('帮我列出当前目录下的所有文件')
const content = ref('')

const update = async () => {
  if (!question.value) { return }
  content.value = '思考中...'

  const headers = {
    'Content-Type': 'application/json',
  }
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: question.value,
    }),
  })
  const data = await response.json()
  console.log(data)
  content.value = data.reply
}

const thinkContent = computed(() => {  // 会在用到的变量值变更时自动触发
  if (content.value.startsWith('<think>')) {
    const match = content.value.match(/^<think>([\s\S]*?)<\/think>/im)
    if (match) {
      return match[1].trim()
    } else {
      return content.value.replace(/^<think>/, '')
    }
  }
  return ''
})

const replyContent = computed(() => {
  let cont = ''
  if (content.value.startsWith('<think>')) {
    cont = content.value.split('</think>')[1] || ''
  } else {
    cont = content.value
  }
  // console.log(marked(cont));

  return marked(cont)
})


</script>

<style lang="css" scoped>

</style>