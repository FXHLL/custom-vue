// 维护一个队列，对应异步队列，防止异步任务重复执行
let watcherId = 0
let watcherQueue = new Set([])
// 维护一个栈，记录watcher,解决了收集依赖过程中再次出现收集依赖的情况
// 当watch监听了计算属性
// (watch).get() ---> (computed).get() ---> 依赖数据x
// 使依赖数据x能收集到 两个watcher,故需要栈记录两个watcher
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
      dep.addWatcher(this)
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
    Promise.resolve().then(() => {
      const oldValue = this.value
      // this.value = this.vm[this.express]
      this.get()
      this.callback.call(this.vm, this.value, oldValue)
      watcherQueue.delete(this.id)
    })
  }
}