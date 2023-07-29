import {
  extendNodeAttributes,
  fetchText,
  getAppCache,
  isAsyncScriptNode,
  isFunction,
  isLinkScriptNode,
  isScriptNode,
  TiError,
  warn
} from 'tiyi-core'
import {NodeProcessor} from "@/interface";
import {__DATA_TI_URL__, __EXEC__SCRIPT__} from "@/constant";
import {NodeProcessorForProcessOption, ScriptQueueTaskType} from "types";

export class ScriptQueueProcessor extends NodeProcessor {
  // private securityScriptNode = []
  public queue: ScriptQueueTaskType[] = []

  public process({nodes, next}:NodeProcessorForProcessOption):void {
    next(nodes.map((node) => {
      if (this.canAddToQueue(node)) {
        node = this.createSafeScriptNode(node)
        // console.log(node,node.innerHTML);
        this.add(node)
      }
      return node
    }))
  }

  /** 检查是否是脚本节点，只有脚本节点才同意可以加入队列 */
  public canAddToQueue(node) {
    return isScriptNode(node) || isLinkScriptNode(node)
  }

  public execScript(node) {
    if (node[__EXEC__SCRIPT__]) node[__EXEC__SCRIPT__]()
  }

  /**  添加到脚本队列中,添加的节点必须是script节点，吐过是link节点必须先转script节点 */
  public add(node) {
    if (isLinkScriptNode(node)) return TiError('请先将link节点转script节点', node)
    if (node.src) return TiError('添加到队列的节点不能有src，如果要加载远程url请将url设置到属性' + __DATA_TI_URL__, node)
    const url = node.getAttribute(__DATA_TI_URL__)
    const task: ScriptQueueTaskType = {
      async: isAsyncScriptNode(node),
      status: false,
      node,
      url,
    }
    this.queue.push(task)
    // 直接发起请求可以做到并发请求，之后队列到某个节点且status为true时再执行脚本
    this.request(task).then((content: string | null) => {  // 每个节点处理后都会有一个回调
      task.status = true
      // console.log(task.node.innerHTML);
      task.node.innerHTML = content ? content : ''
      this.appendScripts()   // 每次节点响应回调后都会检查当前所有可执行脚本的直接然后执行
    })
  }

  /** 立即将script添加到dom中  */
  public addNow(node) {
    const {Node: RP} = getAppCache(this.belongApp.id, 'RPS')
    RP.rowAppendChild.call(this.document.head, node)
    this.execScript(node)
  }

  public request(task): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const url = task.node.getAttribute(__DATA_TI_URL__)
        if (!url) resolve(task.node.innerHTML) // 如果节点不用请求远程资源
        else {
          // 在这里异步加载async和defer其实已经没什么区别了，一律顺序加载，后面有在优化开设异步加载队列或者async标识
          fetchText(url).then((content: string | null) => {  // 快速添加时网络并发请求，而不使用async await一个个请求
            resolve(content)
          }).catch((e) => {
            // TODO 如果节点和window监听了err回调，则主动运行window.error,script.error等回调
            const errFunc = task.node.onerror || this.window.onerror
            if (isFunction(errFunc)) task.node.onerror(new this.window['Event']('fetch'))
            else console.error(e)
            reject(e)
          }).finally(() => {
          })
        }
      }
    )
  }

  /** 每次add task时都会在合适时机执行该函数，检查当前可插入脚本，最终所有节点都会被添加  */
  public appendScripts() {
    if (this.queue.length === 0) return warn('doAppend函数调用时在队列中应该至少包含一个任务，如果非手动调用出现该提示代表有bug') // 给自己看的防御性编程
    while (this.queue.length) {
      const task = this.queue[0]
      if (task.status) {
        let {node} = <ScriptQueueTaskType>this.queue.shift()
        this.execScript(node)
      } else break
    }
  }

  /** 创建一个安全可插入子应用环境的脚本节点，这里主要是处理将link脚本转成script标签脚本 */
  public createSafeScriptNode(node: Element) {   /* 这里传入的script node需要是子环境document创建的，否则插入不生效，默认在document manager插件支持已经处理过了 */
    let url = this.extractScriptNodeUrl(node)
    if (isLinkScriptNode(node) || isScriptNode(node)) {   // 如果是link节点则创建新的样式或脚本标签,其余情况全部直接返回原本传入的script node,此时外部如果要使用保存该节点，引用地址不会被改变
      const newNode = this.document?.createElement('script')
      let excludeList: string[] = []
      // TODO 考虑type = 'module' and type = 'text/javascript'
      if (isLinkScriptNode(node)) excludeList = ['rel', 'href', 'as']
      if (isScriptNode(node)) excludeList = ['rel', 'src']
      extendNodeAttributes(node, newNode, excludeList)
      node = newNode
    }
    if (isScriptNode(node)) node.removeAttribute('src')   // 移除原本的src，否则会加载远程js文件
    if (url) node.setAttribute(__DATA_TI_URL__, url)   // 将script节点的src属性转移到__DATA_TI_URL__
    return node
  }

  public extractScriptNodeUrl(node: Element) {
    let url
    if (isScriptNode(node)) url = node.src
    if (isLinkScriptNode(node)) url = node.href
    return url
  }

  // protected markAppScriptNode(node) {
  //   const isTiNodeInfo = Object.getOwnPropertyDescriptor(this, __IS_TI_SCRIPT_NODE_)
  //   if (!isTiNodeInfo || (isTiNodeInfo && isTiNodeInfo.configurable)) {   // 如果第一次定义或者外部骚操作要利用逻辑漏洞，给修改过来
  //     Object.defineProperty(node, __IS_TI_SCRIPT_NODE_, {
  //       value: true,
  //       configurable: false
  //     })
  //     this.securityScriptNode.push(this)
  //   } else {   /* 第二次插入会走这里 */
  //     if (!this.securityScriptNode.includes(this)) return // 如果外部设置configurable为false或者该节点不在记录的安全数组内，则忽略本次插入html
  //   }
  // }

}
















