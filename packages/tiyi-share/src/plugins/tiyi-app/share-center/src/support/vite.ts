/**
 * 测试vite版本4.0.0， 后面再折腾更多适配
 * */

import {createElementTag, isFullUrl, isString, waitFinished} from "tiyi"


function checkViteEnv() {
  let isViteEnv = false
  document.head.querySelectorAll('script').forEach(node => {
    if (node.src.indexOf('@vite/client') && node.type === 'module') isViteEnv = true
  })
  return isViteEnv
}


/** 加载vite下本地css相对路径资源   */
export async function viteCssSheetLoader(url: string) {
  if (!isViteEnv || isFullUrl(url) /* 如果是绝对地址则能直接获得css而不是script */) return null
  let sheet
  const linkManage = createElementTag('link')
    .attr('rel', 'stylesheet')
    .attr('href', url, isString)

  // linkManage.appendTo(document.head)
  await waitFinished(() => linkManage.el.sheet)
  sheet = linkManage.el.sheet
  // linkManage.remove(document.head)
  console.log(sheet);
  return sheet
}


export let isViteEnv = checkViteEnv()/* vite  */
