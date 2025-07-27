import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useComponentsStore } from '../../stores/components';

// 1. Tree 组件展示
// 2. json 在仓库中
export default function Outline() {
  const { components, setCurComponentId } = useComponentsStore((state) => state)

  return (
    <Tree
      fieldNames={{title: 'desc', key: 'id'}}
      treeData={components as any}
      defaultExpandAll
      showLine
      switcherIcon={<DownOutlined />}
      onSelect={([selectedKey]) => {
        setCurComponentId(selectedKey as number)
      }}
    />
  )
}
