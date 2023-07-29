setTimeout(() => {
  if (!window['__TI_APP__']) {
    console.error('未通过太乙框架方式加载该应用', window, location.href)
  }
}, 1000)

// console.log(self);
// console.log(window.self.top);

// console.log(history);
// console.log(window.document);
// console.log(window.document.location, document.location, location);

// window.document.location.href = "https://localhost:8080"
// console.log(window,window.parent);
// console.log('globalThis', globalThis);

// console.dir(document);
// console.log(window);


// const script = document.createElement('script')
// script.innerHTML = ' console.log("textContent",111111111111111111)'
// // console.log(document.head.appendChild);
// script.type = 'module'
// document.head.appendChild(script)
// const baseTag = document.head.children[0]
// const baseTag =  document.querySelector('title')
// console.log(baseTag);
// const baseTag =  document.head.children[5]


const div1 = document.createElement('div')
div1.innerHTML = '<script > console.log(111111111111111111)</script>'

const div2 = document.createElement('div')
div2.innerHTML = 'div2'

const script1 = document.createElement('script')
script1.innerHTML = 'console.log("111111111111111111...node")'
script1.setAttribute('data-ad', '132')
// document.body.children[1].setHTML('<script > console.log(2222222222222)</script>')
// document.head.append(div1, script1)


// document.head.insertBefore(script1,div1)

// document.head.children[3].replaceWith(div2);

// console.log(Object.getOwnPropertyDescriptor(document.location, 'href'));
// console.log('重加载')

// location.hash = '#modify'
// window.addEventListener('popstate', (ev) => {
//   console.log('child popstate', ev,ev.__TI_STATE__);
// })
// console.log('子应用加载');



window.addEventListener('popstate', (ev) => {
  console.log('child popstate', ev);
  console.log(history.state);
})

window.addEventListener('click', (ev) => {
  // console.log('click', ev);
})


window.addEventListener('beforeunload', (ev) => {
  console.log('beforeunload',window.__TI_APP__)
  // console.log(ev);
})


setTimeout(() => {


  // console.log(new Event('aaa'));
  // location.hash = '#aaa'
  // location.hash = ''
  // location.host = 'localhost:1000'
  // location.href = '/href/aa'
  // location.href = location.href + 'a'
  // location.href = '?page=12'
  // location.origin = 'https://localhost:11000'
  // location.hostname = 'localhost1'
  // location.pathname = 'pathname'
  // location.port =  '1000aa'
  // location.protocol =  'wss'
  // location.search =  'a=1&b=2'
  // location.replace('/replace#aa')
  // console.log(location.ancestorOrigins)
  // console.log(location.toString())
  //------------------------------------------------
  // console.log(history);
  // console.log(111111111111111111)
  // location.href = '#aaa'
  // location.assign('https://localhost:1000/aa/bb')
  // console.log(location.href);
  // history.pushState({childPage: 1}, "title 1", "https://localhost:11000?page=1#aaaaaa");
  // history.pushState({childPage: 1}, "title 1", "#aaaa");
  // history.pushState({childPage: 1}, "title 1", "?page=1");
  // history.pushState({childPage: 2}, "title 2", "?page=2");
  // history.pushState({childPage: 2}, "title 2", "?page=3");
  // history.pushState({childPage: 2}, "title 2", "?page=4");
  // return

  // history.pushState({page: 1}, "title 1", "?page=1");
  // history.pushState({page: 2}, "title 2", "?page=2#aaa");
  // history.pushState({page: 3}, "title 2", "?page=3#bbb");
  // history.pushState({page: 4}, "title 2", "?page=4#test");
  // history.replaceState({page: 5}, "title 3", "?page=5");
  // console.log(location.href);
  // history.back();
  // history.go(2);

  // console.log(window.addEventListener);

  setTimeout(() => {
    // history.back()

    return
    let stateObj = {
      foo: "bar",
    };

    history.pushState(stateObj, "page 2", "bar");

    // history.go(-1)
    setTimeout(() => {
      history.replaceState(stateObj, "page 3", "bar2");
    }, 1500)

  }, 1500)
}, 2000)

// console.log(location);
// console.log(document.location.href);
// console.log(history);


// console.log(__TI_APP__.broadcast);

// console.log(Symbol.prototype[Symbol.toPrimitive]);
// console.log(window,top,self,frames,globalThis,parent);
// console.log(document);


// console.log(script1.getInnerHTML());
// console.log(script1.innerHTML);
// console.log(script1.textContent);

// Result (as a string): "abc  def"

// document.body.append(div1, div2)

// console.log(eval('3333'));

// console.log(Function.prototype.apply.call.call);

// setTimeout(()=>{
//   console.log(window.Vue);
// },2000)

// console.log(window.Function.prototype.apply.call);
// Function.prototype.apply.call(()=>{})

// console.log(window,top,parent,self,frames);


const url = 'https://bird.limestart.cn/cache/bing.json';
// fetch(url, {
//     // cache: 'force-cache'
//   headers : {
//     Referer:'https://limestart.cn/'
//   }
//   }
// ).then(resp => resp.text()).then(res => {
//   console.log(res);
// })


// setTimeout(() => {
//   console.log(window);
//   fetch('module/module.js')
//
//
// },1000)









