<template>
  <div class="box">
    响应式变量：
    <div>{{ state.count }} -- {{ state.age }}</div>
    <button @click="handleAdd">add</button>
  </div>
  <div class="box" @click="changeFlag">
    动态更新类名：
    <h2 :class="{ red: state.flag }">福娃B接好运</h2>
  </div>
  <div class="box">
    v-for：
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
  </div>
  <div class="box">
    v-if / v-show：
    <h2 v-show="state.show">hello</h2>
    <button @click="state.show = !state.show">改变hello可见性</button>
  </div>
  <div class="box">
    双向绑定：
    <input type="text" v-model="msg" />
    <h3>双向数据流 -- {{ msg }}</h3>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const msg = ref('hello')

const list = ['html', 'css', 'js']

const changeFlag = () => {
  state.flag = !state.flag
}

const state = reactive({
  count: 0,
  age: 18,
  name: 'Tom',
  flag: true,
  show: true,
})

const handleAdd = () => {
  state.count++
  state.age++
}
</script>

<style lang="css" scoped>
.box {
  border: 1px solid #000;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
}

.red {
  color: red;
}
</style>