# 低代码平台

- 物料区
- 画布区

1. 将物料区的组件拖拽到画布区即可，其实就是维护一个json对象。 用户执行拖拽，我们将组件对象添加到json对象的某一层中，画布区根据json对象渲染组件。

2. 在右侧编辑某组件的属性，其实就是修改json对象中该组件的属性。

3. 将json展示成树状图

## Tailwind CSS

- 原子化CSS，只需要写类名，不需要写样式

安装：
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