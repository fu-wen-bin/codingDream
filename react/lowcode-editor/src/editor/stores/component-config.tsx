import { create } from 'zustand'
import Container from '../materials/Container'
import Button from '../materials/Button'
import Page from '../materials/Page'

export interface ComponentSetter {
  name: string;
  label: string;
  type: string; // 组件类型
  [key: string]: any; // 其他属性
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>;
  component: any
  desc: string; // 组件描述
  setter?: ComponentSetter[]; // 组件属性设置器
}

export interface State {
  componentConfig: { [key: string]: ComponentConfig }
}

export interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

// 每个名字对应的组件具体是哪一个
export const useComponentConfigStore = create<State & Action>(
  set => ({
    componentConfig: {
      Container: {
        name: 'Container',
        defaultProps: {},
        desc: '容器',
        component: Container,
      },
      Button: {
        name: 'Button',
        desc: '按钮',
        defaultProps: {
          type: 'primary',
          text: '按钮',
        },
        component: Button,
        setter: [
          {
            name:'type',
            label: '类型',
            type: 'select',
            options:[
              { label: '主要', value: 'primary' },
              { label: '次要', value: 'secondary' }
            ]
          }
        ],
      },
      Page: {
        name: 'Page',
        desc: '页面',
        defaultProps: {},
        component: Page,
      },
    },

    registerComponent: (name, componentConfig) => {
      set((state) => {
        return {
          ...state,
          componentConfig: {
            ...state.componentConfig, // 保留现有的组件配置
            [name]: componentConfig, // 添加或更新新的组件配置
          },
        }
      })
    },
  }),
)