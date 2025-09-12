# 低代码平台

- 物料区
- 画布区

1. 将物料区的组件拖拽到画布区即可，其实就是维护一个json对象。 用户执行拖拽，我们将组件对象添加到json对象的某一层中，画布区根据json对象渲染组件。

2. 在右侧编辑某组件的属性，其实就是修改json对象中该组件的属性。

3. 将json展示成树状图

## Tailwind CSS

- 原子化CSS，只需要写类名，不需要写样式

### 安装：

```bash
npm install tailwindcss postcss autoprefixer
```

- 配置文件：

```bash
# 生成 tailwind.config.js 和 postcss.config.js 配置文件，post配置文件用于帮助兼容css
npx tailwindcss init -p 
```

## 准备

### allotment 拖拽依赖

```bash
# 安装可以拖动容器的依赖
npm install allotment --save
```

### zustand 仓库

```bash
npm install zustand --save
```

# 项目梳理

1. 创建了`componentsStore`仓库
    - 存放整个`json`对象(`components`数组)。
    - 定义了往该`json`对象中**添加**、**移除**和**更新**子对象(组件)内部属性的函数

2. 创建了`componentsConfigStore`仓库
    - 存放`json`组件树中**每一类组件的配置文件**(`componentsConfig`对象)，与`componentsStore`仓库中的`components`形成映射关系
    - 定义了注册组件的函数

3. 定义了 `renderComponents`函数用来将整个`json`渲染成真实的HTML结构
    - 借助了`React.createElement`函数来实现递归渲染

4. 实现物料区的组件拖拽到画布区


1. 安装需要的依赖：
    - react-dnd 库 --> 用于跨组件传递数据
    - react-dnd-html5-backend 库 --> 用于实现拖拽功能

       ```bash
       # 安装拖拽相关依赖
       npm install react-dnd react-dnd-html5-backend --save
       ```

    - 将一个组件拖拽到画布区时，触发`onDrop`事件，将该组件添加到`json`树中进行渲染
        - 借助 react-dnd 的 `useDrop` 钩子函数来实现接收组件

2. 抽离useDrop代码，封装成一个hook

3. 中间画布展示好组件后，我们封装了一个HoverMask组件
    - 实现了用户鼠标移入哪一个组件上，该组件被选中的效果
    - 接收一个组件类名，通过js获取到该组件容器的集合属性，动态地将mask容器也设置成相同的大小并覆盖在组件容器上

4. 点击展示组件的编辑框，并可以移除组件 -- 和hover不同，点击需要在右侧展示对对应组件的属性编辑框
    - `selectedMask`：当用户点击画布中的某个组件时，我们实现跟hoverMask一样的蒙版效果，并提供删除按钮
    - 点击后的蒙版和鼠标悬浮的蒙版会产生重叠，需要做一个取舍

5. 点击画布区组件，实现右侧`setting`区展示属性编辑框
    - 往每一个组件对象中间增加了一个`setter[ ]`属性数组，存放该组件所有可以编辑的属性
    - 往每一个组件对象配置文件中间增加了一个`stylesSetter[ ]`属性数组，用于存放用户自定义的样式。
    - 用户自定义的样式被`style-to-object`转换成了一个对象，植入到了仓库的`json`树中渲染