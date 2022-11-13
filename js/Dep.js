// 依赖类 每个被监听的数据都有一个对应的依赖实例
// 数据被访问时，缓存访问函数作为依赖于依赖列表中
// 数据被改变时，依次调用缓存的依赖
class Dep {
    // 依赖列表
    constructor () {
        this.depList = new Set()
    }
    // 存入 当前线程 执行的依赖
    depend () {
        if(window.nowDep) {
            this.depList.add(window.nowDep)
        }
    }
    // 执行缓存依赖
    notify () {
        this.depList.forEach(item => item())
    }
}