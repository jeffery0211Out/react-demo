## 1.大纲
1. jsx 
2. 组件和props
3. 实现虚拟DOM
4. 状态
5. 事件处理
6. 实现状态更新和事件
7. 生命周期

## 2.今日作业(普通作业)
- 自己写一个 babel插件,把jsx转换成js
转换前
```js
<h1 id="title"><span>hello</span>world</h1>
```
转换后
```js
React.createElement("h1", {
  id: "title"
},React.createElement("span", null, "hello"), "world");
```
悬赏10个学分
忽略 AST
## 3.今日作业(扩展作业)
- http://www.zhufengpeixun.com/2020/html/26.webpack-5-AST.html#t149.%20AST

不用babel,
自己实现这个分词和转换和遍历 

http://www.zhufengpeixun.com/2020/html/103.5.webpack-compiler.html

悬赏20个学分



1. 虚拟dom转换 HTML，使用的 是 广度优先还是 深度优先?
实现一个虚拟DOM ,把虚拟DOM转成HTML


2.老师讲下受控组件和非受控组件？
3.HOC呢 老师 会讲吗 会
4.函数组件用了ref是不是也不会销毁了


## 给大家留下作业
奖励5个学分
1. 实现dom-diff
要实现难在 dom节点的复用,以及移动处理
//大家实现的时候可以不用考虑这些.直接 一一一对比
2. 实现componentWillReceiveProps和componentWillUnmount()