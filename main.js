import Vue from 'vue'
import App from './App'
import NP from 'number-precision'
// NP.strip(num)         // strip a number to nearest right number
// NP.plus(num1, num2, num3, ...)   // addition, num + num2 + num3, two numbers is required at least.
// NP.minus(num1, num2, num3, ...)  // subtraction, num1 - num2 - num3
// NP.times(num1, num2, num3, ...)  // multiplication, num1 * num2 * num3
// NP.divide(num1, num2, num3, ...) // division, num1 / num2 / num3
// NP.round(num, ratio)  // round a number based on ratio
Vue.prototype.$NP = NP;
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
