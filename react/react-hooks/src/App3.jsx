import { useReducer } from 'react'
import { produce } from 'immer'

function reducer (state, action) {
  switch (action.type) {
    case 'add':
      // return {
      //   result: state.result + action.num,
      // }
      return produce(state, (draft) => {
        draft.a.b.c += action.num
      })
    case 'minus':
      return {
        result: state.result - action.num,
      }
  }
}

function App3 () {
  // useReducer 接受的第二个参数作为reducer的第一个参数
  // dispatch 接受的参数作为reducer的第二个参数
  const [res, dispatch] = useReducer(reducer, { result: 0 })
  return (
    <div>
      <h3>{res.result}</h3>
      <button onClick={() => dispatch({ type: 'add', num: 2 })}>+</button>
      <button onClick={() => dispatch({ type: 'minus', num: 1 })}>-</button>

    </div>
  )
}

export default App3