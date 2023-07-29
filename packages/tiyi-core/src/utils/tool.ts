//--------------------------------------------------------------------------------------------------------
// 通用功能函数
// noinspection JSUnusedGlobalSymbols

import {error} from "./common";

/** 判断是否是一个完整的url */
export const isFullUrl = (url: string) => url.match(/[a-zA-z]+:\/\/.+/)

/** 横线转驼峰*/
export function toCamelize(str: string) {
  let camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}

/** 驼峰转横线*/
export function toHyphenate(str: string) {
  let hyphenateRE = /\B([A-Z])/g;
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}


/** 横线转首字母大写 */
export function capitalizeWords(string: string) {
  let words = string.split('-');
  let capitalizedWords = words.map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join('');
}

/** 传入一个函数执行，并捕获函数内错误且不会被抛出 */
export function tryDoCatch(tryDo: Function): any {
  if (isFunction(tryDo)) {
    try {
      tryDo()
    } catch (e) {
      return e
    }
  }
}


/** 深度对象克隆 */
export const deepClone = (obj: Record<string, any>): object => {
  let objClone: Record<string, any> = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/** 类数组转数组 */
export function toArray<V>(arrayLike: { [index: number]: V; length: number }): V[] {
  return Array.prototype.slice.call(arrayLike);
}

/** 合并对象 */
export function mergeObject(to: Record<string, any>, from: Record<string, any>): object {
  for (const k in from) {
    to[k] = from[k]
  }
  return to
}

/** 加入微任务队列简单实现 */
export const nextTick = (cb: () => any): void => {
  Promise.resolve().then(cb)
}

/** 生成器睡眠 */
export function sleep(time: number): Promise<void> {
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, time)

  })
}

/** 微任务和宏任务等待占比，宏任务占比固定为1份， 假如proportion=1， 则两个各占50%概率， 如果假如proportion = 4， 则微任务概率80%，宏任务概率20%
 *  如果纯微任务，则有可能造成死循环无法进入宏任务
 * */
export async function microSleep(proportion: number = 1): Promise<void> {
  if (Boolean(Date.now() % (proportion + 1))/* 不为0走这里 */) return await Promise.resolve()
  else return await sleep(0)
}

/** 等待事情完成,callback() 等于true执行成功, 返回函数执行结果*/
export async function waitFinished(callback: Function, timeout = 6000, delay = 50) {
  let count = 0
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      // console.log(delay,callback());
      let clear = false
      const res = callback()
      if (res) {
        resolve(res)
        clear = true
      }
      if (count++ > (timeout / delay)) {
        reject('timeout:' + timeout)
        clear = true
      }
      if (clear) clearInterval(timer)
    }, delay)
  })
}

export async function fetchText(input: RequestInfo, options?: RequestInit): Promise<string | null> {
  /* 加载远程资源 有浏览器缓存直接返回,如果远程文件请求错误则会报错且返回null */
  return <Promise<string>>new Promise((resolve: Function, reject: Function) => {
    fetch(input, options).then(res => {
      if (res.status !== 200) return resolve(null)
      res.text().then((text: string) => resolve(text))
    }).catch((e) => {
      error(e, input)
      reject(e)
    })
  })
}

//--------------------------------------------------------------------------------------------------------
// 类型判断相关
export const isString = (data: any): data is string => typeof data === 'string'
export const isArray = (data: any): data is ArrayLike<any> => Array.isArray(data)
export const isFunction = (data: any): data is (...args: any[]) => any => typeof data === 'function'
export const isAsyncFunction = (data: any): data is (...args: any[]) => Promise<any> => {
  //@ts-ignore
  return isFunction(data) && window['Symbol'] && data[Symbol.toStringTag] === "AsyncFunction"
}
export const isBool = (data: any): data is boolean => typeof data === 'boolean'
export const isNumber = (data: any): data is number => typeof data === 'number'
export const isObject = (data: any): data is Record<any, any> => typeof data === 'object'
export const isClass = (data: any): data is (new(...args: any[]) => any) => isFunction(data) && data.prototype && data.prototype.constructor
export const isUndefined = (data: any): data is undefined => typeof data === 'undefined'
export const isUnknown = (data: any): boolean => (data === '' || data === null || data === undefined || data === false)
//--------------------------------------------------------------------------------------------------------
// node节点相关
export const isElement = (node: any): node is Element => node instanceof Element;
/** 获取节点的【小写】标签名 */
export const getTagName = (node: Element): string => node.tagName ? node.tagName.toLowerCase() : ''
export const filterWrapTextNode = (node: Element) => node.nodeType !== Node.TEXT_NODE && node.innerHTML !== '\n' //过滤掉首层text换行节点, 去除换行符
export const getElementTypeName = (node: any) => node?.toString()?.replace(/\W|object|\s+/gi, '')
export const isScriptNode = (node: any): node is HTMLScriptElement => node.tagName === 'SCRIPT'
export const isMetaNode = (node: any): node is HTMLMetaElement => node.tagName === 'META'
export const isLinkScriptNode = (node: any): node is HTMLLinkElement => isLinkNode(node) && node.as === 'script' && node.rel === 'preload'   /* lin方式导入script*/
export const isStyleNode = (node: any): node is HTMLStyleElement => node.tagName === 'STYLE'
export const isLinkStyleNode = (node: any): node is HTMLLinkElement => isLinkNode(node) && node.rel === 'stylesheet'   /* link方式导入style */
export const isLinkNode = (node: any): node is HTMLLinkElement => node.tagName === 'LINK'
/** 是否是异步加载的脚本节点 */
export const isAsyncScriptNode = (node: any): node is HTMLScriptElement => {
  const isScriptTag = isScriptNode(node) || isLinkScriptNode(<HTMLLinkElement>node)
  return/* 是否是异步加载脚本 */isScriptTag && !!(node.getAttribute('async') || node.getAttribute('defer'))   // 高版本浏览器似乎默认开启async(待验证)
}

/** 传入map对象将其设置属性到元素上 */
export function setAttrsToElement(element: Element, attrs: Record<string, any> = {}) {
  Object.keys(attrs).forEach((name) => element.setAttribute(name, attrs[name]))
}

/** 继承原来元素节点中的属性
 * @param {Element} sourceNode
 * @param {Element} targetNode
 * @param {Array} excludeList 排除继承的字段
 * */
export function extendNodeAttributes(sourceNode: Element, targetNode: Element, excludeList: Array<string>): void {
  if (!isArray(excludeList)) excludeList = []
  const attrs = sourceNode.attributes
  for (let i = 0; i < attrs.length; i++) {    // 继承原来元素中的属性
    const item = <Attr>attrs.item(i)
    if (item && excludeList.includes(item.name)) continue
    targetNode.setAttribute(item.name, item.value)
  }
}

//--------------------------------------------------------------------------------------------------------
// 其他功能函数

export function isProductionEnv(): boolean {   //  未完善
  let production = true
  //@ts-ignore
  const env = window?.process?.env?.NODE_ENV
  if (
    env === 'development'
    || location.hostname === 'localhost'
    || location.hostname === '127.0.0.1'
  ) production = false
  return production
}

/** [兼容] 自动提取某个对象的getter */
export const extractGetter = (target: object, field: string) => {
  if (Object.getOwnPropertyDescriptor) return (Object.getOwnPropertyDescriptor(target, field) as PropertyDescriptor)?.get
  else {
    //@ts-ignores
    return target['__lookupGetter__']?.(field)
  }
}

/** [兼容] 自动提取某个对象的setter */
export const extractSetter = (target: object, field: string) => {
  if (Object.getOwnPropertyDescriptor) return (Object.getOwnPropertyDescriptor(target, field) as PropertyDescriptor)?.set
  else {
    //@ts-ignores
    return target['__lookupSetter__']?.(field)
  }
}

