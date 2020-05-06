/**
 *
 * @param {*} data
 * @param {*} el
 * @param {*} exp
 *  'miniVue.data.name = 'data 修改引起 view变化',而我们理想的形式是：miniVue.name = 'data 修改引起 view变化'，'为了实现这样的形式，我们需要在new MiniVue的时候做一个代理处理，让访问miniVue的属性代理为访问miniVue.data的属性，实现原理还是使用Object.defineProperty( )对属性值再包一层
 */
// function MiniVue(data, el, exp) {
//   let self = this
//   this.data = data
//   Object.keys(data).forEach(key => {
//     // 绑定代理属性
//     self.proxyKeys(key)
//   })
//   observe(data)
//   el.innerHTML = this.data[exp] // 初始化模版数据
//   new Watcher(this, exp, val => {
//     el.innerHTML = val
//   })
//   return this
// }
// 添加compile之后
function MiniVue(options) {
  let self = this
  this.vm = this
  this.data = options.data
  this.methods = options.methods || {}
  Object.keys(this.data).forEach(key => {
    // 绑定代理属性
    self.proxyKeys(key)
  })
  this.data && observe(this.data)
  this.methods && observe(this.methods)
  new Compile(options.el, this.vm)
  //   el.innerHTML = this.data[exp] // 初始化模版数据
  //   new Watcher(this, exp, val => {
  //     el.innerHTML = val
  //   })
  return this
}
MiniVue.prototype = {
  proxyKeys: function(key) {
    let self = this
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get() {
        return self.data[key]
      },
      set(newVal) {
        self.data[key] = newVal
      }
    })
  }
}
