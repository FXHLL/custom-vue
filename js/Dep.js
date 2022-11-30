/**
 * Dep类用于收集watcher,并可以执行
 */
export default class Dep {
    // 依赖列表
    constructor () {
        this.watcherList = new Set([])
    }
    /**
     * 1.data-getter触发调用对应dep.depend()收集
     * 2.dep.depend()通知当前注册的watcher.addDep去收集dep
     * 3.watcher.addDep收集完成后再去通知dep.addWatcher收集watcher
     * 
     * 至此依赖收集完成，dep与watcher完成了双向收集
     */
    depend () {
      if(window.target) {
          window.target.addDep(this)
      }
    }
    addWatcher (target) {
      this.watcherList.add(target)
    }
    // 执行缓存依赖
    notify () {
        this.watcherList.forEach(item => {
            item.update()
      })
    }
}