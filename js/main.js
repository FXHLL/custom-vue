import { Observer, handleProxy } from './Observer.js'
import Watcher from './Watcher.js'
export default class Vue {
  constructor(options) {
    this.$options = options
    // 注册data:  代理实例访问，设置监听器
    this.initData(options.data)
    // 注册computed:  代理实例访问，设置watcher
    this.initComputed(options.computed)
    // 注册watcher:   设置watcher
    this.initWatch(options.watch)
  }
  initData(obj) {
    Object.keys(obj).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return obj[key]
        },
        set(newVal) {
          obj[key] = newVal
        }
      })
    })
    new Observer(obj)
  }
  initComputed(obj) {
    Object.keys(obj).forEach(key => {
      const watcher = new Watcher(this, obj[key], () => { }, { lazy: true })
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          if (watcher.dirty) {
            console.log('computed求值')
            watcher.get()
            watcher.dirty = false
          }
          // watch监听computed时，注册依赖中注册依赖
          // watch注册依赖时会访问computed,
          // 因此computed先注册了对应依赖项
          // 此时再次检测全局watcher容器去重新把watch也执行注册依赖操作
          if (window.target) {
            watcher.depList.forEach(item => {
              item.depend()
            })
          }
          return watcher.value
        },
        set() {
          console.warn('no no no set')
        }
      })
    })
  }
  initWatch(obj) {
    Object.keys(obj).forEach(key => {
      new Watcher(this, key, obj[key])
    })
  }
  $watch(key, callback) {
    new Watcher(this, key, callback)
  }
  $set(obj, key, value) {
    handleProxy(obj, key, value)
    obj.__ob__.dep.notify()
  }
}