const APIs = importAllModule(require.context('../api', true, /\.api.js$/), /\.api.js$/g);

// TODO: 后续要加上http的封装，请求和响应拦截器
import axios from "axios";
export default (path, params) => {
  const pathArr = path.split('/')
  pathArr.shift()
  const moduleName = pathArr[0]
  const interfaceName = pathArr[1]

  return new Proxy(APIs[moduleName], {
    get(target) {
      const { method, url } = target[interfaceName]

      let completeUrl = `${process.env.VUE_APP_API_PREFIX}/${url}`
      switch (method) {
        case 'GET': 
          return axios.get(completeUrl, {params})
        case 'POST':
          return axios.post(completeUrl, params)   
      }
    }
  })
}

function importAllModule(context, reg) {
  let maps = {}
  context.keys().forEach((file) => {
    const moduleArr = file.split('/')
    moduleArr.shift()

    const name = moduleArr.join('.').replace(reg, '').split('-').reduce((str, word) => {
      return str += (word.charAt(0).toUpperCase() + word.slice(1))
    }, '')

    maps[name] = context(file).default
  })

  return maps
}
