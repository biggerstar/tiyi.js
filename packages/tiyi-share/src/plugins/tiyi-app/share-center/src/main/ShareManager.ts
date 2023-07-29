// noinspection JSUnusedGlobalSymbols


import {isString, isUnknown, TiError, waitFinished} from "tiyi"

export class ShareManager {
  public cache = {}
  /** 外部传入的资源配置 */
  public config = {}

  public add?(name: string, set: string | Element): void;

  public provide?(provideList: string[] | boolean, targetWindow): void

  public has(name): boolean {
    return !!this.config[name]
  }

  public hasCache(name): boolean {
    return !!this.cache[name]
  }

  public get(name: string): any {
    return this.config[name]
  }

  public getCache(name: string): any {
    return this.cache[name]
  }

  public async getCacheSync(name: string): Promise<any> {
    const self = this
    return new Promise((done, err) => {
      if (!isString(name) || isUnknown(name)) return TiError('getCacheSync: 不是正确的字符串名称:' + name)
      waitFinished(() => self.getCache(name), 6000, 200).then(done).catch(err => {
        TiError('[ShareCenter] 资源名称为 ' + name + ' 未被缓存，请检查是否在share配置了对应资源', err, self)
      })
    })
  }

  public remove(name: string): void {
    delete this.config[name] && delete this.cache[name]
  }

  /** 添加所有资源 */
  public addAll(config: object): void {
    for (const k in config) {
      this.add?.(k, config[k])
    }
  }
}



