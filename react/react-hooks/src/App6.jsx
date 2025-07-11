import { useEffect, useState } from 'react';
import './App6.css';
import { Input, Space, Table, Popconfirm } from 'antd';
const { Search } = Input;



function App() {
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id'
    },
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
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="确认删除？" onConfirm={() => onDelete(record.id)}>
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const [dataSource, setDataSource] = useState([])

  // 获取所有数据
  function getData() {
    fetch('http://localhost:3001/data')
      .then(res => res.json())
      .then(result => {
        // console.log(result);
        setDataSource(result)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  // 删除某一条数据
  function onDelete(id) {
    console.log(id);
    fetch(`http://localhost:3001/data/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result => {
        // console.log(result);
        if (result) {
          getData()
        }
      })
  }

  // 搜索
  function onSearch(value) {
    if (!value) {
      getData()
      return
    }

    fetch(`http://localhost:3001/data/?name=${value}`)
      .then(res => res.json())
      .then(result => {
        // console.log(result);
        setDataSource(result)
      })
  }


  return (
    <div className="container">
      <div className="search-box">
        <Search
          placeholder='请输入关键词'
          enterButton="搜索"
          size="large"
          allowClear
          onSearch={onSearch}
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

export default App;