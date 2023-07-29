//  主页面的逻辑

let registration
const registerServiceWorker = (url) => {
  if ("serviceWorker" in navigator) {
    const urlInfo = new URL(url, location.origin)
    navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      const found = registrations.find(worker => worker.active.scriptURL === urlInfo.href)
      registration = found
      if (found) return  // 已经存在worker直接返回
      try {
        registration = await navigator.serviceWorker.register(urlInfo.href, {scope: "/",});
      } catch (error) {
        console.error(`注册失败：${error}`);
      }
    })
  }
};


function createChannel(postMessageConfig, onmessage) {
  if (navigator.serviceWorker.controller) {
    let messageChannel = new MessageChannel();
    if (onmessage) messageChannel.port1.onmessage = (e) => {
      onmessage()
    }
    navigator.serviceWorker.controller.postMessage(postMessageConfig, [messageChannel.port2]);
  }
}


registerServiceWorker("sw.js")

const urls = [
  'entries.js',
  'module/module.js',
]
function loadUrlToCache(url) {
  if (!url) return
  caches.open('tiyi').then(async (cache) => {
    let text = await (await fetch(url)).text()
    text = text + `
    console.log(tiyi cache hook);
    `
    await cache.put(url, new Response(text))
    // console.log(await (await cache.match(url)).text());
  })
}

// loadUrlToCache(urls[1])

setInterval(() => {
  return
  // fetch(urls[1])
  const script = document.createElement('script')
  script.type = 'module'
  script.src = urls[1]
  document.head.appendChild(script)

}, 2000)

function createScript(url) {
  const script = document.createElement('script')
  script.src = url
  script.type = 'module'
  document.head.appendChild(script)
}

























