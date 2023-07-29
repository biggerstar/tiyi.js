import {getAppCache, isScriptNode} from "tiyi-core"
import {__TI_HTML__} from "../../../../mapping/constant";
import {MicroAppPropertyPlugin} from "tiyi-core-yang";

export class YinHTMLElementReDefineProperty extends MicroAppPropertyPlugin {
  protected onConnect() {
    const {HTMLElement: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      innerText: {
        get: function () {
          return RP['getter_innerText'].call(this) || this[__TI_HTML__]
        },
        set: function (content) {
          isScriptNode(this) ? this[__TI_HTML__] = content : RP['setter_innerText'].call(this, content)
        }
      },
      outerText: {
        get: function () {
          return RP['getter_outerText'].call(this) || this[__TI_HTML__]
        },
        set: function (content) {
          isScriptNode(this) ? this[__TI_HTML__] = content : RP['setter_outerText'].call(this, content)
        }
      }
    })
    this.definePrototype(this.window['HTMLElement'])

  }
}





