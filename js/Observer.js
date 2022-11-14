import Dep from './Dep'
// 数据观察者：传入的data对象 => 被观察的对象
// {a:1} => {a:1[getter,setter],__ob__} ，__ob__保存监听实例
class Observer {
  constructor (data) {
    // 给data新增__ob__属性，存储新建实例，设置相关描述符
    Object.defineProperty(data,'__ob__',{ value:this })
    // 为data每个key设置拦截器
    Object.keys(data).forEach(key => {
      // 存一个旧值闭包
      let oldVal = data[key]
      // 如果为纯对象则在上面创建监听实例
      handleType(data[key])
      Object.defineProperty(data,key,{
        enumerable: true,
        configurable: true,
        writable: true,
        get(){
          // 当前访问的是需要更新的依赖就存了
            this.__ob__.dep.depend()
        },
        set(newVal){
          if(oldVal !== newVal) {
            // 新值是否需要 创建监听实例
            handleType(newVal)
            // 用新值执行缓存依赖
            this.__ob__.dep.notify()
          }
        }
      })
    })
    // 绑定依赖实例
    this.dep = new Dep()
    
  }
}

function handleType (data) {
  if(Object.prototype.toString.call(data) === '[object Object]') {
    new Observer(data)
  }
}
