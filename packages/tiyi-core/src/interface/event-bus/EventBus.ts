// noinspection JSUnusedGlobalSymbols


import {isArray, isFunction, isString} from "@/utils/tool";
import {error, warn} from "@/utils/common";

/** 该类只是普通类而不是框架内核插件，event和mitt不够用直接手搓  */

export class EventBus {
  public static checkName(name: string): void {
    if (!isString(name) || (isString(name) && !name.trim())) return warn('事件名应该是个非空字符串', name)
  }
  public listeners: Record<string, Array<Record<string, any>>>

  constructor() {
    this.listeners = {}
  }

  /** 监听事件，直到rule函数返回恒等于true后执行回调 */
  public $onUntil(name: string, callback: Function, rule: Function): void {  // 暂不提供off操作
    EventBus.checkName(name)
    if (!isFunction(rule)) return error(name + '事件应该传入一个规则函数', callback)
    if (!isArray(this.listeners[name])) this.listeners[name] = []
    if (isFunction(callback)) this.listeners[name].push({callback, rule})
  }

  public $on(name: string, callback: Function): void {
    EventBus.checkName(name)
    if (!isArray(this.listeners[name])) this.listeners[name] = []
    if (isFunction(callback)) this.listeners[name].push({callback})
  }

  public $once(name: string, callback: Function): void {
    const onceCallback = (...data: any[]) => {
      this.$off(name, onceCallback)
      callback(...data)
    }
    this.$on(name, onceCallback)
  }

  public $emit(name: string, ...data: any[]): void {
    if (isArray(this.listeners[name])) Array.from(this.listeners[name]).forEach(({callback, rule}) => {   // 使用Array.from是因为$once执行后的$off删除监听器后会影响到正在$emit源listeners的index
      if (rule && rule(...data) !== true) return
      callback.call(this, ...data)
    })
    if (isArray(this.listeners['EVERY'])) Array.from(this.listeners['EVERY']).forEach(({callback, rule}) => {  // EVERY优先级比具名事件低
      if (rule && rule(...data) === true) return
      callback.call(this, name, ...data)   // event返回的第一个参数是事件名，后面是主动emit对应的参数
    })
  }

  public $off(name: string, callback: Function): void {
    if (!isArray(this.listeners[name])) return
    for (let i = 0; i < this.listeners[name].length; i++) {
      if (this.listeners[name][i].callback === callback) this.listeners[name].splice(i--, 1)
    }
  }

  /** 关闭某个事件的所有监听 */
  public $offAll(name: string): void {
    delete this.listeners[name]
  }

  public $onEvery(callback: Function): void {
    this.$on('EVERY', callback)
  }

  /** 所有发出的事件都会被该函数接受到 */
  public $offEvery(callback: Function): void {
    this.$off('EVERY', callback)
  }

  /** 清空所有事件 */
  public $clear(): void {
    for (const k in this.listeners) {
      delete this.listeners[k]
    }
  }
}

