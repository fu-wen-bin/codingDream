# create-react-app

- 由webpack封装得到
- webpack将整个项目的所有依赖文件进行读取，解析。打包成浏览器可以识别的静态资源文件

# webpack

1. webpack 只能打包`js`文件
2. 遇到高版本的js代码，webpack无法直接打包，需要使用babel进行转换
    - @babel/core -- 核心模块
    - @babel/preset-env -- 提供babel配置文件，转换高版本js代码
    - babel-loader -- webpack的加载器