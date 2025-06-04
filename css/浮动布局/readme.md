# 文档流

- 元素在页面中的默认布局方式，分为块级元素、行内块元素和行内元素。
- 块级元素：如`<div>`、`<p>`等，占据一整行，可以设置宽高
- 行内元素：如`<span>`、`<a>`、`::before`、`:after`等，占据内容宽度，不占据整行，不可设置宽高
- 行内块元素：如`<img>`、`<button>`等，不占据整行，但仍可设置宽高

# 浮动布局

1. 浮动存在的意义
    - 使元素脱离文档流，允许其他元素环绕。
        - 元素高度不算在父元素内，父容器高度变为零导致和后续元素重叠
    - 常用于图片、广告等需要环绕文本的场景。
2. 清除浮动
    - 使用`overflow: hidden;`或`clearfix`类来清除浮动，确保父元素包含浮动子元素的高度。
        - `clearfix`方法：
          ```css
          .clearfix::after {
              content: "";
              display: block;
              clear: both;
          }
          ```
        - 在`overflow: hidden;` 方法：(**非常推荐**)
          ```css
          .clearfix {
              overflow: hidden;
          }
          ```
        - 使用`clear: both;`在浮动的元素上。
          ```css
          .clear {
              clear: both;
          }
          ```
    - 使用`BFC`容器清除浮动

# 水平布局

1. `display:inline-block` 导致间隙问题
    - 行内块元素之间会有空格，解决方法：
        - 删除`HTML`中的空格
        - 设置父元素的`font-size`为`0`，然后子元素恢复`font-size`
        - 使用负边距调整
2. 样式权重计算方法
    - 计算元素的样式时，浏览器会根据选择器的特异性（权重）来决定使用哪个样式。
    - 特异性计算规则：
        - 内联样式 (`style="..."`) ：1000
        - ID选择器 (`#id`) ：100
        - 类选择器、属性选择器和伪类选择器 (`.class`) ：10
        - 元素选择器和伪元素选择器 (`div, p`) ：1
        - 通配符选择器(`*`)：0

> 简便计算：(内联，ID，类，元素) = (0, 0, 0, 0)
>
> 有n个则将0变为n，其他不变。同一级相同再往下比

# BFC -- Block Formatting Context

- 块级格式化上下文，独立的渲染区域。
- `HTML`出现`BFC`的原因：
    1. 默认情况下，子容器的`margin-top`会和父容器的`margin-bottom`重叠，形成`margin`塌陷。
    2. `BFC`可以阻止这种塌陷，确保子容器的`margin`不会影响父容器。

- `BFC`的触发条件：
    1. `overflow: hidden || auto || scroll || overlay`
    2. `position: absolute || fixed`
    3. `display: inline-xxx || flex || grid`
    4. `float: left || right`

- `BFC`容器的特征:
    1. 当一个容器成为`BFC`容器后，它会形成一个独立的渲染区域
    2. 子容器的`margin`不会影响到父容器
    3. `BFC`容器内的元素不会与外部元素发生`margin`塌陷
    4. `BFC`容器在计算高度的时候，包含浮动子元素的高度