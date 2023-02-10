import './bootstrap';
import {createApp} from 'vue'
import App from './App.vue'
import router from './router/index'

import SendProductForm from './components/SendProductForm'

import VueLazyLoad from 'vue3-lazyload'

createApp(App)
  .use(router)
  .use(VueLazyLoad,
  {
    loading: '/images/preloader.gif',
    error: '/images/error.png'
  })
  .component('send-product-form-component', SendProductForm)
  .mount('#app')
