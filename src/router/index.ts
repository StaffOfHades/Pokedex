import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import PokemonCatalog from '../views/PokemonCatalog.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Catalog',
    component: PokemonCatalog,
  },
  {
    path: '/pokemon/:id',
    name: 'Entry',
    // route level code-splitting
    // this generates a separate chunk (entry.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "entry" */ '../views/PokemonEntry.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    // this generates a separate chunk (profile.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
