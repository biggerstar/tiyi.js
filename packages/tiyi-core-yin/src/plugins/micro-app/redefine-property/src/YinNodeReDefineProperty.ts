import {genHookScriptContent, getAppCache, getElementTypeName, isScriptNode,} from "tiyi-core"
import {__TI_HTML__} from "../../../../mapping/constant";
import {createGetInnerHTMLFunc} from "../../../../utils/common";
import {MicroAppPropertyPlugin, scriptTextHook} from "tiyi-core-yang";

export class YinNodeReDefineProperty extends MicroAppPropertyPlugin {
  protected onConnect() {
    const self = this
    const {Node: RP} = getAppCache(this.belongApp.id, 'RPS')
    this.addRules({
      __EXEC__SCRIPT__: {
        /** 手动执行脚本，只有通过该函数才能执行脚本，其他方式都执行不了，执行时机:在队列中插入dom时，
         * 有src插入后会自动hook执行而不会请求执行源脚本(可以理解为src失效只能通过手动加载脚本文本)
         * 另外有个特性部分浏览器二次插入脚本不会重复执行但是会显示在innerHTML中
         * @param content 外部指定要执行的脚本,默认从节点上的自定义属性 __TI_HTML__ 获取 */
        value: function (content) {
          if (isScriptNode(this)) {  /* innerHTML 插入包含script标签等脚本不会被执行 */
            if (!content) content = this[__TI_HTML__] || ''
            if (Boolean(content)) {
              content = /* 只有在有传入内容情况下才生成,如果是传入''等将不hook */ genHookScriptContent(content, scriptTextHook.getModeDefaultHookMap(<string>self.belongApp.mode, 'text'), false).auto(this.type || 'with')
              RP['setter_textContent'].call(this, content)
            }
          }
        }
      },
      ownerDocument: {
        get: () => self.belongApp.proxyDocument,
      },
      parentNode: {
        get() {
          const parentNode: Element = RP['getter_parentNode'].call(this)
          return getElementTypeName(parentNode) === 'HTMLDocument' ? self.belongApp.proxyDocument : parentNode
        }
      },
      parentElement: { // 似乎在html的parentElement浏览器默认会是null
        get() {
          const parentElement: Element = RP['getter_parentElement'].call(this)
          return getElementTypeName(parentElement) === 'HTMLDocument' ? self.belongApp.proxyDocument : parentElement
        }
      },
      textContent: {
        get: createGetInnerHTMLFunc(RP['getter_textContent']),
        set: function (content) {
          isScriptNode(this) ? this['__TI_HTML__'] = content : RP['setter_textContent'].call(this, content)
        }
      },
      getRootNode: {   // 可能shadowRoot，但是只拦截 主文档document
        value: function () {
          const rootNode: Element = RP['getter_getRootNode'].call(this)
          return getElementTypeName(rootNode) === 'HTMLDocument' ? self.belongApp.proxyDocument : rootNode
        }
      },
    })
    this.definePrototype(this.window['Node'])

  }
}










