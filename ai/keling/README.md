# Kling AI

官方提供了一个AccessKey ID 和 AccessKey Secret，使用时需要将其设置为环境变量。

需要用jsonwebtoken插件进行加密处理后传给Kling进行通信

1. react项目先跟自己的后端请求到token
2. 再将token传给Kling进行通信