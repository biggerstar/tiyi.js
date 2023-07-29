// noinspection JSUnusedGlobalSymbols

import {error, warn} from "./common";

export const TiWarn = (err: string, ...args: any[]) => warn(err, ...args)
export const TiError = (err: string, ...args: any[]) => error(err, ...args)
export const TiTypeError = (err: string, ...args: any[]) => error('[TypeError] ' + err, ...args)
export const TiURIError = (err: string, ...args: any[]) => error('[URIError] ' + err, ...args)
export const NoFoundValueError = (err: string, ...args: any[]) => error('[NoFoundValueError] ' + err, ...args)
export const StartAppError = (err: string, ...args: any[]) => error('[StartAppError] ' + err, ...args)
export const DefineAppError = (err: string, ...args: any[]) => error('[DefineAppError] ' + err, ...args)
export const GetJsCacheError = () => error('getJsCache: 未定义name和field是必出传的，name是js share的唯一名称，field是js cache对象返回的某个字段')
export const ShareUrlTypeError = (name: string, url: string) => error('TypeError: url应该是个字符串,请检查传入的share配置:' + name + '.url', url)
export const ShareJsConfigError = (name: string) => error('ShareJsConfigError: 您的配置参数可能不正确', name)
export const LoaderJavascriptCacheError = (name: string) => error('加载js资源' + name + '失败')
export const RecursionAppPageBlocked = (url: string) => error('多重嵌套同一页面被阻止', url)
