import React from './react';
import ReactDOM from './react-dom';

class ChildCount extends React.Component {
  componentWillReceiveProps() {
    console.log("ChildCount -> componentWillReceiveProps -> componentWillReceiveProps")
  }
  // shouldComponentUpdate(){return false}
  componentWillUnmount() {
    console.log("ChildCount -> componentWillUnmount -> componentWillUnmount")

  }
  render() {
    return (
      <div>
        <span>子组件的count: {this.props.count}</span>
      </div>
    )
  }
}
class ScrollList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  handleAdd = () => {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    // let arr = !!(this.state.count % 2) ? [1] : [2, 2]
    // let arrNode = arr.map(item => <span>{item}</span>)
    console.log('是否展示', !(this.state.count % 2))
    return (
      <div className={"aa" + this.state.count}>
        <p>1111</p>
        <button onClick={this.handleAdd}>点我{this.state.count}</button>
      {!!(this.state.count % 2) ? <p>count为奇数啦</p> : <span>我是span</span>}
        <ChildCount count={this.state.count} />
        <p>1111</p>
        <p>1111</p>
        {!!(this.state.count % 2) ? 123 : <span>我是span2222222</span>}

      </div>
    )
  }
}
ReactDOM.render(<ScrollList />, document.getElementById('root'));