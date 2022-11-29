/**
 * Dep类用于收集watcher,并可以执行
 */
export default class Dep {
    // 依赖列表
    constructor () {
        this.depList = new Set([])
    }
    // 通知watcher存入当前依赖
    depend () {
        if(window.target) {
            // this.depList.add(window.target)
            this.
        }
    }
    addDep (target) {
      this.depList.add(target)
    }
    // 执行缓存依赖
    notify () {
        this.depList.forEach(item => {
            item.update()
      })
    }
}