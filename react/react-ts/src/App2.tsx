import React from 'react'

interface PersonProps {
  name: string;
  content?: React.ReactNode  // jsx类型
}

function Person (props: PersonProps) {  // 接受父组件传递的参数
  // console.log(props);
  return (
    <div>
      <h3>你好我是 {props.name}</h3>
      {props.content}
    </div>
  )
}

// 另一种定义函数组件写法
const Animal: React.FunctionComponent<PersonProps> = (props) => {
  return (
    <div>
      <h2>我是动物 {props.name}</h2>
    </div>
  )
}

function App2 () {
  return (
    <div>
      <h2>hello TS</h2>
      <Person name={'康总'} content={  // 父向子传值
        <button>提交</button>
      }/>

      <Animal name={'旺财'}/>
    </div>
  )
}

export default App2