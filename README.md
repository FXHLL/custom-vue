<!--
 * @Author: Fangxh 1745955087@qq.com
 * @Date: 2022-11-14 09:19:23
 * @LastEditors: Fangxh 1745955087@qq.com
 * @LastEditTime: 2022-11-24 17:00:39
 * @FilePath: \youyu\custom-vue\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# custom-vue
## 实现一个简易版本vue2:

main.js     创建vue实例入口
Observer.js 为实例data的key进行监听，创建单独的dep实例，实现了自动依赖收集执行系统
Dep.js      依赖类，维护了观察key的依赖列表，提供了新增执行操作
Watcher.js  观察者类，每个需要根据被观察key更新所更新的函数都要创建一个实例，
            通过访问被观察key注册此依赖函数，通过dep通知且维护一个执行队列，创建微任务执行更新函数

目前实现：
    对传入数据进行监听，实现自动依赖收集，能拦截data内属性的get,set访问，数组的'push', 'splice', 'pop', 'shift', 'unshift', 'sort', 'reverse'方法
    watch方法的实现，支持deep,immediate