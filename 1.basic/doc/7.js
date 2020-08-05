import React from 'react';
import ReactDOM from 'react-dom';
class ScrollList extends React.Component {
    constructor() {
        super();
        this.wrapper = React.createRef();
        this.state = { messages: [] }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                messages: [`${this.state.messages.length}`, ...this.state.messages]
            });
        }, 1000);
    }
    //这个方法是什么时候触发的呢?是在重新渲染之前触发的,可以获取到老的DOM的状态
    getSnapshotBeforeUpdate() {
        return {
            prevScrollTop: this.wrapper.current.scrollTop,//老的向上卷去的高度
            prevScrollHeight: this.wrapper.current.scrollHeight,//老的内容的高度
        }
    }
    componentDidUpdate(prevProps, prevState, { prevScrollTop, prevScrollHeight }) {
        let wrapper = this.wrapper.current;
        wrapper.scrollTop = prevScrollTop + (wrapper.scrollHeight - prevScrollHeight);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        let styleObj = {
            height: '100px',
            width: '200px',
            border: '1px solid red',
            overflow: 'auto'
        }
        return (
            <div style={styleObj} ref={this.wrapper}>
                {
                    this.state.messages.map((message, index) => (
                        <div key={index}>{message}</div>
                    ))
                }
            </div>
        )
    }
}
ReactDOM.render(<ScrollList />, document.getElementById('root'));