import Vue from 'vue';

import ElementUI from 'element-ui';
import App from './App';
import store from './vuex/store';
import router from './router';
import filters from './filter';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/common.scss';
import axios from "./utils/plugins/axios"
import VueAxios from 'vue-axios'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueAxios, axios);

filters(Vue);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    http: {
        headers: {},
    }
});
