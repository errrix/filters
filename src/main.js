import Vue from 'vue';
import 'nouislider/distribute/nouislider.min.css';
import './styles/general.scss';
import 'vue-select/dist/vue-select.css';
import vSelect from 'vue-select';
import App from './App.vue';
import router from './router';
import store from './store';

vSelect.props.components.default = () => ({
  OpenIndicator: {
    render: createElement => createElement('span'),
  },
});

Vue.config.productionTip = false;
Vue.component('v-select', vSelect);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
