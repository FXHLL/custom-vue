// 初始化
function main (obj) {
    // 对监听数据设置数据拦截
    Object.keys(obj).forEach(key => {
        let oldVal = obj[key]
        let dep = new Dep()
        Object.defineProperties(obj,key,{
            // 加依赖
            get() {
                dep.depend()
                return oldVal
            },
            // 执行依赖
            set(newVal) {
                let bool = oldVal !== newVal
                oldVal = newVal
                if(bool) {
                    dep.notify()
                }
            }
        })
    })
    return obj
}

// 被观察者
// 需要实现对vNode的data的监听,创建观察者实例后，存入data.__ob__
// 类的主要构成： 1.维护观察者 2.数据监听 3.依赖收集
// class main {
//     constructor (obj) {
//         // 对监听数据设置数据拦截
//         Object.keys(obj).forEach(key => {
//             let oldVal = obj[key]
//             let dep = new Dep()
//             Object.defineProperties(obj,key,{
//                 // 加依赖
//                 get() {
//                     dep.depend()
//                     return oldVal
//                 },
//                 // 执行依赖
//                 set(newVal) {
//                     let bool = oldVal !== newVal
//                     oldVal = newVal
//                     if(bool) {
//                         dep.notify()
//                     }
//                 }
//             })
//         })
        
//     }
// }