/** 清除执行某个文件夹下ts编译后的所有js文件，手残无tsconfig配置下运行tsc产生编译产物，搞一个防止万一,
 *  使用该脚本前提是所有包都必须使用ts创建,运行脚本 node scripts/cleanJsFiles.js
 * */


import {globSync} from 'glob'
import {basename, dirname, join} from 'node:path'
import {rimrafSync} from 'rimraf'

//--------------------------------------------Config---------------------------------------------------
const isDeleteFile = true   // 是否立即删除文件
const globalExclude = ['node_modules']  // 和所有的packages中的excludes合并，作用域所有指定文件夹中

/**
 *  * @typedef {Object} PackagesConfig
 *  * @property {string} base - 文件夹名
 *  * @property {Array} excludes - 排除列表
 * */
const packages /* 删除列表路径里面所有的ts编译产物js文件 */ = [
  {
    base: 'packages/tiyi-types',
    excludes: ['node_modules']
  },
  {
    base: 'packages/tiyi',
  },
  {
    base: 'packages/tiyi-core',
  },
  {
    base: 'packages/tiyi-core-yang',
  },
  {
    base: 'packages/tiyi-core-yin',
  },
  {
    base: 'packages/tiyi-share',
  },
  {
    base: 'packages/tiyi-core-history',
  },
]
//------------------------------------------------------------------------------------------------------
packages./*去除空内容*/filter(Boolean).forEach(({base: relativePackPath, excludes = []}) => {
  if (!relativePackPath && !excludes.length) return
  const allExcludesPath = globalExclude.concat(excludes).filter(Boolean).map(item => join(relativePackPath, item))
  let files = globSync(join(relativePackPath, '**/*.js'))
  let tsFiles = globSync(join(relativePackPath, '**/', "{*.ts,*.tsx}"))
  files = files.filter(path => {
    let isFilter = true   // 在没有找到源文件之前默认忽略掉
    //--------------------------------
    for (let i = 0; i < allExcludesPath.length; i++) {
      const excludePath = allExcludesPath[i];
      if (path.startsWith(excludePath)) return false  // 如果在exclude列表，则直接过滤掉
    }
    //--------------------------------
    for (let i = 0; i < tsFiles.length; i++) {  // 经过glob，tsFiles必然是ts,tsx后缀的
      const tsPath = tsFiles[i];
      if (dirname(path) !== dirname(tsPath)) continue   // 不在同一个目录下忽略
      const jsFileName = removeSuffix(basename(path))
      const tsFileName = removeSuffix(basename(tsPath))
      if (jsFileName === tsFileName) {   // 文件名相等说明存在tsc编译前的源文件(ts,tsx)，表明删除同名js是安全的
        isFilter = false  // 找到了源文件不过滤
      }
    }
    return !isFilter
  })
  if (isDeleteFile) {
    files.forEach(deletePath => {
      rimrafSync(deletePath)
      console.log('remove', deletePath)
    })
  }
})


function removeSuffix(path) {
  const arr = path.split('.')
  if (arr.length > 1) arr.pop()
  return arr.join()
}
