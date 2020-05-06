function defineReactive(data, key, val) {
  observe(val) // 递归遍历所有子属性
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 是否需要添加订阅者
      if (Dep.target) {
        dep.addSub(Dep.target) // watcher订阅者
      }
      return val
    },
    set(newVal) {
      val = newVal
      dep.notify()
      console.log(`属性${key}已经劫持，修改后的值为${newVal}`)
    }
  })
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(key => {
    defineReactive(data, key, data[key])
  })
  return data
}

// let runCodeObj = {
//     name: 'mini vue'
// };
// observe(runCodeObj);
// runCodeObj.name = 'mini vue by myself';

function Dep() {
  this.subs = []
}
Dep.prototype = {
  addSub: function(sub) {
    this.subs.push(sub)
  },
  notify: function() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

Dep.target = null
