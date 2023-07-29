import {MicroAppPropertyPlugin} from "tiyi-core-yang";


export class YinDocumentReDefineProperty extends MicroAppPropertyPlugin {
  public onConnect() {
    /**  重定义document原型 */
    this.addRules({
      referrer: {
        value: ''   // iframe 默认会使用父级referrer，地址栏或书签打开为空字符串
      },
      defaultView: {
        get: () => this.belongApp.proxyWindow,
      },
      URL: {
        get: () => this.belongApp.url
      },
    })
    this.define(this.document)
  }
}
