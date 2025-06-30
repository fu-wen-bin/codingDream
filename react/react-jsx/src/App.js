// jsx --将html写在js中
import './App.css'
import List from './components/List'

// function App () {
//   const name = 'FWB'
//   const songs = [
//     { id: 1, name: '爱我的时候' },
//     { id: 2, name: '永不失联的爱' },
//     { id: 3, name: '我管不住我自己' },
//     { id: 4, name: '珠玉' },
//     { id: 5, name: '一个人跳舞' },
//   ]
//   const flag = true
//   const styleObj = {
//     color: 'green',
//   }
//   return (
//     <div className="App">
//       <h1>你好 {name}！</h1>
//       <ul>
//         {/*
//           songs.map(item => {
//             return <li key={item.id}>{item.id + 1}.{item.name}</li>
//           })
//         */}
//       </ul>
//       {/* <h3>{flag ? 'react真有意思' : 'react真难'}</h3>
//       <div>{flag ? <span>react真好玩</span> : null}</div> */}
//       {/*<div style={{ color: 'red' }}>FWB很帅</div>*/}
//       {/*<div style={styleObj}>杰哥不服</div>*/}
//       {/*<div className="person">颜杨皓樾狗叫</div>*/}
//
//       <div className={flag ? 'title' : ''}>颜杨皓越说要开大奔</div>
//
//     </div>
//   )
// }

function App () {  // 根组件/父组件
  const songs = [
    { id: 1, name: '爱我的时候' },
    { id: 2, name: '永不失联的爱' },
    { id: 3, name: '我管不住我自己' },
    { id: 4, name: '珠玉' },
    { id: 5, name: '一个人跳舞' },
  ]

  return (
    <div>
      <h1>hello react</h1>
      <List data={songs}></List> {/* 子组件 */}
    </div>
  )
}

export default App
