import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/account-table'
        },
        {
            path: '/account-table',
            name: 'AccountTable',
            component: () => import('../pages/account-table/index.vue'),
        },
        {
            path: '/statistics',
            name: 'statistics',
            component: () => import('../pages/statistics/index.vue'),
        },
    ],
})