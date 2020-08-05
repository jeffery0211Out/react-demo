import React from 'react';
import ReactDOM from 'react-dom';
/**
 * 事件 和ref
 *  dom onclick React onClick
 *  this 如何 绑定
 * 1.箭头函数 (推荐这一种) 1.不要忘 写,2 比较直观 3 不能每次生成新的函数,提高 性能
 * 2.bind(this)
 * 3.可以用匿名函数  
 */
class Link extends React.Component{
  /**
   * 
   * @param {*} event 合成事件对象 把所有的事件监听都合并在了一起 dispatchEvent
   * 1.为了提高 性能 2.为兼容不同的浏览器,让我们可以使用一个标准API来处理处理 
   */
  handleClick=(number,event)=>{
    console.log(number);
  }
  render(){
    return (
      <button  onClick={(event)=>this.handleClick(1,event)}>
        点我
      </button>
    )
  }
}
ReactDOM.render(<Link/>,document.getElementById('root'));