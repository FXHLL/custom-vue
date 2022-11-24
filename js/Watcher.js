/*
 * @Author: Fangxh 1745955087@qq.com
 * @Date: 2022-11-14 10:06:34
 * @LastEditors: Fangxh 1745955087@qq.com
 * @LastEditTime: 2022-11-24 16:45:57
 * @FilePath: \youyu\custom-vue\js\Watcher.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 对于每个data-key都有一个依赖dep
 * getter 收集watcher入dep   setter 执行dep中所有watcher
 * 对于watcher都有一个独立的id，防止一轮微任务重复watcher执行
 * 奇思妙想：
 * Watcher实例render函数中使用了data.a,data.b
 * 则使用时render存入了data.a的dep和data.b的dep
 * 当data.a和data.b同时set了，则两个dep同时执行render
 * 也就是render-watcher.run执行了
 * 此时还是同步，首先data.a的dep执行了render-watcher.run,
 * render-watcher-id入队列，设置微任务
 * 然后data.b的dep执行了render-watcher.run，
 * render-watcher-id入不了队列，因为已经存在
 * 同步结束了，微任务执行，render更新了
 */

let watcherId = 0
let watcherQueue = new Set([])
let count = 0
export default class Watcher {
  constructor(vm, key, config) {
    this.vm = vm
    this.key = key
    // 判断配置项存于watcher实例上
    if (typeof config === 'function') {
      this.callback = config
    }
    if (Object.prototype.toString.call(config) === '[object Object]') {
      this.callback = config.handler
      this.deep = config.deep
      this.immediate = config.immediate
    }
    this.id = watcherId++
    this.emitGetter()
  }
  emitGetter() {
    // 通过保存在class静态属性上实现了Dep的捕获当前watcher
    window.target = this
    /**
     * deep的实现：
     * emitGetter 通过访问key值使得key对应的dep收集了依赖
     * 指定deep:true 且key为对象或数组时
     * 对象：我们应该遍历对象key访问，使其dep收集依赖
     * 数组：我们需要遍历数组，如果数组元素为普通值则跳过，如果为对象则遍历子属性使其dep收集依赖
     * 
     * 发现这样虽然触发了watcher但是newVal,oldVal是修改子元素的，并非想要的大元素 ？？？
     */
    const data = this.vm[this.key]
    // 将旧值缓存在watcher上
    this.oldVal = data
    if (this.deep) {
      const isA = function(data) {
        return Object.prototype.toString.call(data) === '[object Array]'
      }
      const isO = function(data) {
        return Object.prototype.toString.call(data) === '[object Object]'
      }
      const loopObj = function (data) {
        for (let key in data) {
          if (isO(data[key])) {
            loopObj(data[key])
          }
        }
      }
      const loopArr = function (data) {
        data.forEach(item => {
          if(isA(item)) {
            loopArr(item)
          }
          if(isO(item)) {
            loopObj(item)
          }
        })
      }
      if(isO(data)) {
        loopObj(data)
      }
      if(isA(data)) {
        loopArr(data)
      }
    }


    window.target = null
  }
  run() {
    watcherQueue.add(this.id)
    Promise.resolve().then(res => {
      this.callback.call(this.vm, this.vm[this.key], this.oldVal)
      // 值更新了在回调执行后更新旧值
      this.oldVal = this.vm[this.key]
      watcherQueue.delete(this.id)
    })

  }
}