import { Form, Input, Select } from 'antd'
import { useComponentsStore } from '../../stores/components'
import type { ComponentSetter } from '../../stores/component-config'
import { useComponentConfigStore } from '../../stores/component-config'
import { useEffect } from 'react'

export default function ComponentAttr () {

  const [form] = Form.useForm()
  const {
    curComponentId,
    curComponent,
  } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  // 回显
  useEffect(() => {
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...curComponent?.props })
  }, [curComponent])

  if (!curComponent || !curComponentId) {
    return <div>暂无组件被选择，请选择组件</div>
  }

  const valueChange = (values: any) => {
    console.log(values)
  }

  function renderFormElement (setter: ComponentSetter) {
    const { type, options } = setter
    switch (type) {
      case 'input':
        return <Input/>
      case 'select':
        return (
          <Select options={options}/>
        )
      default:
        return <Input/>
    }
  }

  return (
    <Form form={form} onValuesChange={valueChange}
          labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      <Form.Item label="组件ID">
        <Input disabled value={curComponentId}/>
      </Form.Item>
      <Form.Item label="组件名称">
        <Input disabled value={curComponent.name}/>
      </Form.Item>
      <Form.Item label="组件描述">
        <Input disabled value={curComponent.desc}/>
      </Form.Item>
      {/*找到允许修改的属性渲染出来*/}
      {
        componentConfig[curComponent.name]?.setter?.map(setter => {
          const { name, label } = setter
          return (
            <Form.Item name={name} key={name} label={label}>
              {renderFormElement(setter)}
            </Form.Item>
          )
        })

      }
    </Form>
  )
}