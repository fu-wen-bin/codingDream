import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom' // 用于创建html结构
import { getComponentById, useComponentsStore } from '../../stores/components'

/**
 * 悬停遮罩组件的属性接口
 */

interface HoverMaskProps {
  containerClassName: string // 容器元素的类名，用于计算相对位置
  componentId: number, // 当前悬停的组件ID
  portalWrapperClassName: string // Portal容器的类名
}

/**
 * 悬停遮罩组件 - 在鼠标悬停时显示蓝色边框和组件标签
 * 使用Portal技术将遮罩渲染到指定容器中，避免被其他元素遮挡
 */
export default function HoverMask ({
                                     containerClassName,
                                     componentId,
                                     portalWrapperClassName,
                                   }: HoverMaskProps) {
  // 从组件状态管理中获取组件树数据
  const { components } = useComponentsStore()

  // 遮罩位置信息状态
  const [position, setPosition] = useState({
    top: 0, // 遮罩顶部位置
    left: 0, // 遮罩左侧位置
    width: 0, // 遮罩宽度
    height: 0, // 遮罩高度
    labelTop: 0, // 标签顶部位置
    labelLeft: 0, // 标签左侧位置
  })

  // 当组件ID变化时更新遮罩位置
  useEffect(() => {
    updatePosition()
  }, [componentId])

  /**
   * 更新遮罩位置
   * 计算目标组件相对于容器的位置，并设置遮罩和标签的位置
   */
  function updatePosition () {
    if (!componentId) return

    // 获取容器元素
    const container = document.querySelector(`.${containerClassName}`)
    if (!container) return

    // 获取目标组件元素
    const node = document.querySelector(`[data-component-id="${componentId}"]`)
    if (!node) return

    // 获取目标组件的边界矩形信息
    const { top, left, width, height } = node.getBoundingClientRect()
    // 获取容器的边界矩形信息
    const {
      top: containerTop,
      left: containerLeft,
    } = container.getBoundingClientRect()

    // 计算相对于容器的位置，考虑滚动偏移
    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop: top - containerTop + container.scrollTop, // 标签位置与遮罩顶部对齐
      labelLeft: left - containerLeft + width, // 标签位置在组件右侧
    })
  }

  /**
   * 获取Portal容器元素
   * 使用useMemo缓存容器元素，避免重复查询DOM
   */
  const el = useMemo(() => {
    // 注释掉的代码是动态创建容器的方式，现在使用预定义的容器
    // const el = document.createElement('div')
    // el.className = 'wrapper'
    // const container = document.querySelector(`.${containerClassName}`)
    // container!.appendChild(el)
    // return el
    return document.querySelector(`.${portalWrapperClassName}`) // 获取Portal容器元素
  }, [portalWrapperClassName]) // 添加依赖项

  /**
   * 获取当前悬停的组件信息
   * 使用useMemo缓存组件信息，避免重复查找
   */
  const curComponent = useMemo(() => {
    return getComponentById(componentId, components)
  }, [componentId, components]) // 添加components依赖项

  // 如果没有找到Portal容器，则返回null
  if (!el) return null

  // 使用Portal将遮罩渲染到指定容器中
  return createPortal((
    <>
      {/* 悬停遮罩主体 - 蓝色半透明背景和虚线边框 */}
      <div style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        backgroundColor: 'rgba(0, 0, 255, 0.1)', // 蓝色半透明背景
        border: '1px dashed blue', // 蓝色虚线边框
        borderRadius: 4,
        boxSizing: 'border-box',
        pointerEvents: 'none', // 不阻止鼠标事件，允许事件穿透
        zIndex: 12, // 确保遮罩在组件上方
      }}></div>

      {/* 组件名称标签 */}
      <div
        style={{
          position: 'absolute',
          top: position.labelTop,
          left: position.labelLeft,
          fontSize: 14,
          zIndex: 13, // 标签层级高于遮罩
          display: (!position.width || position.width < 10)
            ? 'none' // 组件太小时隐藏标签
            : 'inline-block',
          transform: 'translate(-100%, -100%)', // 标签定位在组件右上角
        }}
      >
        <div
          style={{
            padding: '0px 8px',
            backgroundColor: 'blue', // 蓝色背景
            color: '#fff', // 白色文字
            borderRadius: 4,
            cursor: 'pointer',
            whiteSpace: 'nowrap', // 防止文字换行
          }}
        >
          {curComponent?.desc}
        </div>
      </div>
    </>
  ), el)
}
