export type TiHistoryOption = {
  /** url必须，其他的可选，都有默认值 */
  url: string
  appName?: string
  state?: any
  title?: string | ''
  scrollY?: number
  action?: string
  id?: number
  time?: number
}

export type SetHrefOptions = {
  /** 是否刷新或者前往子应用，调用的是microApp的goto */
  isReload?: boolean | null
  /** 是否前往锚点 */
  toAnchorPoint?: boolean
  /** 是否检测同源 */
  checkSameHost?: boolean
  /**  添加历史记录的配置，等于true会默认配置,href等于setHref的url */
  pushState?: TiHistoryOption | boolean
  /** 替换历史记录的配置，等于true会默认配置,href等于setHref的url */
  replaceState?: TiHistoryOption | boolean
  /** 滚动至指定Y轴位置 */
  scrollY?: number
}


export type NodeProcessorForProcessOption = {
  /** 外部传入的节点数组  */
  nodes: Array<Element>;
  /** 控制权和nodes  交给下一个处理器 */
  next(rowNodes: Element[]): void;
  /** 回调函数 */
  handler?(): void;
  /** 错误回调函数 */
  error?(): void;
}

export type ScriptQueueTaskType = {
  async?: boolean,
  status: boolean,
  node: Element,
  url: string,
}


export type SetHistoryToWindowOptions = { state: any, title: string, url: string, scrollY?: number }

export type FilterUrlParamsKeys = 'protocol' | 'hostname' | 'port' | 'pathname' | 'search' | 'hash'





