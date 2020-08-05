
class Component{
    static isReactComponent=true
    constructor(props){
        this.props = props;
    }
}
Component.prototype.isReactComponent = {};
export default Component;