class vNode {
  constructor(type, tag, attrs, children, text, isComment) {
    // 1元素节点 2文本节点 3注释节点
    this.type = type
    this.tag = tag
    this.attrs = attrs
    this.children = children
    this.text = text
    this.isComment = !!isComment
  }
}

// ast - vNode
// 元素节点
function _c(tag, attrs, children) {
  return new vNode(1, tag, attrs, children)
}
// 文本节点
function _v(val) {
  if (val === undefined || val === null) return
  if (typeof val === 'object') {
    return new vNode(2, null, null, null, val)
  } else {
    return new vNode(2, null, null, null, String(val))
  }
}
// 注释节点
function _e(val) {
  return new vNode(3, null, null, null, val, true)
}

//对比新旧vNode
function patch(oldnode, newnode) {
  // 旧节点为真实元素，首次渲染使用vnode直接渲染
  console.log('触发')
  if (!!oldnode.nodeType) {
    const dom = createElement(newnode)
    let parent = oldnode.parentNode
    parent.replaceChild(dom, oldnode)
    return
  }
  // 新旧vNode更新策略：
  const dom = createElement(newnode)
  let parent = oldnode.el.parentNode
  parent.replaceChild(dom,oldnode.el)
  return
  // 旧的dom
  // const dom = oldnode.el
  // // 对比差异
  // function loop(oldnode, newnode) {
  //   for (let i = 0; i < newnode; i++) {
  //     for (let j = 0; j < oldnode; j++) {
  //       const oldN = oldnode[i]
  //       const newN = newnode[j]
  //       // oldN 和 newN 是同一个节点
  //       if (oldN.type === newN.type) {

  //       }
  //       // 不同节点
  //       else {

  //       }
  //     }
  //   }
  //   loop(oldnode.children, newnode.children)
  // }

}
// vNode 转换 真实dom
function createElement(vnode) {
  // 文本类
  if (!vnode.tag) {
    let el
    // debugger
    if (!vnode.isComment) {
      el = document.createTextNode(vnode.text)
    } else {
      el = document.createComment(vnode.text)
    }
    return el
  }
  // 元素
  const el = document.createElement(vnode.tag)
  const attrs = vnode.attrs
  if (attrs) {
    for (let key in attrs) {
      switch (key) {
        case 'style':
          const styleList = attrs[key].split(';')
          styleList.forEach(item => {
            const k = item.split(':')[0]
            const v = item.split(':')[1]
            el.style[k] = v
          })
          break;
        case 'id':
          el.id = attrs[key]
        case 'class':
          el.class = attrs[key]
      }
    }
  }
  // 将渲染的dom挂到vnode上
  vnode.el = el
  if (vnode.children) {
    vnode.children.map(createElement).forEach(childDom => {
      el.appendChild(childDom)
    })
  }
  return el
}

export {
  _c,
  _v,
  _e,
  patch
}