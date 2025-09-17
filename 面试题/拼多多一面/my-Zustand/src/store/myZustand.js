import { useEffect, useState } from 'react'

const createStore = (createState) => {
  let state
  const listeners = new Set() // 监听函数的集合 -- 唯一性

  const setState = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    // nextState对象中有什么key是在state中也存在的，有的话就用nextState中的值覆盖state中的值
    if (!Object.is(nextState, state)) {
      const previousState = state
      state = Object.assign({}, state, nextState)
    }
  }

  const getState = () => state

  const subscribe = (listener) => { // 暂时不管
    listeners.add(listener)
    return () => listeners.delete(listener) // 取消订阅
  }

  const getInitialState = () => state // 获取最初始的状态，这里这样写不够严谨，这样写只是为了和zustand的api保持一致

  const store = {
    setState,
    getState,
    subscribe,
    getInitialState,
  }

  state = createState(setState, getState, store)

  return store
}

const useStore = (api, selector) => { // 感知到仓库在哪个组件中被使用
  const [, forceRender] = useState(0)
  useEffect(() => {  // 订阅仓库的变化，仓库变化了就让组件重新渲染
    api.subscribe((state, prevState) => {
      const newObj = selector(state)
      const oldObj = selector(prevState)
      if (newObj !== oldObj) {
        forceRender(Math.random())
      }
    })
  }, [])
  return api.getState()
}

const create = (createState) => {
  const api = createStore(createState)
  const useBoundStore = (selector) => useStore(api, selector) // selector是一个函数，告诉仓库我需要哪个状态
  Object.assign(useBoundStore, api) // useBoundStore不仅是一个函数体，身上还拥有一系列方法
  return useBoundStore
}

export default create