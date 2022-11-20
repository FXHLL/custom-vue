/**
 * Dep类用于收集watcher,并可以执行
 */
export default class Dep {
    // 依赖列表
    constructor () {
        this.depList = new Set([])
    }
    // 存入 当前线程 执行的依赖
    depend () {
        if(window.target) {
            this.depList.add(window.target)
        }
    }
    // 执行缓存依赖
    notify (newVal,oldVal) {
        this.depList.forEach(item => {
            item.run(newVal,oldVal)
      })
    }
}