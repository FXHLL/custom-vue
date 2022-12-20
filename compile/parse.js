// Template 转换 AST

/* 
element:
{
  type: 1 元素节点 2 变量文本节点 3 静态文本节点，
  tag: 标签，
  plain: 是否属性为空，
  attrsList: 属性，
  parent: 父节点，
  children: 子节点
}
*/

export function parse(html) {
  // 根节点，模板取outerHTML故只有一个根节点
  let root
  // 此时的父元素
  let currentParent
  // 层级栈
  let stack = []

  // 模板处理钩子
  const options = {
    // 开始标签
    start(tag, attrs, unary) {
      const obj = currentParent
        ? Object.assign({}, currentParent)
        : undefined
      if (obj) {
        obj.children = '$$'
      }

      let element = {
        type: 1,
        tag,
        attrsList: attrs,
        plain: !attrs.length,
        parent: obj,
        children: []
      }
      if (!root) {
        root = element
      } else {
        currentParent.children.push(element)
      }
      // 非自闭和
      if (!unary) {
        stack.push(element)
        currentParent = element
      }
    },
    // 结束标签
    end() {
      stack.pop()
      currentParent = stack[stack.length - 1]
    },
    // 文本
    chars(text) {
      text = text.trim()
      const expression = parseText(text)
      let element = expression
        ? {
          type: 2,
          expression,
          text
        }
        : {
          type: 3,
          text
        }

      currentParent.children.push(element)
    },
    // 注释
    comment(text) {
      let element = { type: 3, text, isComment: true }
      currentParent.children.push(element)
    }
  }
  parseHTML(html, options)
  return root
}

const regular = {
  // 开始标签开始
  startTagOpen: /^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/,
  // 属性
  attribute: /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+])))/,
  // 开始标签结束
  startTagClose: /^\s*(\/?)>/,
  // 结束标签
  endTag: /^<\/((?:[a-zA-Z_][\w\-\.]*\:])?[a-zA-Z_][\w\-\.]*)[^>]>/,
  // 注释
  annotation: /^<!--/
}

// 模板处理流程
function parseHTML(html, options) {
  while (html) {
    let textEnd = html.indexOf('<')
    // 标签类
    if (textEnd === 0) {
      // 开始标签
      if (regular.startTagOpen.test(html)) {
        // debugger
        const start = html.match(regular.startTagOpen)
        if (start) {
          // 标签名
          const match = {
            tagName: start[1],
            attrs: []
          }
          html = html.slice(start[0].length)
          console.log('干掉了开始', start[0])
          let end, attr
          // 属性
          while (!(end = html.match(regular.startTagClose)) && (attr = html.match(regular.attribute))) {
            // if(match.tagName === 'input') debugger
            html = html.slice(attr[0].length)
            console.log('干掉了属性', attr[0])
            match.attrs.push(attr)
          }
          // 结尾
          if (end) {
            // if(match.tagName === 'input') debugger
            // H5中outerHTML获取自闭和标签会获取不到斜杠
            // match.unarySlash = end[1]
            let arr = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
            match.unarySlash = arr.includes(match.tagName)
            html = html.slice(end[0].length)
            console.log('干掉了结尾', end[0])
          }
          const { tagName, attrs, unarySlash } = match
          options.start(tagName, attrs, unarySlash)
          continue
        }

      }
      // 结束标签
      if (regular.endTag.test(html)) {
        const end = html.match(regular.endTag)
        if (end) {
          html = html.slice(end[0].length)
          console.log('干掉了结束标签', end[0])
          options.end(end[1])
          continue
        }
      }
      // 注释
      if (regular.annotation.test(html)) {
        const commentEnd = html.indexOf('-->')
        if (commentEnd >= 0) {
          options.comment(html.slice(4, commentEnd))
          html = html.slice(commentEnd + 3)
          console.log('干掉了注释', html.slice(0, commentEnd + 3))
          continue
        }
      }

    }
    // 文本类
    let text
    if (textEnd > 0) {
      text = html.slice(0, textEnd)
      html = html.slice(textEnd)
      // if(text === '{{key1}}') debugger
      console.log('干掉了文本', text)
    }
    if (textEnd < 0) {
      text = html
      html = ''
      console.log('干掉了全部文本')
    }
    options.chars(text)
    continue
  }
}

// 文本的处理
function parseText(text) {
  const reg = /{{((?:.|\n)+?)}}/g
  if (!reg.test(text)) return

  const tokens = []
  let lastIndex = reg.lastIndex = 0
  let match, index
  while (match = reg.exec(text)) {
    index = match.index
    // 普通字符
    if (index > lastIndex) {
      tokens.push(text.slice(lastIndex, index))
    }
    // {{}}
    tokens.push(`_s(${match[1].trim()})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex))
  }
  return tokens.join('+')
}







