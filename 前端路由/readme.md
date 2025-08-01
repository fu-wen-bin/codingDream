# 路由

用来描述服务器上资源的路径

# 前端路由

- 在单页面应用（SPA）中构建浏览器URL地址和组件之间的映射关系

1. 如何知道url更新 -- js中的`hashchange`事件和`location.hash`属性
2. 浏览器不能刷新

## Hash模式路由

> 在浏览器地址栏中，一旦出现井号（#），浏览器就会将它后面的内容当作哈希值并忽略
> 
> 由于被忽略，哈希值变更不会带来页面的刷新

原理：
- 通过监听`hashchange`事件来获取URL的变化
- 使用`location.hash`来获取当前的哈希值
- 根据获取到的哈希值来查找对应组件并进行渲染

## History模式路由

> HTML5新增的History API，允许我们在不刷新页面的情况下修改浏览器的URL地址

原理：
- 通过`pushState`和`replaceState`方法来修改浏览器的URL
- 获取URL变化可以通过监听`popstate`事件