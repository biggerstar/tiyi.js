import {fetchText, isArray, isElement, isString, warn} from "tiyi"
import {ShareManager} from "../main/ShareManager";

export class CssShareManager extends ShareManager {
  public add(name: string, set: string | Element): void {
    this.config[name] = set
    this.loadCss(name).then()
  }

  /** 加载css到缓存 */
  async loadCss(name) {
    if (this.cache[name]) return
    const shareInfo = this.get(name)
    if (!shareInfo) return warn('未找到名字为' + name + '的css全局共享资源')
    const shareUrlList = isArray(shareInfo) ? shareInfo : [shareInfo]
    for (const k in shareUrlList) {
      const sheet = await this.genCssSheet(shareUrlList[k])
      if (sheet) {
        this.cache[name] = sheet;
        break
      }
    }
  }

  /** 渲染cssRules到目标浏览器窗口;
   *  如果外部provide.css未设置，将会在主应用环境中加载并挂载所有的产出物  */
  public provide(cssList: [] | boolean, targetWindow: WindowProxy) {
    if (cssList === true) cssList = <[]>Object.keys(this.config)  /* 外部未定义或者为true，获取当前所有资源名称 */
    else if (!isArray(cssList)) return;   /* 设置成false则不会加载提供资源  */
    cssList.forEach(async (name) => {
      const sheet = await this.getCacheSync(name) as CSSStyleSheet
      const isAllowed = sheet.ownerNode?.ownerDocument !== document   /* 此时不是主应用dom和未挂载到dom上表示该样式未在主应用dom上生效 */
      if (!isAllowed) return   // 已经存在在主应用的样式不渲染
      await this.addCssRules(sheet, targetWindow.document, targetWindow['CSSStyleSheet'])
    })
  }

  /** 添加cssRules到目标的文档 */
  async addCssRules(sheet: CSSStyleSheet, documentScope: Document, CSSStyleSheetScope) {
    const adoptedSupport = !!documentScope.adoptedStyleSheets
    let cssText = '', extendSheet: CSSStyleSheet
    const cssRuleList = sheet['cssRules'] || sheet['rules']
    for (let i = 0; i < cssRuleList.length; i++) {
      // TODO  plugin HOOK filter CssRule
      cssText = cssText + cssRuleList[i].cssText
    }
    if (adoptedSupport) {
      extendSheet = new CSSStyleSheetScope()
      extendSheet.replaceSync(cssText)
      documentScope.adoptedStyleSheets = [...documentScope.adoptedStyleSheets, extendSheet]
    } else {
      const styleTag = document.createElement('style')  // 降级方案, 比直接each insertRule性能好
      styleTag.innerHTML = cssText
      documentScope.head.appendChild(styleTag)   // 创建一个样式表用于继承父应用的样式
    }
  }


  /**  通过Element元素或者URL获取并生成css的styleSheet */
  async genCssSheet(shareItem: string | Element): Promise<null | CSSStyleSheet> {
    let sheet = null
    if (isElement(shareItem))    /* sheet from link or style tag */ sheet = shareItem['sheet']
    else if (isString(shareItem)) {  /* 通过url加载的都是离线sheet */
      // sheet = await viteCssSheetLoader(<string>shareItem)  /* vite css形式的js适配 */
      const cssText = await fetchText(<string>shareItem)
      if (cssText) {
        sheet = new CSSStyleSheet()
        sheet.replaceSync(<string>cssText)
      }
    }
    return sheet
  }

}
