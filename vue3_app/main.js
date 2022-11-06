import App from './App'
import store from './store'
import $http from './common/requestConfig.ts'
import uView from './uni_modules/vk-uview-ui';
import AppUtils from './common/app-utils.js';
import Page from '@/components/GlobalPage.vue'; 


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$adpid = "1111111111"
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}
Vue.component('page', Page)
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.use(uView)
	app.component("page", Page);
	app.config.globalProperties.$adpid = "1111111111"
	app.config.globalProperties.$backgroundAudioData = {
		playing: false,
		playTime: 0,
		formatedPlayTime: '00:00:00'
	}
	app.config.globalProperties.$http = $http;
	app.config.globalProperties.$appUtils = AppUtils;
	return {
		app
	}
}
// #endif
