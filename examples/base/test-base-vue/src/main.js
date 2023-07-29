import {createApp} from 'vue'
import App from './App.vue'
import {createMicroApp, TIYI} from 'tiyi'

createApp(App).use(function () {

}).mount('#app')
//---------------------------------------
// TIYI.use(createCoreYin())
// TIYI.use({
//   onCreateMicroApp(ev) {
//     console.log(ev)
//   }, onMicroAppConnect(event) {
//     console.log('onMicroAppConnect', event);
//   }, onMicroAppDestroy(event) {
//   }
// })

const baseUrl = location.origin
console.log(TIYI);
const shareConfig = {
  provide: {
    // css: ['aa'],
    // js: ['aa', 'vue','system'],
    data: ['testData']
  },
  share: {
    css: {
      animate: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css",
      aa: ['/css/base.css', baseUrl + '/test11111111111.css', baseUrl + '/test22222222222222.css', './css/base.css']
      // aa: new URL('./test.css',location.href).href
    },
    js: {
      // react: 'https://cdn.bootcdn.net/ajax/libs/react/18.2.0/cjs/react-jsx-dev-runtime.development.js',
      // react1: 'https://cdn.bootcdn.net/ajax/libs/react/18.2.0/cjs/react-jsx-dev-runtime.development.js',
      vue: {
        url: ['https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.global.min.js'],
        export: ['Vue', 'aaaaa'],
        type: 'module'
      },
      system: {
        url: "https://cdn.bootcdn.net/ajax/libs/systemjs/6.14.1/system.js",
        export: ['System'],
      },
      jq: "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js",
      // aa: {
      //   url: './base.js',
      //   // type:'module'
      // },
    },
    data: {
      testData: {
        aa: 11,
        bb: 22
      },
      vue: {}
    }
  }
}

// TIYI.use(createShareCenter({
//   share: {
//     css: {
//       aa: ['/css/base.css', baseUrl + '/test11111111111.css', baseUrl + '/test22222222222222.css', './css/base.css']
//     }
//   },
//   provide: {}
// }))

window.$wuran = 123456  // 主应用对子应用的污染

window.addEventListener('click', (ev) => {
  console.log('main outer click')
  // const len = history.length - 3
  // console.log(len);
  // history.go(-len)
  // history.pushState(null,'','')
  // console.log(history.length);
})

const app = createMicroApp()
// app.use(createCoreYin())
// app.goto("https://localhost:11000/aa/")
app.mount('#ti-app')
app.goto("https://localhost:11000/page2")
console.log('app', app);

const app1 = createMicroApp()
// app.use(createCoreYin())
app1.mount('#ti-app1')
app1.goto("https://localhost:12000/#test1")
console.log('app1', app1);



// const app2 = createMicroApp()
// // app.use(createCoreYin())
// app2.mount('#ti-app2')
// app2.goto("https://localhost:11000/#test2")
// console.log('app2', app2);


window.addEventListener("popstate", (ev) => {
  console.log('parent popstate', ev);
})





// const createStopLoadScriptNode = () => {
//   const node = document.createElement('script')
//   node.innerHTML = 'window.stop();console.log(window.stop)'
//   return node
// }
// console.log(111111111111111111)
// document.head.prepend(createStopLoadScriptNode())

// history.pushState({page: 1}, "title 1", "#test");
// history.pushState({page: 1}, "title 1", "#test1");
// history.pushState({page: 2}, "title 2", "#test2");
// history.pushState({page: 2}, "title 2", "#test3");
// history.pushState({page: 2}, "title 2", "#test4");


// const iframeTag = document.createElement('iframe')
// iframeTag.src =  "https://localhost:11000/aa/#test"
// iframeTag.style.height = '45vh'
// iframeTag.style.width = '45vw'
// document.body.prepend(iframeTag)
//
// const iframeTag1 = document.createElement('iframe')
// iframeTag1.src =  "https://localhost:11000/aa/#test"
// iframeTag1.style.height = '45vh'
// iframeTag1.style.width = '45vw'
// document.body.prepend(iframeTag1)
//
// const iframeTag2 = document.createElement('iframe')
// iframeTag2.src =  "https://localhost:11000/aa/#test"
// iframeTag2.style.height = '45vh'
// iframeTag2.style.width = '45vw'
// document.body.prepend(iframeTag2)

window.addEventListener('popstate', (ev) => {
  const url = ev?.state?.url
  // console.log('parent popstate', url,ev.state, ev);
})


setTimeout(() => {
  // console.log(app);
  // app.doc('222222222')
  // app.use(createCoreYin())
  // app.goto("https://localhost:11000/aa/bb")
}, 2000)

// app.mount('ti-app')

// app.text(async () => {
//   return (await fetch('https://wujicode.cn/xy/app/prod/official/index')).text()
// })
//---------------------------------------------------------------------------------


// window.addEventListener('hashchange', (event) => {
//   console.log(event);
//   alert(22222222222222)
//   // resetEventProtoRef(event,window['Event'])
//
// })
window.addEventListener('load', (ev) => {
  // console.log(ev);
})
document.addEventListener('readystatechange', (ev) => {
  // console.log(ev);
})
window.addEventListener('DOMContentLoaded', (ev) => {
  // console.log(ev);
})
window.addEventListener('error', (ev) => {
// TODO  patch error event
//   console.log(ev);
})


// window.addEventListener('hashchange', (ev) => {
//   console.log('parent hashchange', ev);
// })
