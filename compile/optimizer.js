// 优化器，优化ast对象
/* 
重新渲染时，通过静态标识可以不需要创建新节点
vNode打补丁时可以通过标识跳过
*/

export function optimizer(root) {
  if (!root) return
  markStatic(root)
  markStaticRoots(root)
}

//标记所有静态节点
function markStatic(node) {
  node.static = isStatic(node)
  if (node.type === 1) {
    for (let i = 0, len = node.children.length; i < len; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        // 如果父元素节点为静态
        // 子元素节点为动态
        // 则父元素节点变为动态
        node.static = false
      }
    }
  }
}
//标记所有静态根节点
function markStaticRoots(node) {
  if (node.type === 1) {
    // 静态根节点必须要有子节点
    // 子节点如果只有一个静态文本节点则因成本大于收益 所以不优化
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      for (let i = 0, len = node.children.length; i < len; i++) {
        markStaticRoots(node.children[i])
      }
    }
  }
}
function isStatic(node) {
  if (node.type === 2) {
    return false
  }
  if (node.type === 3) {
    return true
  }
  if (node.type === 1) {
    // 暂没支持元素节点 动态绑定 事件 指令。。
    return true
  }
}