
/**
 * 把virtualDOM转成真实DOM并且插入到parentDOM里面
 * @param {*} virtualDOM 虚拟DOM React元素 也就是一个JS对象
 * @param {*} parentDOM 真实DOM
 */
function render(virtualDOM,parentDOM){
   let dom = createDOM(virtualDOM);
   parentDOM.appendChild(dom);//root
}
/**
 * 把一个虚拟DOM换成真实DOM并插入到页面中去
 * @param {*} virtualDOM 
 */
function createDOM(virtualDOM){
    if(typeof virtualDOM === 'string' || typeof virtualDOM === 'number'){
        return document.createTextNode(virtualDOM);
    }
    let {type,props} = virtualDOM;//h1 props={className,style,children}
    let dom;
    if(typeof type === 'function'){
        return type.isReactComponent?updateClassComponent(virtualDOM): updateFunctionComponent(virtualDOM);
    }else{//如果说类型是一个普通字符串,说明是一个原生的虚拟DOM节点比如说h1 span div
        dom = document.createElement(type);//创建一个H1的真实DOM元素
    }
    updateProps(dom,props);
    if(typeof props.children==='string'||typeof props.children ==='number'){
        dom.textContent = props.children;// span这个DOM元素.textContent ='world'
        //如果儿子是一个对象(虚拟DOM)并且不是数组
    }else if(typeof props.children=='object' && props.children.type){
        render(props.children,dom);
    }else if(Array.isArray(props.children)){//是数组的话
        reconcileChildren(props.children,dom);
    }else{
        dom.textContent = props.children?props.children.toString():'';
    }
    return dom;
}
function updateFunctionComponent(virtualDOM){
  let {type,props } = virtualDOM;
  let renderVirtualDOM= type(props);//type=FunctionComponent
  return createDOM(renderVirtualDOM);
}
/**
 * 
 * @param {*} virtualDOM 虚拟DOM对象 {type:ClassComponent}
 */
function updateClassComponent(virtualDOM){
    let {type:ClassComponent,props } = virtualDOM;
    let classInstance = new ClassComponent(props);
    let renderVirtualDOM= classInstance.render();
    console.log('renderVirtualDOM',renderVirtualDOM);
    return createDOM(renderVirtualDOM);
  }
/**
 * 处理儿子
 * @param {*} children 
 * @param {*} dom 
 */
function reconcileChildren(children,parentDOM){
    //把每个儿子都从虚拟DOM变成真实DOM并且插入到父节点中去
    for(let i=0;i<children.length;i++){
        render(children[i],parentDOM);
    }
}
/**
 * 把props上的属性赋值给真实DOM元素 注意!此方法并不支持children
 * @param {*} dom 真实DOM
 * @param {*} props  属性对象
 */
function updateProps(dom,props){
    for(let key in props){ //className
        if(key === 'children'){continue}
        else if(key ==='style'){
            let style = props[key];//{ "color": "red"}
            for(let attr in style)
                dom.style[attr]= style[attr];
        }else{
            dom[key] = props[key];
        }
    }
}

export default {
    render
}

/**
{
  "type": "h1",
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": "span",
        "props": {
          "children": "hello"
        }
      },
      "world"
    ]
  }
}
 */