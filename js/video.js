// 鼠标在白色区域移动，控制彩色区域高度
// 监听鼠标是否在白色区域内

// 1. 获取元素
const speed = document.querySelector('.speed')
const speed_bar = document.querySelector('.speed-bar')
const video = document.querySelector('.flex')
// 2. 监听事件
speed.addEventListener('mousemove', (e) => {
  // 控制 bar 高度
  // 3. 鼠标位置
  // 鼠标坐标减去容器距离顶部距离 / 白色容器 == 彩色色块百分比
  let pre = (e.pageY - speed.offsetTop) / speed.offsetHeight
  // 展示百分比
  speed_bar.style.height = Math.round(pre * 100) + '%'

  // 数值控制
  const min = 0.5
  const max = 4

  let playbackRate = pre * (max - min) + min
  speed_bar.innerHTML = playbackRate.toFixed(2) + 'x'

  video.playbackRate = playbackRate
})