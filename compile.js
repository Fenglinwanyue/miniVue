function Compile(el, vm) {
  this.vm = vm
  this.el = document.querySelector(el)
  this.fragment = null
  this.init()
}

Compile.prototype = {
  init: function() {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.log('Dom元素不存在')
    }
  },
  nodeToFragment: function(el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child) // appendChild 方法具有可移动性 将el中的节点移动到了fragment当中可以在循环后打印一下node.firstChild,会发现是Null
      child = el.firstChild
    }
    return fragment
  },

  compileElement: function(el) {
    let childNodes = el.childNodes
    let self = this
    // Array.prototype -> []
    Array.prototype.slice.call(childNodes).forEach(node => {
      let reg = /\{\{\s*(.*)\s*\}\}/ // .是任意字符 可以匹配任何单个字符， *意味着能够匹配任意数度量的任何字符。
      // .*具有贪婪的性质，首先匹配到不能匹配为止，根据后面的正则表达式，会进行回溯。.*？则相反，一个匹配以后，就往下进行，所以不会进行回溯，具有最问小匹配的性质。 \s代表正则表达式中的一个空白字符（可能是空格、制表符、其他空白）。
      let text = node.textContent // textContent 属性设置或者返回指定节点的文本内容。
      // 元素节点
      if (self.isElementNode(node)) {
        self.compile(node)
        // 文本节点
      } else if (self.isTextNode(node) && reg.test(text)) {
        /**
         * 如果 exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。此数组的第 0 个元素是与正则表达式相匹配的文本，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推。除了数组元素和 length 属性之外，exec() 方法还返回两个属性。index 属性声明的是匹配文本的第一个字符的位置。input 属性则存放的是被检索的字符串 string。我们可以看得出，在调用非全局的 RegExp 对象的 exec() 方法时，返回的数组与调用方法 String.match() 返回的数组是相同的。
         */
        self.compileText(node, reg.exec(text)[1]) // reg.exec(text)[1]提取exp
      }
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node) // 继续递归遍历子节点
      }
    })
  },

  compileText: function(node, exp) {
    let self = this
    let initText = this.vm[exp]
    this.updateText(node, initText) // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function(value) {
      // 生成订阅器并绑定更新函数
      self.updateText(node, value)
    })
  },

  updateText: function(node, val) {
    node.textContent = typeof val == 'undefined' ? '' : val
  },
  /**
       * nodeType 属性返回以数字值返回指定节点的节点类型。
      如果节点是元素节点，则 nodeType 属性将返回 1。
      如果节点是属性节点，则 nodeType 属性将返回 2。
      代表元素或属性中的文本内容，则 nodeType 属性将返回 3。
      */
  isTextNode: function(node) {
    return node.nodeType == 3
  },
  isElementNode: function(node) {
    return node.nodeType == 1
  },
  // 添加一个数据指令：和事件指令@的解析编译
  compile: function(node) {
    let attrs = node.attributes
    let self = this
    Array.prototype.forEach.call(attrs, attr => {
      let attrName = attr.name
      // 判断是否为指令
      if (self.isDirective(attrName)) {
        let exp = attr.value
        // let directiveName = attrName.substring(1) // 获取指令名称
        // let directiveName = attrName
        // 判断是否为事件指令
        if (self.isEventDirective(attrName)) {
          self.compileEvent(node, self.vm, exp, attrName)
        } else {
          // 数据指令
          self.compileModel(node, self.vm, exp, attrName)
        }
      }
    })
  },
  isDirective: function(attr) {
    return attr.indexOf(':') == 0 || attr.indexOf('@') == 0
  },
  isEventDirective: function(directiveName) {
    return directiveName.indexOf('@') == 0
  },
  compileEvent: function(node, vm, exp, dirName) {
    let eventType = dirName.substring(1)
    // 判断methods中是否有此方法
    let cb = vm.methods && vm.methods[exp]
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false)
    }
  },
  compileModel: function(node, vm, exp, dirName) {
    let val = vm[exp]
    let self = this
    // 初始化模版
    this.modelUpdate(val)
    // 添加订阅 this.vm 不能直接使用vm 会导致vm嵌套
    new Watcher(this.vm, exp, function(value) {
      // 生成订阅器并绑定更新函数
      self.modelUpdate(node, value, val)
    })
    // 单独处理input类型的数据绑定更新，省略@事件绑定
    node.addEventListener(
      'input',
      function(e) {
        let newVal = e.target.value
        if (val === newVal) {
          return
        }
        self.vm[exp] = newVal
        val = newVal
      },
      false
    )
  },
  modelUpdate: function(node, val, oldVal) {
    node.value = typeof val == 'undefined' ? '' : val
  }
}
