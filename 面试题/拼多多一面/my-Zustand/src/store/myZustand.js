import { useEffect, useState } from 'react'

const createStore = (createState) => {
  let state
  const listeners = new Set()  // 记录哪些组件用到了 state 中的数据

  const setState = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    // nextState对象中有什么key是 state 里面也有的，有的话就用 nextState 中的值替换 state 中对应的值
    if (!Object.is(nextState, state)) {
      state = Object.assign({}, state, nextState)
    }
  }

  const getState = () => state

  const subscribe = (listener) => { // 记录哪些组件用到了 state 中的数据
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const getInitialState = () => state  // state 是最初的状态

  const store = { setState, getState, subscribe, getInitialState }

  state = createState(setState, getState, store)

  return store
}

const useStore = (api, selector) => {  // 感知到仓库在哪个组件中被使用
  const [, forceRender] = useState(0)
  useEffect(() => {
    api.subscribe((state, prevState) => {
      const newObj = selector(state)
      const oldObj = selector(prevState)

      if (newObj !== oldObj) {
        forceRender(Math.random())
      }
    })
  }, [])

  return selector(api.getState())
}

const create = (createState) => {
  const api = createStore(createState)
  const useBoundStore = (selector) => useStore(api, selector)
  Object.assign(useBoundStore, api)  // useBoundStore不仅是个函数体，且身上还拥有一系列方法
  return useBoundStore
}

export default create