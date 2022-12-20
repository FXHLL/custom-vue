// 代码生成器 ast 转化为 代码字符串


export function generate(ast) {
  const code = genElement(ast)
  return {
    render: `with(this){return ${code}}`
  }
}

// 元素节点的转化
function genElement(el) {
  const children = genChildren(el)
  const data = el.plain ? undefined : genData(el)
  return `_c(${JSON.stringify(el.tag)},${data}, ${children})`
}

// 文本节点的转化
function genText(node) {
  // 变量文本
  if (node.type === 2) {
    return `_v(${node.expression})`
  }
  // 注释
  if (node.type === 3 && node.isComment) {
    return `_e(${JSON.stringify(node.text)})`
    // 静态
  } else {
    return `-v(${JSON.stringify(node.text)})`
  }
}

// 节点属性处理
function genData(el) {
  let data = '{'
  el.attrsList.forEach((item, i) => {
    const isEnd = i === el.attrsList.length - 1
    data += item[1] + ':' + JSON.stringify(item[3]) + isEnd ? '' : ','
  })
  data = '}'
  return data
}

// 后代节点处理
function genChildren(el) {
  const children = el.children
  if (children.length) {
    return `[${children.map(c => genNode(c)).join(',')}]`
  }
}

// 节点类型处理
function genNode(node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}