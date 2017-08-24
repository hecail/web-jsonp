# web-jsonp
web get和post请求，支持跨域请求（跨域实现是用 Script的src模拟请求的）
 options 说明{
  async:true（异步）或 false（同步）
  method:请求的类型；GET 或 POST
 url:文件在服务器上的位置
  dataType:请求类型 支持jsonp
  jsonp：jsonp方式请求成功后返回的包含字段
  timeout：请求超时时间
  data：请求参数
  error：请求返回错误
  success：请求返回成功
  }
