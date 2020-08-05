/**
 * @param {*} type 元素的类型
 * @param {*} config 配置对象
 * @param {*} children 准确的说是指的第一个儿子 无儿就是undefine 一个儿就独生子 多个儿就是大儿子,太子
 */
function createElement(type, config, children) {
  if (config) {
    delete config.__source;
    delete config.__self;
  }
  let props = { ...config };
  //如果没儿子undefined 一个儿子就是对象 字符串 元素 如果是多个儿子就是一个数组
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  props.children = children;
  return {
    type,
    props
  };
}
export default {
  createElement,
};
