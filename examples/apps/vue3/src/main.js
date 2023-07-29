import {createApp} from 'vue'
import './style.css'
import App from './App'
import router from './router'

const vueApp = createApp(App)
vueApp.use(router)
vueApp.mount('#app')
//----------------------------------------------------------
console.log(location);
//
// setTimeout(() => {
//   // console.log(window.__TIYI_LOCATION__.hostname);
//   // document.domain = window.__TIYI_LOCATION__.hostname
// }, 1000)

const funcEv = (ev) => {
  // console.log('child', ev,'path',ev.path,'composedPath',ev.composedPath());
  // console.log(ev,ev.srcElement,ev.currentTarget,ev.target);
  // console.log(this);
}

document.addEventListener('click', funcEv)


// history.replaceState(null, '', '#test2')
// history.pushState(null, '', '#test1')

// document.addEventListener('touchstart', funcEv)

// document.onmousemove = (ev)=>{
//   console.log(ev.target)
// }

// console.log(document.querySelectorAll('#app'));

setTimeout(() => {
  // document.removeEventListener('click', funcEv)
}, 3000)



