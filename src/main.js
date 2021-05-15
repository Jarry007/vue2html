import Vue from 'vue'
import App from './App.vue'
import './assets/style.css'
import './assets/vivify.min.css'
import {InputNumber,Icon,Button,Loading} from 'element-ui'

Vue.config.productionTip = false

Vue.use(InputNumber)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service


new Vue({
  render: h => h(App),
}).$mount('#app')


