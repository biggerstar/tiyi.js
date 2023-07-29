import {TiYiAppCaches} from "types";

export const cache: TiYiAppCaches = {
  /* 和apps分割开是为了隔离父级相关信息不被子应用拿到,而父级能有完全所有权 */
  apps: {},
  appCaches: {},
}


