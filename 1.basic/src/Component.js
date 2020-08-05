import {isFunction} from './utils';
import {createDOM,compare} from './react-dom';
//定义并导出一个变量中updateQueue
export let updateQueue = {
    updaters:[],//更新器的数组,默认是一个空数组
    //是否处于批量更新模式
    isBatchingUpdate: false,
    add(updater){
        if(!this.updaters.includes(updater)){
            this.updaters.push(updater);
        }
    },
    //先通过add方法添加updater,然后在合适的时候会调用这个批量更新方法,一次性全部更新updater
    batchUpdate(){
        this.isBatchingUpdate = true;
        //把数组中的updaters全部取出,进行批量或者说全量更新
        this.updaters.forEach(updater=>updater.updateComponent());
        this.updaters.length=0;
        this.isBatchingUpdate = false;//设置为非批量更新模式 
    }
}
class Updater{
    constructor(classInstance){
        this.classInstance = classInstance;
        this.pendingStates = [];//这是一个数组,用来缓存所有的状态
    }
    addState(partialState){
        //先把分状态或者更新函数放在数组里进行缓存
       this.pendingStates.push(partialState);
       this.emitUpdate();
       //判断当前是否处于批量更新模式(异步),如果是的话则先添加更新队列里去等待更新
       //否则说明处于非批量更新模式(同步),直接更新组件 
       //updateQueue.isBatchingUpdate?updateQueue.add(this):this.updateComponent()
    }
    //如果有了新的属性后,会触发这个方法,另外会把新的属性对象传过来
    emitUpdate(nextProps){
        this.nextProps = nextProps;
        let shouldComUpdate = shouldUpdate(this.classInstance,nextProps,this.getState())
        if(!shouldComUpdate)return
        if(this.classInstance.componentWillReceiveProps){
            //如果走到了这里,this指向是子组件实例中的updater
            this.classInstance.componentWillReceiveProps(nextProps);
        }
        //如果传了新的属性过来,或者当前不是处于批量更新模式
        if(this.nextProps || !updateQueue.isBatchingUpdate){
            this.updateComponent();
        }else{
            updateQueue.add(this)
        }
    }
    //让组件进行更新
    updateComponent(){
        let {classInstance,pendingStates,nextProps}= this;//updater里的类组件实例和数组中的状态
        //如果属性变化 了,或者 状态变化了
        if(nextProps||pendingStates.length>0){//如果有新状态,则需要列新,否则不更新
            //1.获取新的状态
            shouldUpdate(classInstance,nextProps,this.getState());
            //从pendingStates中得新的状态
            //classInstance.state = this.getState();
            //然后要重新渲染,进行更新
            //classInstance.forceUpdate();
        }
    }
    getState(){
        let {classInstance,pendingStates}= this;//updater里的类组件实例和数组中的状态
        let {state}= classInstance;// 组件实例中的老状态
        let nextState =  pendingStates.reduce((nextState,partialState)=>{
            if(isFunction(partialState)){//当partialState是一个函数的话
                nextState=partialState(nextState);
            }else{
                nextState={...nextState,...partialState};//如果对象的话直接覆盖
            }
            return nextState;
        },state);
        pendingStates.length=0;
        return nextState;
    }
}
function shouldUpdate(classInstance,nextProps,nextState){
    //不要管要不要重新刷新组件,其实内部的状态和属性已经是最新的了
    classInstance.props = nextProps||classInstance.props;
    classInstance.state = nextState||classInstance.state;
    //如果有shouldComponentUpdate方法,并且它的返回值是false
    if(classInstance.shouldComponentUpdate&&(!classInstance.shouldComponentUpdate(nextProps,nextState))){
        return;//shouldComponentUpdate默认值是true
    }
    //如果没有shouldComponentUpdate或者 它返回值为true的话,则要更新
    classInstance.forceUpdate();
}
class Component{
    static isReactComponent=true
    constructor(props){
        this.props = props;
        this.state = {};
        this.$updater = new Updater(this);
    }
    //只放更新状态
    setState(partialState){
        this.$updater.addState(partialState);
    }
    //让这个组件的状态改变后,重新render,得到新的虚拟DOM,然后从新的虚拟DOm得到新的真实DOM
    //然后用新的真实DOM替换老的真实DOM就可以实现更新了
    forceUpdate(){
        if(this.componentWillUpdate){
            this.componentWillUpdate();
        }
        //获取老的虚拟DOM
        let oldVdom = this.oldVdom;
        // oldVdom.instance = this
        console.log("Component -> forceUpdate -> oldVdom", oldVdom)
        //重新render
        let newVdom = this.render();
        //比较的时候还会比较元素本身和它的儿子们
        
        let newDOM = compare(oldVdom,newVdom);
        this.oldVdom = newVdom
        this.dom = this.oldVdom.dom = newDOM;
        
        if(this.componentDidUpdate){
            this.componentDidUpdate(this.props,this.state);
        }
    }
}
Component.prototype.isReactComponent = {};
export default Component;