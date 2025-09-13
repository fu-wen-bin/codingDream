# http 状态码

## 2xx 成功状态码

- `200 OK`：请求成功，服务器已成功处理了请求。通常用于GET和POST请求
- `204 No Content`：请求成功，但没有返回内容。通常用于DELETE请求

## 3xx 重定向状态码

- `301 Moved Permanently`：请求的资源已被永久移动到新位置
- `302 Found`：请求的资源临时移动到新位置
- `303 See Other`：请求的资源临时移动到新位置，客户端应使用GET方法访问新位置
- `304 Not Modified`：资源未被修改，客户端可以使用缓存的版本（协商缓存命中）

## 4xx 客户端错误状态码

- `400 Bad Request`：服务器无法理解请求 -- 客户端语法错误
- `401 Unauthorized`：请求要求用户验证 -- 无权限
- `403 Forbidden`：禁止访问资源
- `404 Not Found`：请求的资源不存在（前端请求的路径有问题）

## 5xx 服务器错误状态码

- `500 Internal Server Error`：服务器内部错误，无法完成请求
- `501 Not Implemented`：服务器不支持请求的功能
- `503 Service Unavailable`：服务器不可用，服务器过载或维护
- `504 Gateway Timeout`：网关超时，服务器作为网关或代理时未及时从上游服务器收到响应