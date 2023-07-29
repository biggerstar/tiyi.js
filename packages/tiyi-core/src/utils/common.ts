// noinspection JSUnusedGlobalSymbols

import {CreateElementTagType, GenHookScriptContentSupportFunctionType, GenHookScriptContentSupportType} from "types";
import {isBool, isElement, isFunction} from "@/utils/tool";

//--------------------------------------------------------------------------------------
export function warn(msg: string, ...data: any[]) {
  console?.warn(`[TiYi Warn]: ${msg}`, ...data);
}

export function error(msg: string, ...data: any[]) {
  console?.error(`[TiYi Error]: ${msg}`, ...data);
}


//--------------------------------------------------------------------------------------

/** 创建一个标签，并返回其自定义的常见操作方法对象 */
export function createElementTag(tagName: string): CreateElementTagType {
  return {
    el: document.createElement(tagName),
    /** 将该元素插入到baseEL中 */
    appendTo(baseEl: HTMLElement) {
      if (isElement(baseEl)) baseEl.appendChild(this.el)
      return this
    },
    /** 设置或者获取script第一层级的属性，这里操作的不是Element.attribute */
    attr(k: string, v: any, isExec?: any) {
      if (isBool(isExec) && isExec === false) return this
      if ((isFunction(isExec) && !isExec(v, k))) return this // 如果验证不通过则不进行属性设置
      const el: any = this.el  // ts 报错，因为k可能不在el中，简单函数少用就懒得使用keyof推导了
      if (arguments.length === 1) return el[k]
      else el[k] = v
      return this
    },
    remove(removeBaseEl: HTMLElement) {
      isElement(removeBaseEl) && removeBaseEl.removeChild(this.el)
    },
  }
}


/** 解析html为一个dom树
 * @param {string} htmlText html结构的文本
 * @param {string} type 解析类型,默认为text/html,可选text/xml
 * @see  https://caniuse.com/?search=createHTMLDocument
 * */
export function parseHtmlToDOM(htmlText: string, type: DOMParserSupportedType = 'text/html') {
  const doc = document.implementation.createHTMLDocument('')   // 所有浏览器都基本支持,相似借口DOMParser，兼容性会差点，但是支持更多DOMParserSupportedType
  doc.documentElement.innerHTML = htmlText
  return doc
}

/** 创建并返回hook更改js执行环境脚本，args； maps的key是在该脚本中被赋值的变量，value是对应赋值给key的脚本执行结果文本或者js值(用于function模式参数)
 * 比如 {window: "test.window",x1:1} 会被拼接成 var window = test.window; var x1 = 1;
 * 非es6下使用strict模式(ie10以上都支持),这样禁止未通过var等声明符定义的变量直接挂载到window上，此时会提示变量未定义(外部直接在脚本内容前面加上var xxx就行)
 * 使用函数闭包方式运行脚本，也能使得var声明的变量只在函数域中不会被挂到window上，保证了主环境不会被变量污染
 * window.xxx使用的代理，里面直接被收集拦截,非最外层作用域比如函数内只能通过window设置，此时也会在拦截范围内
 * auto:自动选择模式，没有则默认使用闭包模式;
 * module: es6模块沙箱支持;
 * function: 返回一个函数，通过使用的是map对应形参(key)和实参(val)作为该函数默认运行环境,支持外部传入重定义变量，默认和用户传入会进行合并;
 * closure: 闭包模式,不支持global域中var和无变量定义符定义的变量挂载到window，比如var a = 1 或 a = 1
 * with: with包裹创建一个执行域,可以支持global域var挂载到window上
 * */
export function genHookScriptContent(scriptContent: string, maps: Record<string, any> = {}, strict: boolean = false/* 是否开启严格模式 */): GenHookScriptContentSupportFunctionType {
  if (!maps) maps = {}
  let strictText = strict ? `"use strict";\n` : ''
  // TODO  yang模式才支持非use strict   yin模式必须使用严格模式
  /* 下方scriptContent加\n是如果不换行可能遇到双斜杠注释会被忽略出错 */
  return {
    auto(type: GenHookScriptContentSupportType): string | Function {
      const func:Function = this[type] || this['closure'] /* default */
      return func()
    },
    closure(): string {
      const proxyWindow = maps['window'] || ''
      return strictText + `(function(${Object.keys(maps).join(',')}){\n${scriptContent}\n}).call(${proxyWindow},${Object.values(maps).join(',')});`
    },
    module(): string {
      let es6Hook = ''
      for (const k in maps) {
        es6Hook = es6Hook + `var ${k} = ${maps[k]};\n`
      }
      return `${es6Hook}\n${scriptContent}`  /* es6模块支持 */
    },
    with(): string {
      let withHook = ''
      for (const k in maps) {
        withHook = withHook + `let ${k} = ${maps[k]};\n`
      }
      return `with(window){\n ${withHook}\n${scriptContent}\n }`
    },
    // 支持返回值; maps是运行环境中默认的形参和js值映射 ,customEnvArgs用户自定义传入的形参参数集，customEnvValues用户使用函数时自定义传入调用函数使用的值
    function(customEnvKeys = []): Function {
      return function (...customEnvValues: any[]) {   /* 返回给外部一个函数，执行后就能执行传入脚本逻辑 */
        const equalLengthCustomEnvValues = Array.from(customEnvKeys).map((val, index) => customEnvValues[index])  /* 将多余或者未定义实参清除或者预设成undefined,保证实参形参数量一致  */
        const keyEnvArgs: Array<string> = [...customEnvKeys, ...Object.keys(maps)]
        const valEnvArgs: Array<any> = equalLengthCustomEnvValues.concat(Object.values(maps))
        // console.log(keyEnvArgs,valEnvArgs);
        //@ts-ignore
        return (new Function(...[...keyEnvArgs, `\n${scriptContent}\n`]))(...valEnvArgs)
      }
    }
  }
}


// noinspection JSUnusedGlobalSymbols
/** 将函数的prototype去除 */
export function removeFunctionPrototype(func: Function) {
  func.prototype = undefined   // 这里不能用delete
  return func
}

// noinspection JSUnusedGlobalSymbols
export function clearAllTimer(window: WindowProxy) {
  // 获取所有定时器ID
  let allTimers = window.setTimeout(() => {
  });
  // 循环遍历这些ID并清除对应的定时器
  for (let i = 0; i < allTimers; i++) {
    window.clearTimeout(i);
  }
}

