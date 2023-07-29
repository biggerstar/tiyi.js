import {GetJsCacheError, TiError, TIYI} from "tiyi";
import {CssShareManager, DataShareManager, JsShareManager, ShareCenter, ShareCenter as ShareCenterCls} from "./src";
import {TiYiAppInterface} from "../../../types/tiyi-share";

const supportShare = {
  js: JsShareManager,
  css: CssShareManager,
  data: DataShareManager,
}
let TIYI_APP = TIYI as TiYiAppInterface


/** 获取某个js执行块执行后指定缓存中对象字段数据 */
function getJsCache(name: string, field: string): any {
  if (!field || !name) return GetJsCacheError()
  const share = this.share
  if (share.js.hasCache(name)) return share.js.getCache(name)[field]
  else return {}
}

const install = (app, config) => {
  if (!config) config = {}
  if (app !== TIYI_APP) return TiError('您应该使用TIYI.use安装该插件');
  TIYI_APP.getJsCache = getJsCache.bind(TIYI_APP)
  const shareCenter: ShareCenter = new ShareCenterCls()
  TIYI_APP.share = shareCenter
  for (const k in supportShare) {
    shareCenter.register(k, supportShare[k])
  }
  /* 主应用加载并派发资源到主应用上，所请求的资源保存到资源共享中心 */
  shareCenter.load(config.share)
  shareCenter.provides(config.provide, window)
}

export const ShareCenter = {
  name: 'ShareCenter',
  install
}


