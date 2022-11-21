/*
 * @Author: Fangxh 1745955087@qq.com
 * @Date: 2022-11-14 09:19:23
 * @LastEditors: Fangxh 1745955087@qq.com
 * @LastEditTime: 2022-11-21 13:36:38
 * @FilePath: \youyu\custom-vue\js\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {Observer,handleProxy} from './Observer.js'
import Watcher from './Watcher.js'
export default class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    // 代理this属性为data
    this.initData()
    // 对data设置监听
    new Observer(options.data)
    // 注册watcher
    this.initWatch(options.watch)
  }
  initData() {
    let oldData = this.$data
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return oldData[key]
        },
        set(newVal) {
          this.$data[key] = newVal
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
    obj.__ob__.dep.notify(obj,obj)
  }
}