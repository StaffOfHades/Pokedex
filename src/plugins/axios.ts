import axios from 'axios';

import Vue from 'vue';

// Add global axios
Vue.axios = axios;

// Add an instance axios
Vue.prototype.$axios = axios;
