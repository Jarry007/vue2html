import Vue from 'vue'
import App from './App.vue'
import './assets/style.css'
import './assets/vivify.min.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


