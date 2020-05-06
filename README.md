# miniVue

Implementing a small framework

### 实现一个 view 和 data 双向绑定的小型框架

---

# 目标

完成监听器 Observer 、订阅器 Dep 、订阅者 Watcher 和解析器 Compile 的实现

# 过程

1.实现一个监听器 Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。

2.实现一个订阅者 Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。

3.实现一个解析器 Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。

## 1、数据变化更新视图：

1、数据进行劫持监听，所以我们需要设置一个监听器 Observer，用来监听所有属性。
2、属性发上变化了，就需要告诉订阅者 Watcher 看是否需要更新。
3、因为订阅者是有很多个，所以我们需要有一个消息订阅器 Dep 来专门收集这些订阅者，然后在监听器 Observer 和订阅者 Watcher 之间进行统一管理的。
4、需要有一个指令解析器 Compile，对每个节点元素进行扫描和解析，将相关指令对应初始化成一个订阅者 Watcher，并替换模板数据或者绑定相应的函数，此时当订阅者 Watcher 接收到相应属性的变化，就会执行对应的更新函数，从而更新视图。

## 2、实现 Compile

1.解析模板指令，并替换模板数据，初始化视图

2.将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器

## 方法解析

# Object.defineProperty()

Object.defineProperty(obj, prop, descriptor)这个方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

# 参数

# obj

要定义属性的对象。

# prop

要定义或修改的属性的名称或 Symbol 。

# descriptor

要定义或修改的属性描述符。
-> 对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。存取描述符是由 getter 函数和 setter 函数所描述的属性。一个描述符只能是这两者其中之一；不能同时是两者。

# 这两种描述符都是对象。它们共享以下可选键值

## configurable

当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
默认为 false。

## enumerable

当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
默认为 false。
数据描述符还具有以下可选键值：

## value

该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
默认为 undefined。

## writable

当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
默认为 false。
存取描述符还具有以下可选键值：

## get

属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的 this 并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
默认为 undefined。

## set

属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。
默认为 undefined。
描述符默认值汇总

## 拥有布尔值的键 configurable、enumerable 和 writable 的默认值都是 false。

## 属性值和函数的键 value、get 和 set 字段的默认值为 undefined。

### 描述符可拥有的键值

configurable enumerable value writable get set
数据描述符 可以 可以 可以 可以 不可以 不可以
存取描述符 可以 可以 不可以 不可以 可以 可以

# 返回值

被传递给函数的对象。

# 备注

这些选项不一定是自身属性，也要考虑继承来的属性。为了确认保留这些默认值，在设置之前，可能要冻结 Object.prototype，明确指定所有的选项，或者通过 Object.create(null) 将 **proto** 属性指向 null。

### eg：

// 使用 **proto**
var obj = {};
var descriptor = Object.create(null); // 没有继承的属性
// 默认没有 enumerable，没有 configurable，没有 writable
descriptor.value = 'static';
Object.defineProperty(obj, 'key', descriptor);

# 设计模式

发布-订阅模式

# 最后的话

写完这个鬼东西，生活开始变得有趣了起来，虽然 vue3 要出来了，oh，shit
