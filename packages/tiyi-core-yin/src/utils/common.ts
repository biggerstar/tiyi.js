import {__TI_HTML__} from "../mapping/constant";

/** 创建返回一个能够获取当前TI应用节点文本的函数，以便用于innerHTML等相关获取html逻辑，保证在获取的时候不是获取被hook script等等修改后的文本 */
export const createGetInnerHTMLFunc = (getter_innerHTML: Function): Function => {
  return function () {
    return this.hasOwnProperty(__TI_HTML__) ? this[__TI_HTML__] : getter_innerHTML.call(this)  /* 如果有该ti—html则标识外部重新设置了 */
  }
}
