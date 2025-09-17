import create from './myZustand.js'

const useListStore = create((set) => ({
  data: ['html', 'css'],
  addData: (item) => {
    set((state) => ({ // set能驱使用到了data的那个组件重新渲染
      data: [...state.data, item],
    }))
  },
}))

export default useListStore