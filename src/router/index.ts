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
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
