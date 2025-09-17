import { create } from 'zustand'

function loMiddleware(func){
  return function (set, get, store) {
    function newSet (...args) {
      console.log('调用了set，新的state：', get())
      return set(...args)
    }
    return func(newSet, get, store)
  }
}

const useListStore = create((set) => ({
  data: ['html', 'css', 'js'],
  addData: (item) => {
    set((state) => ({ // set能驱使用到了data的那个组件重新渲染
      data: [...state.data, item],
    }))
  },
}))

export default useListStore