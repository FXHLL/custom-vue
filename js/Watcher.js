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
  constructor(vm, key, callback) {
    this.vm = vm
    this.key = key
    this.callback = callback
    this.id = watcherId++
    this.emitGetter()
  }
  emitGetter() {
    // 通过保存在class静态属性上实现了Dep的捕获当前watcher
    window.target = this
    this.vm[this.key]
    window.target = null
  }
  run(newVal,oldVal) {
    watcherQueue.add(this.id)
    Promise.resolve().then(res => {
      this.callback.call(this.vm, newVal,oldVal)
      watcherQueue.delete(this.id)
    })

  }
}