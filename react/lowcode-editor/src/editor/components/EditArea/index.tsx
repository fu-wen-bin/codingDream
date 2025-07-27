import React, { useState } from 'react'
import type { Component } from '../../stores/components'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import HoverMask from '../HoverMask'
import SelectedMask from '../SelectedMask'

/**
 * 编辑区域组件 - 低代码编辑器的核心编辑区域
 * 负责渲染组件树、处理鼠标悬停交互、显示悬停遮罩
 */
export default function EditArea () {
  // 从组件状态管理中获取组件树数据
  const { components, setCurComponentId, curComponentId } = useComponentsStore()
  // 从组件配置管理中获取组件配置信息
  const { componentConfig } = useComponentConfigStore()
  // 当前鼠标悬停的组件ID状态
  const [hoverComponentId, setHoverComponentId] = useState<number>()

  /**
   * 递归渲染组件树
   * @param components 组件数组
   * @returns React节点
   */
  function renderComponents (components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      // 根据组件名称获取对应的组件配置
      const config = componentConfig?.[component.name]
      if (!config?.dev) { // 没有对应的组件，比如：'Page'
        return null
      }
      // 使用React.createElement动态创建组件实例
      // 确保添加data-component-id属性用于悬停检测
      return React.createElement(
        config.dev,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          'data-component-id': component.id, // 确保组件有这个属性，用于悬停检测
          ...config.defaultProps, // 合并默认属性
          ...component.props, // 合并组件自定义属性
          styles: component.styles, // 合并组件样式
        },
        renderComponents(component.children || []),  // 递归渲染子组件树
      )
    })
  }

  /**
   * 处理鼠标移动事件
   * 通过事件冒泡路径检测鼠标下方的组件，实现悬停效果
   */
  const handleMouseMove: React.MouseEventHandler = (e) => {
    // 获取事件冒泡路径，从最内层元素到最外层元素
    const path = e.nativeEvent.composedPath()
    let foundId = undefined

    // 遍历事件路径，查找第一个带有data-component-id属性的元素
    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement
      if (ele.dataset && ele.dataset.componentId) {
        foundId = +ele.dataset.componentId // 转换为数字类型
        break
      }
    }

    // 只有当悬停组件ID发生变化时才更新状态，避免不必要的重渲染
    if (foundId !== hoverComponentId) {
      setHoverComponentId(foundId)
    }
  }

  const handleClick: React.MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath()
    for (let i = 0; i < path.length; i++) {
      const ele = path[i] as HTMLElement
      const componentId = ele.dataset?.componentId
      if (componentId) {
        setCurComponentId(+componentId) // 设置当前组件ID
        return // 找到后退出循环
      }
    }
  }

  return (
    <div className="h-[100%] edit-area"
         onMouseMove={handleMouseMove} // 监听鼠标移动事件
         onMouseLeave={() => setHoverComponentId(undefined)} // 鼠标离开时清除悬停状态
         onClick={handleClick} // 点击时清除悬停状态
    >
      {/* 渲染组件树 */}
      {renderComponents(components)}

      {/* 当有悬停组件且不是所点击的组件时显示悬停遮罩 */}
      {hoverComponentId && hoverComponentId !== curComponentId && (
        <HoverMask
          componentId={hoverComponentId}
          containerClassName="edit-area"
          portalWrapperClassName="portal-wrapper"
        />
      )}
      {curComponentId && (
        <SelectedMask
          componentId={curComponentId}
          containerClassName="edit-area"
          portalWrapperClassName="portal-wrapper"
        />
      )}
      {/* Portal容器，用于渲染悬停遮罩 */}
      <div className="portal-wrapper"></div>
    </div>
  )
}
