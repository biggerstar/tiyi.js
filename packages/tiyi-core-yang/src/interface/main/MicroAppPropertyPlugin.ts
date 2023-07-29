import {MicroAppBuiltInPlugin} from "@/interface";
import {isBool, isFunction, TiWarn} from "tiyi-core";


export class MicroAppPropertyPlugin extends MicroAppBuiltInPlugin {
  public priority: number = 2
  protected rules: PropertyDescriptorMap = {};

  /** 添加一组重定义规则 */
  public addRules(rules: PropertyDescriptorMap): void {
    Object.assign(this.rules, rules)
  }

  /** 执行定义规则,传入一个类或函数对其原型进行定义 */
  public definePrototype(target: object) {
    if (isFunction(target) && target.prototype) this.define(target.prototype)
  }

  /** 执行定义规则,定义普通js对象 */
  public define(target: object): void {
    if (!target) return TiWarn('未找到定义对象')
    //  执行重定义
    for (const name in this.rules) {   /* 批量重定义,本来内置默认writable和configurable都是true,上面修改可以覆盖默认设置 */
      const rule = this.rules[name]
      if (!isBool(rule.enumerable)) rule.enumerable = true
      if (!isBool(rule.configurable)) rule.configurable = true
      if (rule.value && !isBool(rule.writable)) rule.writable = true
      Object.defineProperty(target, name, rule)
    }
  }

}
