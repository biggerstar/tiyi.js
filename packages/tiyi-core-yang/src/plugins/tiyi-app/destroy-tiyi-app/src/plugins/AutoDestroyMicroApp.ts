import {MicroApp, TiEventTargetType, TiYiApp, TiYiPlugin} from "tiyi-core";


export class AutoDestroyMicroApp extends TiYiPlugin {
  public onMicroAppDestroy(event: TiEventTargetType<TiYiApp, MicroApp>) {
    // microApp.clearHook()
    // delete microApp.mode
    // TODO
  }
}
