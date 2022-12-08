/* 
  parse:解析template,生成ast语法树
*/
export function parseHTML(html) {
  // 定义栈存标签，开始标签进栈，结束标签出栈
  let stack = []
  // 指针 指向值
  let pointer = 0
  // 指针移动
  function moveIndex(n) {
    pointer += n
    html = html.slice(n)
  }
  // 匹配正则
  let reg = {
    startTag: new RegExp(/^<([a-zA-Z_][\w\-]*)\s*>/),
    endTag: new RegExp(/^<\/([a-zA-Z_][\w\-]*)\s*>/),
    singleTag: new RegExp(/^<([a-zA-Z_][\w\-]*)\s*\/\s*>/),
  }

  while (html.length) {
    if (html.test(reg.startTag)) {
      // 开始标签
      html.match
    }
    else if (html.test(reg.endTag)) {
      // 结束标签
    }
    else if (html.test(reg.singleTag)) {
      // 自结束标签
    }
    else {
      // 文本

    }
  }
  if (!stack.length) {
    console.error('标签可能不规范')
  }


}
