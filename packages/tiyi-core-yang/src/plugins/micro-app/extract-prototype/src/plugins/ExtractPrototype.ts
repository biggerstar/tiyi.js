import {extractGetter, extractSetter, getAppCache, isFunction, setAppCache} from "tiyi-core"
import {MicroAppBuiltInPlugin} from "@/interface";


/** 用于提取子应用环境中的原本对象原型，后续其他模块使用可以直接获取
 *  RPS: row-prototype  未加工处理之前的原型数据
 * */
export class ExtractPrototype extends MicroAppBuiltInPlugin {
  public priority = 10
  public RPS: object = {}

  public onConnect() {
    // console.log(this.window['Node'].prototype.appendChild);
    // console.log(Object.getOwnPropertyDescriptor(this.window['Node'].prototype, 'appendChild').value);
    const prototype = Object.getPrototypeOf(this)
    if (prototype) {
      const names = Object.getOwnPropertyNames(prototype)
      names.forEach(name => {
        if (name.startsWith('$') && isFunction(this[name])) this[name]()    // 自动调用所有$开头的函数，后面添加只要函数命名前缀$就会自动运行
      })
    }
    setAppCache(this.belongApp.id, {RPS: this.RPS})
  }

  public onDestroyed() {   // 清除缓存
    const appCache = getAppCache(this.belongApp.id)
    delete appCache['RPS']
  }

  public $Node() {
    const targetName = 'Node'
    const prototype = this.window[targetName].prototype

    this.RPS[targetName] = {
      rowAppendChild: prototype.appendChild,
      rowInsertBefore: prototype.insertBefore,
      rowReplaceChild: prototype.replaceChild,
      getter_getRootNode: prototype.getRootNode,
      getter_textContent: extractGetter(prototype, 'textContent'),
      setter_textContent: extractSetter(prototype, 'textContent'),
      getter_parentNode: extractGetter(prototype, 'parentNode'),
      getter_parentElement: extractGetter(prototype, 'parentElement'),
    }
  }

  public $DocumentFragment() {
    const targetName = 'DocumentFragment'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      rowAppend: prototype.append,
      rowPrepend: prototype.prepend,
    }
  }

  public $Element() {
    const targetName = 'Element'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      rowAppend: prototype.append,
      rowPrepend: prototype.prepend,
      rowBefore: prototype.before,
      rowAfter: prototype.after,
      rowReplaceChildren: prototype.replaceChildren,
      rowReplaceWith: prototype.replaceWith,
      rowInsertAdjacentElement: prototype.insertAdjacentElement,
      getter_innerHTML: extractGetter(prototype, 'innerHTML'),
      setter_innerHTML: extractSetter(prototype, 'innerHTML'),
      getter_outerHTML: extractGetter(prototype, 'outerHTML'),
      setter_outerHTML: extractSetter(prototype, 'outerHTML'),
    }
  }

  public $Event() {
    const targetName = 'Event'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      getter_path: extractGetter(prototype, 'composedPath'),
      getter_composedPath: extractGetter(prototype, 'composedPath'),
      getter_srcElement: extractGetter(prototype, 'srcElement'),
      getter_currentTarget: extractGetter(prototype, 'currentTarget'),
      getter_target: extractGetter(prototype, 'target'),
    }
  }

  public $HTMLElement() {
    const targetName = 'HTMLElement'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      getter_innerText: extractGetter(prototype, 'innerText'),
      setter_innerText: extractSetter(prototype, 'innerText'),
      getter_outerText: extractGetter(prototype, 'outerText'),
      setter_outerText: extractSetter(prototype, 'outerText'),
    }
  }

  public $HTMLScriptElement() {
    const targetName = 'HTMLScriptElement'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      getter_src: extractGetter(prototype, 'src'),
      setter_src: extractSetter(prototype, 'src'),
    }
  }

  public $EventTarget() {
    const targetName = 'EventTarget'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      rowAddEventListener: prototype.addEventListener,
      rowRemoveEventListener: prototype.removeEventListener,
    }
  }

  public $History() {
    const targetName = 'History'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      rowBack: prototype.back,
      rowForward: prototype.forward,
      rowGo: prototype.go,
      rowPushState: prototype.pushState,
      rowReplaceState: prototype.replaceState,
    }
  }

  public $HashChangeEvent() {
    const targetName = 'HashChangeEvent'
    const prototype = this.window[targetName].prototype
    this.RPS[targetName] = {
      getter_oldURL: extractGetter(prototype, 'oldURL'),
      getter_newURL: extractGetter(prototype, 'newURL'),
    }
  }
}
