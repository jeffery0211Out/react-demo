import React from 'react';
import ReactDOM from 'react-dom';
class Counter extends React.Component{
   static defaultProps = { //初始化默认属性对象
     name:'珠峰架构'
   }
   constructor(props){
     super(props);
     this.state = {number:0};//初始化状态状态对象
     console.log('Counter 1.初始化状态状态对象 constructor');
   }
   componentWillMount(){
    console.log('Counter 2.组件将要挂载 componentWillMount');
   }
   handleClick = (event)=>{
    this.setState({number:this.state.number+1});
   }
   shouldComponentUpdate(nextProps,nextState){
    console.log('Counter 5.询问用户组件是否需要更新 shouldComponentUpdate');
    //return nextState.number%2===0;//如果是偶数则更新,如果是奇数则不更新
    return true;
   }
   componentWillUpdate(){
    console.log('Counter 6.组件将要更新 componentWillUpdate');
   }
   componentDidUpdate(){
    console.log('Counter 7.组件将更新完成 componentDidUpdate');
   }
   componentDidMount(){
    console.log('Counter 4.组件挂载完成 componentDidMount');
   }
   render(){
    console.log('Counter 3.render 通过调用render方法获得虚拟DOM');
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
        {
          this.state.number>3?null:<ChildCounter count={this.state.number}/>
        }
      </div>
    )
   }
}
class ChildCounter extends React.Component{
  constructor(props){
    super(props);
    this.state = {number:0,name:'zhufeng'};
  }
  componentWillMount(){
    console.log('ChildCounter 1.组件将要挂载 componentWillMount');
  }
  componentDidMount(){
    console.log('ChildCounter 3.组件挂载完成 componentDidMount');
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('ChildCounter 4.组件是否要更新 shouldComponentUpdate');
    //模3为0才更新,不为0更新 0 3 6 9
    //return nextProps.count%3===0;
    return true;
  }
  componentWillUpdate(){
    console.log('ChildCounter 5.组件将要更新 componentWillUpdate');
   }
   componentDidUpdate(){
    console.log('ChildCounter 6.组件将更新完成 componentDidUpdate');
   }
  componentWillReceiveProps(newProps){
    //以前很多人在这里通过props修改状态  会在这里调用setState()它很可以会引起死循环
    console.log('ChildCounter 7.组件接收到新的属性 componentWillReceiveProps');
  }
  componentWillUnmount(){
    console.log('ChildCounter 8.组件将要卸载 componentWillUnmount');
  }
  //根据新的属性对象得到新的状态对象,它是一个静态方法,只能通过类来调用,不能通过实例来调用
  static getDerivedStateFromProps(nextProps,prevState){
    const {count} = nextProps;//先从新的属性对象中获取 新的count值 
    //如果返回了一个对象,那好么就把这个对象当成状态对象.如果返回一个null,则保留原状态
    if(count===1){
      return {number:count*2};
    }else if(count ===2){//如果是个奇数就是3倍
      return {number:count*3};
    }else{
      return null;
    }
  }
  render(){
    console.log('ChildCounter 2.render');
  return (<div>{this.state.name}:{this.state.number}</div>
)
  }

}
ReactDOM.render(<Counter/>,document.getElementById('root'));