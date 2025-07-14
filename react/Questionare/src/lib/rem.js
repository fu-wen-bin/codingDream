// 根据屏幕尺寸设置html根字体大小
(function (win, doc) {
  // 获取用户屏幕宽度
  const screenWidth = win.screen.width || 375 // 默认宽度为375px
  // 设置根字体大小
  doc.documentElement.style.fontSize = (screenWidth / 375) * 20 + 'px' // 375px对应16px字体大小

  // 监听窗口大小变化
  win.addEventListener('resize', function () {
    const newScreenWidth = win.innerWidth || 375 // 获取当前窗口宽度
    doc.documentElement.style.fontSize = (newScreenWidth / 375) * 20 + 'px' // 更新根字体大小
  })
})(window, document)