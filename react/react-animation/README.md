# 动画

## 过度动画

1. transition: 过渡动画
    - 控制容器的某个属性值，发生变更时施加一个过渡时间
    - 例如：`transition: all 0.3s ease-in-out;` 表示所有属性在0.3秒内平滑过渡。

## 复杂动画

1. @keyframes: 定义关键帧动画
    - 通过定义一系列关键帧，控制动画在不同时间点的样式。
    - 例如：
      ```css
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      ```
    - 使用时通过 `animation` 属性应用：
      ```css
      .fade-in {
        animation: fadeIn 2s ease-in;
      }
      ```

2. 项目开发中一些特别复杂的交互动画
    - css动画库 -> animate.css
    - @react-spring/web -> 基于物理学实现的弹簧动画效果