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

# 路由传参

1. 使用`useNavigate`进行路由跳转时，可以通过不同方式传递参数。

   ```js
   navigate('/home?id=1')  // useSearchParams()// 获取路由参数
   
   // 使用示例

   // 获取当前路由信息
   const [searchParams] = useSearchParams()
   // 获取路由参数
   console.log(searchParams.get('category'))
   ```

2. 使用`useParams`获取路由参数。

   ```js
   navigate('/home/1')  // 配置路由时 path:'home/:id'   useParams() // 获取当前路由参数
    
   // 使用示例
   const params = useParams()
   return(
     <div>
       NoteList ---- {params.category}
     </div>
   )
   ```

3. 使用`state`传递参数，这种方式不会显示在地址栏中。

   ```js
   navigate('/home', { // 和第一种一样，但不会显示在地址栏
     state: {
       id: 1,
     },
   })  //useLocation() // 获取路由参数
   
   // 使用示例
   const { state } = useLocation()  // 从注册页传过来的参数
   console.log(state.category)  
   ```
