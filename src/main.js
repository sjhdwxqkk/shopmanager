import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import axios from 'axios'
//导入字体图标
import './assets/fonts/iconfont.css'

import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器,对应样式，注册为全局组件
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor)

//导入 Nprogress 对应的js和css文件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hh}-${mm}-${ss}`
})

//配置请求的根路径
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//配置拦截器
axios.interceptors.request.use(config => {
  //在request拦截器中展示进度条 Nprogress.start()
  Nprogress.start()
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


// 在response拦截器中隐藏进度条 Nprogress.down()
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
