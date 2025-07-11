import { createSlice } from '@reduxjs/toolkit'

const todoList = createSlice({
  name: 'todoList', // 子模块的名称
  initialState: {
    list: [
      { id: 1, text: 'Learn React', completed: false },
      { id: 2, text: 'Learn Vue', completed: true },
      { id: 3, text: 'Build a Todo App', completed: false },
    ], // 初始列表
  },
  reducers: {  //修改数据的同步方法
    add (state, action) {
      state.list.push(action.payload) // 添加到列表中，action.payload 是传入的值
    },
  },
})

// 导出 actions 和 reducer
export const { add } = todoList.actions // 导出仓库中的 add 方法

const todoListReducer = todoList.reducer
export default todoListReducer // 导出 reducer--仓库的reducer才是仓库这个模块