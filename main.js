
import App from './App'
import VueI18n from 'vue-i18n';   //引入npm下载模块
import messages from 'lang/index.js'  //引入自定义语言文件



// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

// #ifdef H5
import "@/common/pc.js";
// #endif
// const vconsole = require('vconsole')
//     Vue.prototype.$vconsole = new vconsole()

Vue.use(VueI18n);    //全局使用
const i18n = new VueI18n({  
  silentFallbackWarn:true,
  locale: uni.getStorageSync('locale') || 'zh-US',  // 默认选择的语言
  messages 
});

Vue.prototype._i18n = i18n;   //作为属性挂载

Vue.config.productionTip = false
App.mpType = 'app'

import api from "common/api.js" //接口api
Vue.prototype.$api = api 

const app = new Vue({
	i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif