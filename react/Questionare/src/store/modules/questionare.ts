import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// 创建子模块
const questionare = createSlice({
  name: 'questionare',
  initialState: {
    questions: [],
    answersId: [] as number[]
  },
  reducers: {
    setQuestions(state, action) {
      state.questions = action.payload
    },
    setAnswersId(state, action: PayloadAction<number>) {
      state.answersId.push(action.payload)
    }
  }
})

export const { setQuestions, setAnswersId } = questionare.actions

export default questionare.reducer