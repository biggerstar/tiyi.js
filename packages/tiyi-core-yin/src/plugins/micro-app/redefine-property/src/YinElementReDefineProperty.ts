import {getAppCache, isScriptNode} from "tiyi-core"
import {__TI_HTML__} from "../../../../mapping/constant";
import {createGetInnerHTMLFunc} from "../../../../utils/common";
import {MicroAppPropertyPlugin} from "tiyi-core-yang";

export class YinElementReDefineProperty extends MicroAppPropertyPlugin {
  protected onConnect() {
    // 使用Sanitizer能去除script标签
    const {Element: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      innerHTML: {
        get: createGetInnerHTMLFunc(RP['getter_innerHTML']),
        set: function (content) {
          isScriptNode(this) ? this[__TI_HTML__] = content : RP['setter_innerHTML'].call(this, content)
        }
      },
      outerHTML: {
        get: function () {
          return RP['getter_outerHTML'].call(this) || this[__TI_HTML__]
        },
        set: function (content) {
          isScriptNode(this) ? this[__TI_HTML__] = content : RP['setter_outerHTML'].call(this, content)
        }
      },
      getInnerHTML: {
        value: createGetInnerHTMLFunc(RP['getter_innerHTML'])
      },
    })
    this.definePrototype(this.window['Element'])
  }
}

