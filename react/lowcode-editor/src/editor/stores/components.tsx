import { create } from 'zustand'

const useComponentsStore = create(
  set => ({
    // 数据
    mode: 'edit' as 'edit' | 'preview',
    // 方法
    setMode: (mode: 'edit' | 'preview') => set({ mode: mode }),
  }),
)

// 导出 store
export default useComponentsStore