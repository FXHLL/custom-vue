import Dep from './Dep.js'
/**
 * Observer给data进行了遍历，对data属性和嵌套对象的属性设置了监听
 * 对每个属性实例化了一个dep，记载需要收集的依赖
 * getter收集依赖 setter执行依赖
 * 
 * dep类通过了闭包存储
 */
export default class Observer {
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
        get(){
          // 当前访问的是需要更新的依赖就存了
            this.__ob__.dep.depend()
        },
        set(newVal){
          console.log(newVal)
          if(oldVal !== newVal) {
            // 新值是否需要 创建监听实例
            handleType(newVal)
            // 用新值执行缓存依赖
            this.__ob__.dep.notify(newVal)
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
