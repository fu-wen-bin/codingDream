import React from 'react'
// import { useEffect } from 'react'
import { type Component, useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'

export default function EditArea () {
  const {
    components,
    // addComponent,
    // deleteComponent,
    // updateComponent,
  } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  /*useEffect(() => {
    addComponent({
      id: 2,
      name: 'Container',
      props: {},
      desc: '页面容器',
    }, 1)

    addComponent({
      id: 3,
      name: 'Button',
      props: { text: '提交' },
      desc: '按钮',
      children: [],
    }, 2)
  }, [])*/

  function renderComponents (components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      // 从json对象中读取组件名字 从而更好在映射表中寻找已注册了的组件样式
      const config = componentConfig?.[component.name]
      if (!config?.component) return null // 如果没有找到组件配置，则返回 null

      // 渲染组件
      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps, // 使用默认属性
          ...component.props, // 使用组件的属性
        },
        renderComponents(component.children || []), // 递归渲整个 json 树
      )
    })
  }

  return (
    <div className="h-[100%]">
      {renderComponents(components)}
      {/*<pre>
        {
          JSON.stringify(components, null, 2)
        }
      </pre>*/}

    </div>
  )
}