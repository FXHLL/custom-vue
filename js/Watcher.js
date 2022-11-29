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

// 维护一个队列，对应异步队列，防止异步任务重复执行
let watcherId = 0
let watcherQueue = new Set([])
// 维护一个栈，记录watcher
let targetStack = []

// 数据处理，对数组或者对象进行遍历处理
const isA = function (data) {
  return Object.prototype.toString.call(data) === '[object Array]'
}
const isO = function (data) {
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
    if (isA(item)) {
      loopArr(item)
    }
    if (isO(item)) {
      loopObj(item)
    }
  })
}

export default class Watcher {
  constructor(vm, express, config, tag = { lazy: false }) {
    this.vm = vm
    this.express = express
    this.lazy = this.dirty = tag.lazy
    this.id = watcherId++
    this.depList = []
    switch (Object.prototype.toString.call(config)) {
      case '[object Function]':
        this.callback = config
        break
      case '[object Object]':
        this.callback = config.handler
        this.deep = config.deep
        this.immediate = config.immediate
        break
    }
    if (!this.lazy) {
      this.get()
    }
    if (config.immediate) this.run()
  }
  addDep(dep) {
    if (this.depList.indexOf(dep) === -1) {
      this.depList.push(dep)
      dep.addDep(this)
    }
  }
  update() {
    // lazy被dep通知执行时，只会标记成脏值
    if (this.lazy) {
      this.dirty = true
    } else {
      this.run()
    }
  }
  get() {
    targetStack.push(this)
    window.target = this
    // computed / watch 通过使用data中的值达成对应dep收集
    if (typeof this.express === 'function') {
      this.value = this.express.call(this.vm) // 更新值
    } else {
      this.value = this.vm[this.express] // 记录旧值
      if (this.deep) {
        if (isO(this.value)) loopObj(this.value) // 对象：访问key，使其dep收集依赖
        if (isA(this.value)) loopArr(this.value) // 数组：搜索所有层级的对象，访问key使其dep收集依赖
      }
    }
    targetStack.pop()
    window.target = targetStack.length
      ? targetStack[targetStack.length - 1]
      : null
  }
  run() {
    watcherQueue.add(this.id)
    Promise.resolve().then(res => {
      const oldValue = this.value
      this.value = this.vm[this.express]
      this.callback.call(this.vm, this.vm[this.express], oldValue)
      watcherQueue.delete(this.id)
    })

  }
}