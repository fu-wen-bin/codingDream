<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'

const h2Ref = ref()

onBeforeMount(() => {
  console.log('App2 onBeforeMount', h2Ref.value)
})
onMounted(() => {
  console.log('App2 onMounted', h2Ref.value)
})
</script>

<template>
  <h2 ref="h2Ref">hello</h2>
</template>

<style scoped>

</style>