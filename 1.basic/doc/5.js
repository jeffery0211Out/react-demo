import React from './react';
import ReactDOM from './react-dom';
class Form extends React.Component{
  constructor(){
    super();
    this.classInput = React.createRef();//{current:null}
  }
  getFocus = (event)=>{
    this.classInput.current.getFocus();
  }
  render(){
    //TextInput类的实例创建出来之后赋给了this.classInput.current
    return (
      <div>
        <TextInput ref={this.classInput}/>
        <button onClick={this.getFocus}>获得焦点</button>
      </div>
    )
  }
}
class TextInput extends React.Component{
  constructor(){
    super();
    this.input = React.createRef();//{current:null}
  }
  getFocus(){
    this.input.current.focus();
  }
  render(){
    return (
      <input ref={this.input}/>
    )
  }
}
ReactDOM.render(<Form/>,document.getElementById('root'));