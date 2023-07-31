import {MicroAppBuiltInPlugin} from "tiyi-core-yang";
import {getAppCache, getAppCaches, getMicroApp} from 'tiyi-core'


function generateAllAppState() {
  const allMicroAppCache = getAppCaches()
  let allAppStates = {}

  getAppCache('a')
  console.log(allMicroAppCache);

  for (const appName in allMicroAppCache) {
    const app = getMicroApp(appName)
    const {window} = allMicroAppCache[appName]
    const appHistory = window.history
    // console.log(appHistory);
    console.log(appHistory.state);
    // console.log(window.document);
    allAppStates[appName] = JSON.parse(JSON.stringify({
      url: app.url,
      state: appHistory.state
    }))
  }
  console.log('allAppStates', allAppStates);

  return Object.keys(allAppStates).length ? null : allAppStates
}


export class AutoAsyncAppHistoryToTopWindow extends MicroAppBuiltInPlugin {
  priority: -20

  public onConnect(event) {
    const self = this
    const topHistory = window.history
    const appWindow = this.window
    const appHistory = this.window.history
    const appLocation = this.belongApp.location
    let count = 1
    // console.log(appWindow);
    const rowPushState = appHistory.pushState
    const rowReplaceState = appHistory.replaceState
    // console.log(rowPushState);
    // console.log(rowReplaceState);

    this.window.addEventListener("popstate", (ev) => {
      // console.log(topHistory);
      console.log(generateAllAppState());
    })

    // appHistory.pushState = function (state: any, title: string, url: string) {
    //   // console.log(self.belongApp.id, 'pushState', state, title, url);
    //   rowPushState.call(appHistory, state, title, url)
    //   // console.log(generateAllAppState());
    // }
    //
    // appHistory.replaceState = function (state: any, title: string, url: string) {
    //   console.log(self.belongApp.id, 'replaceState', state, title, url);
    //   rowReplaceState.call(appHistory, state, title, url)
    //   // console.log(generateAllAppState());
    // }


  }

}
