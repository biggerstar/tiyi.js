import {
  extendNodeAttributes,
  getTagName,
  isMetaNode,
  isString, MicroApp,
  parseHtmlToDOM,
  TiEventTargetType,
  toArray,
  warn
} from "tiyi-core"
import {MicroAppBuiltInPlugin} from "@/interface";
import {toNoHashUrlPath} from "@/utils/common";

export class DocumentManager extends MicroAppBuiltInPlugin {
  public offLineDocument
  public baseTag: HTMLBaseElement | null
  constructor() {
    super();
    this.baseTag = null
  }

  public onLoadHTML({data: html}:TiEventTargetType<MicroApp, string>):void {
    // console.log('onLoadHTML')
    this.loadHTMLToDocument(html)
  }

  /** 将html加载到当前app对应的iframe中 */
  public loadHTMLToDocument(htmlText:string):void {
    if (!isString(htmlText)) {
      htmlText = ''
      warn('加载html异常,html的值不是一个字符串', htmlText)
    }
    this.setBaseTag().parseHTML(htmlText).patch()
  }


  public parseHTML(htmlText: string) {
    this.offLineDocument = parseHtmlToDOM(htmlText)
    return this
  }

  /** 设置一个base标签重新指定环境中的baseURL  */
  public setBaseTag():this {
    const baseTag = this.document.head.querySelector('base')
    if (!baseTag) {
      this.baseTag = this.document.createElement('base')
      this.baseTag.href = toNoHashUrlPath(this.belongApp.url)  // baseURL 不应该包含hash
      this.document.head.appendChild(this.baseTag)
    }
    return this
  }

  public patch():this {
    const allowTagNames = ['script', 'style', 'link']
    const createNewNode = (node) => {   /* 重新创建一个适合子应用环境的节点，因为script等标签不同上下文不通用 */
      const tagName = getTagName(node)
      if (tagName && allowTagNames.includes(tagName)) {
        const newNode = this.document.createElement(tagName)
        extendNodeAttributes(node, newNode)
        if (node.innerHTML) newNode.textContent = node.innerHTML
        node = newNode
      }
      return node
    }
    const filterNode = (node) => {
      if (isMetaNode(node)) {
        const httpEquiv = node.getAttribute('http-equiv') || ''
        if (httpEquiv.toLowerCase() === 'content-security-policy') return false  // 去除服务端指定的跨域限制信息
      }
      return true
    }

    // loading rule see https://developer.mozilla.org/zh-CN/docs/Web/API/Document/readyState
    // DOMContentLoaded: 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。
    // load: load 事件在整个页面及所有依赖资源如样式表和图片(检测图片加载完成可以通过获取所有img检查属性complete=true)都已完成加载时触发。
    //       它与 DOMContentLoaded 不同，后者只要页面 DOM 加载完成就触发，无需等待依赖资源的加载。
    let headList = toArray(this.offLineDocument.head.childNodes).filter(filterNode)
    let bodyList = toArray(this.offLineDocument.body.childNodes)
    headList.forEach((node) => this.document.head.appendChild(createNewNode(node)))
    bodyList.forEach((node) => this.document.body.appendChild(createNewNode(node)))
    extendNodeAttributes(this.offLineDocument.documentElement, this.document.documentElement)  /* 同步html标签设置的属性，正常是lang属性 */
    this.offLineDocument = null  // 释放内存
    return this
  }
}
