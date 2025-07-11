// 总仓库
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './modules/counterStore.js'
import todoListReducer from './modules/todoListStore.js'

export default configureStore({
  reducer: { // 注册子模块
    // 在这里添加子模块的reducer
    counter: counterReducer, // counterStore.js中的reducer
    todoList: todoListReducer,
  },
  // 可以添加中间件、增强器等配置
})