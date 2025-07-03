import './App6.css';
import { Input, Space, Table, Popconfirm } from 'antd';
const { Search } = Input;


function App6() {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      dataIndex: 'do',
      key: 'do',
      render: () => (
        <Space size="middle">
          <Popconfirm title="确认删除？" onConfirm={onDelete}>
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const dataSource = []


  function onDelete() {

  }


  return (
    <div className="container">
      <div className="search-box">
        <Search
          placeholder='请输入关键词'
          enterButton="搜索"
          size="large"
          allowClear
        />
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </div>
  )
}

export default App6;