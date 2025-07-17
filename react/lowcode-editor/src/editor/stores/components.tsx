import { create } from 'zustand'

export interface Component {
  id: number; // 组件唯一标识符
  name: string; // 组件名称
  props: any; // 组件属性
  desc?: string; // 组件描述
  children?: Component[]; // 子组件列表
  parentId?: number; // 父组件唯一标识符
}

export interface State {
  components: Component[]; // 组件列表
}

export interface Action {
  addComponent: (component: any, parentId?: number) => void; // 添加组件方法
  deleteComponent: (componentId: number) => void; // 删除组件方法
  updateComponent: (componentId: number, props: any) => void; // 更新组件属性
}

// State 代表整个仓库实例
export const useComponentsStore = create<State & Action>(
  (set, get) => ({
    // 数据
    components: [ // 初始化组件列表为空数组
      {
        id: 1,
        name: 'Page',
        props: {},
        desc: '页面',
      },
    ],

    // 方法
    addComponent: (component, parentId) => {
      // 本质上是要将一个对象添加到另一个对象中
      set(state => {  // 更改仓库需不需要视图更新，需要则用set
        if (parentId) {
          // 获取到父级对象
          const parentComponent = getComponentById(parentId, state.components)
          if (parentComponent) {
            parentComponent.children // 判断是的否有children属性
              ? parentComponent.children.push(component)  // 如果有，则将新组件添加到子组件列表中
              : parentComponent.children = [component] // 如果没有，则创建一个新的子组件列表
          }
          component.parentId = parentId // 设置新组件的父组件 ID
          return { components: [...state.components] } // 返回新的组件列表
        }

        // 如果没有父组件，则直接添加到组件列表中
        return { components: [...state.components, component] }
      })
    },

    deleteComponent: (componentId) => {
      // 整个 json 对象中找到某一个子对象 id 为 componentId, 删除该对象
      if (!componentId) return // 如果组件 ID 为空，直接返回
      const component = getComponentById(componentId, get().components)
      if (component?.parentId) {
        const parentComponent = getComponentById(component.parentId,
          get().components)
        if (parentComponent) {
          parentComponent.children = parentComponent.children?.filter(
            child => child.id !== componentId,
          ) // 从父组件的子组件列表中删除该组件
        }
        set({
          components: [...get().components],
        })
      }
    },

    updateComponent: (componentId, props) => {
      set((state) => {
        const component = getComponentById(componentId, state.components)
        if (component) {
          component.props = { ...component.props, ...props }
          return {
            components: [...state.components],
          }
        }
        return { components: [...state.components] }
      })
    },
  }),
)

export function getComponentById (id: number | null,
                                  components: Component[]): Component | null {
  if (!id) return null // 如果 id 为空，返回 null
  for (const component of components) {
    if (component.id === id) {
      return component // 找到匹配的组件，返回
    }
    if (component.children && component.children.length > 0) {
      // 如果有子组件，递归查找
      const childComponent = getComponentById(id, component.children)
      if (childComponent) return childComponent // 如果在子组件中找到，返回
    }
  }
  return null // 如果没有找到，返回 null
}