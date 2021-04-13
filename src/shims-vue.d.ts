/* eslint-disable */
import Vue from 'vue';

declare module 'vue/types/vue' {
  import { AxiosStatic } from 'axios';

  interface Vue {
    $axios: AxiosStatic;
  }
  interface VueConstructor {
    axios: AxiosStatic;
  }
}
