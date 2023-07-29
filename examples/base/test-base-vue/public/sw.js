console.log('sw js加载');

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


self.addEventListener('message', function (event) {
  let data = event.data;
  if (data.type === "loadUrlToCache") {
    // console.log(data);
    loadUrlToCache(data.data)
    // event.ports[0].postMessage({
    //   "message": "Hi, Page"
    // });
  }
});

self.addEventListener('install', function () {
  self.skipWaiting().then()
})

self.addEventListener('activate', function (event) {
  console.log(111111111111111111)
  event.waitUntil(self.clients.claim())
})
self.addEventListener("fetch", (event) => {
  console.log(event.request.destination, event.request.url)
  // console.log(event);

  const {request} = event
  const accept = request.headers.get('accept') || ''

  if (accept.includes('text/event-stream')) {
    return
  }

  if (request.mode === 'navigate') {
    return
  }

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  // console.log(event);
  event.respondWith(
    (async function () {
      const res = await fetch(event.request);
      const newRes = res.clone();
      let content = await newRes.text()
      console.log(newRes);
      // console.log(content);
      if (!content) content = ''
      content = content + `
        console.log(111111111111111111);
      `
      fetch('https://bird.limestart.cn/cache/bing.json')
      return new Response(content, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'max-age=0',
        }
      });
    })()
  );
});
