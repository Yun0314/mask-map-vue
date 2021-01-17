import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'
window.axios = require("axios");
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// import example from './module-example'
import common from './modules/common'
import map from './modules/map'

export default function ( /* { ssrContext } */ ) {
  const Store = new Vuex.Store({
    modules: {
      // example
      common,
      map
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
