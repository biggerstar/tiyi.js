import {MicroAppPropertyPlugin} from "tiyi-core-yang";

export class YinWindowReDefineProperty extends MicroAppPropertyPlugin {
  public static priority: number = -100   // 最后加载保证正常获取到代理对象
  public onConnect() {
    const self = this
    const rowFunction: Function = self.window['Function']

    const Function = rowFunction['prototype'].bind.call(rowFunction, this.belongApp.proxyWindow);

    // console.log(Function.hasOwnProperty('prototype'))

    for (const key in rowFunction) {
      Function[key] = rowFunction[key];
    }
    // console.log(Function.prototype);
    if (rowFunction.hasOwnProperty("prototype") && !Function.hasOwnProperty("prototype")) {
      Object.defineProperty(Function, "prototype", {
        value: rowFunction['prototype'],
        enumerable: true,
        writable: true
      });
    }
    const call = rowFunction.prototype.apply.call

    // console.log(call);
    // console.log(Function.prototype.call);

    // Function.prototype.apply.call(rowFunction,null, [1])

    // console.log(boundValue, boundValue.prototype.call);

    // const boundValue = rowFunction.prototype.call.bind(rowFunction);
    // // console.log(rowFunction.prototype.bind.call.prototype);
    //
    //
    // for (const key in rowFunction) {
    //   boundValue[key] = rowFunction[key];
    // }
    // console.log(rowFunction.hasOwnProperty("prototype"))
    // if (rowFunction.hasOwnProperty("prototype") && !boundValue.hasOwnProperty("prototype")) {
    //   Object.defineProperty(boundValue, "prototype", {value: rowFunction.prototype, enumerable: false, writable: true});
    // }


    // console.log(boundValue.prototype);

    this.addRules({
      // eval: {
      //   value: function (...args) {
      //     const script = args[args.length - 1]
      //     try {  // 如果是解析json或者文本数字解析后返回
      //       return JSON.parse(script)
      //     } catch (e) {  //  否则是脚本执行
      //       return windowManager.execScript(...args)()
      //     }
      //   }
      // },
      // see https://github.com/kuitos/kuitos.github.io/issues/47
      Function: {
        value: Function
      },
      frameElement: {
        value: undefined
      },
      self: {
        value: self.belongApp.proxyWindow
      },
      frames: {
        value: self.belongApp.proxyWindow
      },
      parent: {
        value: self.belongApp.proxyWindow
      },
      globalThis: {
        value: self.belongApp.proxyWindow
      },
      global: {
        value: self.belongApp.proxyWindow
      },
    })

    this.define(this.window)
  }
}
