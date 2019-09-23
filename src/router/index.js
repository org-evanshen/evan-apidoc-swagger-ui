import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home';
import ApiList from '../views/ApiList';
import ApiDetail from '../views/ApiDetail';
import ApiEnum from '../views/ApiEnum';
import ApiFunction from '../views/ApiFunction';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/enums',component: ApiEnum},
        {path: '/functions',component: ApiFunction},
        {
            path: '/',component: Home,
            children: [
                {
                    path: ':serviceId/:moduleName',component: ApiList,
                    children:[
                        {path: ':apiId',component: ApiDetail}
                    ]
                }
            ]
        }
    ]
});

