import Dep from './Dep.js'
/**
 * Observer给data进行了遍历，对data属性和嵌套对象的属性设置了监听
 * 对每个属性实例化了一个dep，记载需要收集的依赖
 * getter收集依赖 setter执行依赖
 * 
 * dep类通过了闭包存储
 */
class Observer {
  constructor(data) {
    // 给data新增__ob__属性，存储新建实例，设置相关描述符
    Object.defineProperty(data, '__ob__', { value: this })
    // 给当前对象或数组存一个dep实例
    this.dep = new Dep()
    // 判断监听对象还是数组
    if (Array.isArray(data)) {
      // 将handleType存在实例上，方便数组改变后继续监听子元素
      this.handleType = handleType
      // 对数组元素进行类型判断继续处理监听
      data.forEach(item => handleType(item))
      // 挂载拦截对象于原型
      data.__proto__ = proxyArray
    } else {
      // 为data每个key设置拦截器
      Object.keys(data).forEach(key => {
        // 监听
        handleProxy(data, key, data[key])
      })
    }

  }
}
const proxyArray = {}
const methods = ['push', 'splice', 'pop', 'shift', 'unshift', 'sort', 'reverse']
proxyArray.__proto__ = Array.prototype
methods.forEach(item => {
  proxyArray[item] = function (...args) {
    let res = Array.prototype[item].apply(this, args)
    this.forEach(item => this.__ob__.handleType(item))
    this.__ob__.dep.notify(this, this)
    return res
  }
})

function handleProxy(data, key, oldVal) {
  // 存一个dep闭包
  let dep = new Dep()
  /* 
    childOb是数组存的Observer实例
    流程是：
    data-key-getteer 收集依赖
    通过获取数组的Observer实例去增加 数组的依赖
    当数组变化时，数组拦截器可以通过此实例去访问依赖实例从而达成更新
  */
  const childOb = handleType(oldVal)
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 当前访问的是需要更新的依赖就存了
      if (childOb) {
        childOb.dep.depend()
      }
      dep.depend()
      return oldVal
    },
    set(newVal) {
      if (oldVal !== newVal) {
        oldVal = newVal
        // 新值是否需要 创建监听实例
        handleType(newVal)
        // 用新值执行缓存依赖
        dep.notify(newVal, oldVal)
      }
    }
  })
}

function handleType(data) {
  let type = Object.prototype.toString.call(data)
  if (data.__ob__) {
    return
  }
  if (['[object Object]', '[object Array]'].includes(type)) {
    return new Observer(data)
  }
}

export { Observer, handleProxy }