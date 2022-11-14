# custom-vue
## 实现一个简易版本vue2,预计完成主要功能为:

1. 依赖收集
2. 响应式驱动
3. render
4. vuex
...

目前思路：
new Vue({
    el:'挂载元素',
    data:'data',
    render: h(a,b,c)
})
对data进行数据监听，依赖[computed,render...]收集
数据改变时，依赖[computed,render...]触发