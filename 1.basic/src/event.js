import {updateQueue} from './Component';
/**
 * 绑定事件
 * 在React不是直接绑定的,而是采用了一种合成事件的方式来处理的
 * 是一个事件委托 
 * @param {*} dom button 要绑定的事件的真实DOM元素
 * @param {*} eventType onclick 绑定事件的类型
 * @param {*} listener  事件回调函数 handleClick
 */
export function addEvent(dom,eventType,listener){
    //在DOM元素会保存一个对象
    let store = dom.store = {};
    //button.store.onclick=listener
    store[eventType]=listener;
    // document.addEventListener('on',事件处理函数,是否冒泡阶段捕获);
    //事件委托,不管给哪个DOM绑定事件,都会绑定到document上
    document.addEventListener(eventType.slice(2),dispatchEvent,false);
}
/**
 * 1.为了实现合成事件 
 *    1. 为了性能 ,快速 回收event地象
 *    2. 为了兼容性 屏蔽浏览器差异
 *    3. 为了实现批量更新
 * @param {*} event 
 */
//合成事件对象
let syntheticEvent ={};
function dispatchEvent(event){//event是原来的事件对象
    let {target,type } = event;//target button 的dom元素  type就是 click
    let eventType = 'on'+type;// onclick
    let listener = target.store && target.store[eventType];//listener handleClick
    if(listener){//handleClick
        //让合成事件的原生事件指向真实的事件对象
        syntheticEvent.nativeEvent = event;
        for(let key in event){
            syntheticEvent[key]=event[key];
        }
        //表示进入批量更新模式 不会直接更新
        updateQueue.isBatchingUpdate = true;
        listener(syntheticEvent);//handleClick已经执行结束了
        //退出批量更新模式,进入直接同步更新模 式
        //updateQueue.isBatchingUpdate =false;
        updateQueue.batchUpdate();//在事件执行后进行批量更新
        for(let key in syntheticEvent){
            syntheticEvent[key]=null;
        }
    }
}