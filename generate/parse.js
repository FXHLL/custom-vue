/* 
  parse:解析template,生成ast语法树
*/
function vnode(tag,data,children ) {
  return {
    tag,
    data,
    children
  }
}

export function parseHTML(html) {
  let reg = {
    startTag: new RegExp(/^<([a-zA-Z_][\w\-]*)\s*>/),
    endTag: new RegExp(/^<\/([a-zA-Z_][\w\-]*)\s*>/),
    singleTag: new RegExp(/^<([a-zA-Z_][\w\-]*)\s*\/\s*>/),
  }
  // 开始标签进栈，结束标签出栈，这样就确认了嵌套关系
  let stack = []
  // 指针
  let i = 0
  // 指针移动方法
  function addavte(n) {
    i += n
    html = html.slice(n)
    console.log('-----html变化了', html)
  }
  // 对文本内容的处理
  function handle(data) {
    console.log('xxxxg内容处理', data)
  }
  console.log('-----初始html', html)
  // 开始解析
  while (html.length) {
    if (reg.startTag.test(html)) {
      const res = html.match(reg.startTag)
      console.log('++++开始标签', res)
      addavte(res[0].length)
      stack.push(res[2])
    }
    else if (reg.endTag.test(html)) {
      const res = html.match(reg.endTag)
      console.log('++++结束标签', res)
      stack.pop()
      addavte(res[0].length)
    }
    else if (reg.singleTag.test(html)) {
      const res = html.match(reg.singleTag)
      console.log('++++单标签', res)
    }
    else {
      const res = html.indexOf('<')
      if (res !== -1) {
        const content = html.slice(0, res)
        console.log('++++文本内容', res)
        handle(content)
        addavte(res)
      }else {
        handle(html)
        addavte(html.length)
      }


    }
  }


}
