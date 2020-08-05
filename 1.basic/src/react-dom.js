import { addEvent } from './event';
/**
 * 把virtualDOM转成真实DOM并且插入到parentDOM里面
 * @param {*} virtualDOM 虚拟DOM React元素 也就是一个JS对象
 * @param {*} parentDOM 真实DOM
 */
function render(virtualDOM, parentDOM) {
  let dom = createDOM(virtualDOM);
  if (dom === undefined) return
  parentDOM.appendChild(dom);//root
}
/**
 * 把一个虚拟DOM换成真实DOM并插入到页面中去
 * @param {*} virtualDOM 
 */
export function createDOM(virtualDOM) { //如果是类组件，vDom上挂载 实例和dom
  console.log("createDOM -> virtualDOM", virtualDOM)
  if (virtualDOM === undefined) return
  if (typeof virtualDOM === 'string' || typeof virtualDOM === 'number') {
    return document.createTextNode(virtualDOM);
  }
  let { type, props, ref } = virtualDOM;//h1 props={className,style,children}
  let dom;
  if (typeof type === 'function') {
    return type.isReactComponent ? updateClassComponent(virtualDOM) : updateFunctionComponent(virtualDOM);
  } else {//如果说类型是一个普通字符串,说明是一个原生的虚拟DOM节点比如说h1 span div
    dom = document.createElement(type);//创建一个H1的真实DOM元素
  }
  updateProps(dom, props);
  if (typeof props.children === 'string' || typeof props.children === 'number') {
    dom.textContent = props.children;// span这个DOM元素.textContent ='world'
    //如果儿子是一个对象(虚拟DOM)并且不是数组
  } else if (typeof props.children == 'object' && props.children.type) {
    render(props.children, dom);
  } else if (Array.isArray(props.children)) {//是数组的话
    reconcileChildren(props.children, dom);
  } else {
    dom.textContent = props.children ? props.children.toString() : '';
  }
  if (ref) {
    ref.current = dom;
  }
  virtualDOM.dom = dom
  return dom;
}
function updateFunctionComponent(virtualDOM) {
  let { type, props } = virtualDOM;
  let renderVirtualDOM = type(props);//type=FunctionComponent
  return createDOM(renderVirtualDOM);
}
/**
 * 
 * @param {*} virtualDOM 虚拟DOM对象 {type:ClassComponent}
 */
function updateClassComponent(virtualDOM) {
  let { type: ClassComponent, props, ref } = virtualDOM;
  let classInstance = new ClassComponent(props);
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();//在挂载前调用一下componentWillMount
  }
  if (ref) {//如果类组件的虚拟DOM 有ref属性,那么就让ref.current = 类组件的实例
    ref.current = classInstance;
  }
  let renderVirtualDOM = classInstance.render();

  //把此虚拟DOM赋给classInstance.oldVdom
  classInstance.oldVdom = renderVirtualDOM;
  let dom = createDOM(renderVirtualDOM);
  if (!dom) return
  virtualDOM.instance = classInstance
  virtualDOM.renderVirtualDOM = renderVirtualDOM
  virtualDOM.dom = dom
  //在类的实例身上挂一个属性DOM,指向此类实例对应的真实DOM
  // classInstance.dom = classInstance.oldVdom.dom = dom;
  if (classInstance.componentDidMount) {
    classInstance.componentDidMount();//在挂载前调用一下componentWillMount
  }
  return dom;
}
/**
 * 处理儿子
 * @param {*} children 
 * @param {*} dom 
 */
function reconcileChildren(children, parentDOM) {
  //把每个儿子都从虚拟DOM变成真实DOM并且插入到父节点中去
  for (let i = 0; i < children.length; i++) {
    render(children[i], parentDOM);
  }
}
/**
 * 把props上的属性赋值给真实DOM元素 注意!此方法并不支持children
 * @param {*} dom 真实DOM
 * @param {*} props  属性对象
 */
function updateProps(dom, props) {
  if (!props) return
  for (let key in props) { //className
    if (key === 'children') { continue }
    else if (key === 'style') {
      let style = props[key];//{ "color": "red"}
      for (let attr in style)
        dom.style[attr] = style[attr];
    } else if (key.startsWith('on')) {
      // dom=button onclick handleClick
      addEvent(dom, key.toLocaleLowerCase(), props[key]);
    } else {
      dom[key] = props[key];
    }
  }
}

//  3 都有子 先都处理成数组，遍历老的子数组，每一项和新的比较，
//    遍历结束后如果新子还有剩余，直接生成dom插入。如果新子比较短，直接删除长的数据
//    考虑文本，组件，普通标签三种情况
//    如果是移除组件，记得添加unmount生命周期函数
//    循环结束，处理剩余的子元素
function compareChildren(parentDom, oldChildren, newChildren) {
  oldChildren.forEach((oldChild, index) => {
    let newChild = newChildren[index]
    if ((!oldChild && oldChild !== 0) || (!newChild && newChild !== 0)) {// 这种情况应该不用在这里处理的，要保证index对应的虚拟和真实是一致的
      if (!oldChild && oldChild !== 0 && newChild) { // 插入
        console.log("compareChildren -> 插入")
        newChild.dom = createDOM(newChild)
        if (!newChild.type) newChild.dom = document.createTextNode(newChild)
        let insertPositionNode = parentDom.childNodes[index]
        let countIndx = index
        while (!insertPositionNode && countIndx < oldChildren.length) {
          insertPositionNode = parentDom.childNodes[++countIndx]
        }
        if (insertPositionNode) {
          parentDom.insertBefore(newChild.dom, parentDom.childNodes[index + 1])
        } else {
          parentDom.appendChild(newChild.dom)
        }
        oldChildren[index] = newChild
        return
      }
      if (oldChild && !newChild && newChild !== 0) { // 删除
        console.log("compareChildren -> 删除")

        // console.log("compareChildren -> newChild", newChild)
        // console.log("compareChildren -> oldChild", oldChild)
        // console.log("compareChildren -> index", index)

        console.log("compareChildren -> parentDom.childNodes[index]", parentDom.childNodes[index])
        if (parentDom.childNodes[index]) parentDom.removeChild(parentDom.childNodes[index])
        // const before = oldChildren.filter((c, cIndex) => cIndex < index)
        // const after = oldChildren.filter((c, cIndex) => cIndex > index)
        // oldChildren = [...before, ...after]

      }
      return
    }
    if (typeof oldChild.type === 'string') { // 旧节点为普通节点
      if (!newChild.type) {//新节点为文本节点
        parentDom.replaceChild(document.createTextNode(newChild), oldChild.dom)
      }

      if (newChild.type && newChild.type !== oldChild.type) { // 新节点和旧节点不一致，且为组件或普通标签
        newChild.dom = createDOM(newChild)
        parentDom.replaceChild(newChild.dom, oldChild.dom)
      }

      if (oldChild.type === newChild.type) {//新旧节点一致，都为普通节点，更新属性，比较子节点
        newChild.dom = oldChild.dom
        compare(oldChild, newChild)
      }
    }

    if (!oldChild.type) {//旧节点为文本
      if (!newChild.type) {// 都是文本
        if (newChild !== oldChild) parentDom.childNodes[index].textContent = newChild
      } else { // 子节点是组件或者普通标签
        newChild.dom = createDOM(newChild)
        parentDom.replaceChild(newChild.dom, parentDom.childNodes[index])
      }
    }

    if (typeof oldChild.type === 'function') {// 旧节点为组件节点
      if (!newChild.type) { // 文本节点
        // 调用生命周期函数
        oldChild.instance.componentWillUnmount && oldChild.instance.componentWillUnmount()
        parentDom.replaceChild(document.createTextNode(newChild), parentDom.childNodes[index])
      }
      if (newChild.type && newChild.type !== oldChild.type) { // 新节点和旧节点不一致，且不为普通节点或组件
        oldChild.instance.componentWillUnmount && oldChild.instance.componentWillUnmount()
        newChild.dom = createDOM(newChild)
        parentDom.replaceChild(newChild.dom, parentDom.childNodes[index])
      }

      if (oldChild.type === newChild.type) {
        newChild.instance = oldChild.instance
        oldChild.instance.$updater.emitUpdate(newChild.props)
      }
    }

  })

  // 删除旧数组中过长的
  const oldLength = oldChildren.length
  const newLength = newChildren.length

  if (oldLength > newLength) {
    oldChildren.filter((child, index) => index >= newLength).forEach((child, index) => {
      if (!child.type) {
        parentDom.removeChild(parentDom.childNodes[index])
      } else if (typeof child.type === 'string') {
        parentDom.removeChild(child.dom)
      } else if (typeof child.type == 'function') {
        child.instance.componentWillUnmount && child.instance.componentWillUnmount()
        parentDom.removeChild(parentDom.childNodes[index])
      }
    })
  }

  if (oldLength < newLength) {
    newChildren.filter((child, index) => index >= oldLength).forEach((child, index) => {
      if (!child.type) {
        parentDom.appendChild(document.createTextNode(child))
      } else if (typeof child.type === 'string') {
        parentDom.appendChild(createDOM(child))
      } else if (typeof child.type == 'function') {
        child.instance.componentWillMount && child.instance.componentWillMount()
        parentDom.appendChild(createDOM(child))
      }
    })
  }

  // 插入新数组中过长的
}

export function compare(oldVDom, newVDom) { //应该是比较两颗虚拟dom树，然后操作实际dom，这里应该是能触发递归操作才行
  //如果类型一样的,要进行深度对比
  if (oldVDom.type === newVDom.type) {
    updateProps(oldVDom.dom, newVDom.props)
    let dom = oldVDom.dom
    oldVDom.children = oldVDom.props.children
    newVDom.children = newVDom.props.children
    //比较子元素
    //  0 都无子
    if (!oldVDom.children && !newVDom.children) return dom

    //  1 老有子，新无子 直接移除dom上所有子元素
    if (oldVDom.children && !newVDom.children) {
      dom.empty()
      return dom
    }

    //  2 老无子，新有子 将子元素处理成数组，遍历生成子dom插入到 dom中
    if (!oldVDom.children && newVDom.children) {
      if (!Array.isArray(newVDom.children)) newVDom.children = [newVDom.children]
      newVDom.children.forEach(child => {
        let childDom = createDOM(child)
        dom.appendChild(childDom)
      })
      return dom
    }
    //  3 都有子 先都处理成数组，遍历老的子数组，每一项和新的比较，
    //    遍历结束后如果新子还有剩余，直接生成dom插入。如果新子比较短，直接删除长的数据
    let oldChildren = Array.isArray(oldVDom.children) ? oldVDom.children : [oldVDom.children]
    let newChildren = Array.isArray(newVDom.children) ? newVDom.children : [newVDom.children]
    compareChildren(dom, oldChildren, newChildren)

    return dom
    //可以复用老DOM,不需要新创建DOM了
    //1.用新的属性对象更新老的DOM的属性

    //2.深度比较儿子们,进行一一对比
  } else {
    let dom = createDOM(newVDom)
    return dom;
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