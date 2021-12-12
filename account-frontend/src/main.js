import Vue from 'vue';
import App from './App.vue';
import router from '@/router/index';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

import {
  deVal
} from '@/utils/common';
Vue.filter('deVal', deVal);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')