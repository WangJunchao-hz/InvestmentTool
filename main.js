import Vue from 'vue'
import App from './App'
import {
	evaluate,
	format
} from 'mathjs'
Vue.prototype.$evaluate = function(val) {
	return Number(format(evaluate(val), {
		precision: 16
	}))
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
