import { createSlice } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter', // 子模块的名称
  initialState: {
    count: 0, // 初始状态
    list: ['html', 'css', 'js'], // 初始列表
  },
  reducers: {  //修改数据的同步方法
    add (state) {
      state.count += 1 // 增加计数
    },
    addList (state, action) {
      state.list.push(action.payload) // 添加到列表中，action.payload 是传入的值
    },
  },
})

// 导出 actions 和 reducer
export const { add, addList } = counter.actions // 导出仓库中的 add, addList 方法

const counterReducer = counter.reducer
export default counterReducer // 导出 reducer--仓库的reducer才是仓库这个模块