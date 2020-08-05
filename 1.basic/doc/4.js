import React from './react';
import ReactDOM from './react-dom';
/**
 * ref 引用的意思
 * Refs提供了一种允许我们访问DOM元素的方式
 * ref值 是一个字符串 此方式已经废弃
 * ref值 是一个函数 此方法已经废弃
 * ref值 是一个对象,对象 一个current属性指向真实的DOM元素
 * 
 */
class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.a = React.createRef();//{current:null}
    this.b = React.createRef();//{current:null}
    this.result = React.createRef();
  }
  add = (event)=>{
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = a+b;
  }
  render(){
    let e = <h1 ref={this.a}></h1>;
    console.log(e);
      return (
        <div>
          <input ref={this.a}/>+<input ref={this.b}/><button onClick={this.add}>=</button>
          <input ref={this.result}/>
        </div>
      )
  }
}
ReactDOM.render(<Calculator/>,document.getElementById('root'));