<script setup>
import { onMounted, ref } from 'vue'

const list = ref([])

onMounted(async () => {
  const res = await fetch('https://mock.mengxuegu.com/mock/66585c4db462b81cb3916d3e/songer/songer')
  const data = await res.json()
  console.log(data)
  list.value = data.data

})

const handleClick = (e) => {
  console.log(e.target.innerText)
  list.value = list.value.filter((item) => item.name !== e.target.innerText)
}

</script>

<template>
  <ul>
    <li v-for="(item,index) in list" :key="index" @click="handleClick">{{ item.name }}</li>
  </ul>
</template>

<style scoped>

</style>