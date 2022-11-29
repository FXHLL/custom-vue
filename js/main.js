import {Observer,handleProxy} from './Observer.js'
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
      const watcher = new Watcher(this, obj[key], ()=>{}, {lazy:true})
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          if(watcher.dirty) {
            console.log('computed求值')
            watcher.get()
            watcher.dirty = false
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
  $set(obj,key,value) {
    handleProxy(obj,key,value)
    obj.__ob__.dep.notify()
  }
}