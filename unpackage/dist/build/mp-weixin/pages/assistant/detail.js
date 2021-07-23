(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/assistant/detail"],{"30d1":function(t,n,e){"use strict";(function(t){e("2c9b");o(e("66fd"));var n=o(e("b717"));function o(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},"5c1f":function(t,n,e){"use strict";(function(t,o){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=e("8585");function a(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,o)}return e}function u(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?a(Object(e),!0).forEach((function(n){r(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):a(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}function r(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var s=t.database(),l=s.command,c="planDetails",d="detailRecords";function f(t){var n={};for(var e in i.validator)t.indexOf(e)>-1&&(n[e]=i.validator[e]);return n}var m={data:function(){var t={buyAmount:"",sellAmount:"",targetPercent:10,position:1};return{planId:"",opType:1,formData:t,detailData:"",recordLists:[],rules:u({},f(Object.keys(t))),nodata:!1}},onLoad:function(t){this.planId=t.id},onShow:function(){this.getPlanDetails()},onReady:function(){this.$refs.form.setRules(this.rules)},methods:{getPlanDetails:function(){var t=this;s.collection(c).where({planId:l.eq(this.planId)}).get().then((function(n){n.result.data.length?(t.detailData=n.result.data[0],t.getRecordLists(),t.nodata=!1):t.nodata=!0}))},getRecordLists:function(){var t=this;s.collection(d).where({planId:l.eq(this.planId)}).limit(9).orderBy("updateDate desc").get().then((function(n){n.result.data.length&&(t.recordLists=n.result.data)}))},addRecord:function(t){s.collection(d).add(t)},opClick:function(t){this.opType=t,this.$refs.popup.open()},cancle:function(){this.$refs.popup.close()},submit:function(){var t=this;o.showLoading({mask:!0}),this.$refs.form.validate().then((function(n){t.submitForm(n)})).catch((function(){o.hideLoading()}))},submitForm:function(){this.detailData&&this.detailData._id?this.updateDetails():this.addDetails()},addDetails:function(){var t=this;s.collection(c).add(this.getParams()).then((function(n){o.showToast({icon:"none",title:"新增成功"}),t.getOpenerEventChannel().emit("refreshData"),t.resetForm(),t.cancle(),setTimeout((function(){t.getPlanDetails()}),500)})).catch((function(t){o.showModal({content:t.message||"请求服务失败",showCancel:!1})})).finally((function(){o.hideLoading()}))},updateDetails:function(){var t=this;s.collection(c).where({_id:this.detailData._id}).update(this.getParams()).then((function(n){o.showToast({icon:"none",title:"更新成功"}),t.getOpenerEventChannel().emit("refreshData"),t.resetForm(),t.cancle(),setTimeout((function(){t.getPlanDetails()}),500)})).catch((function(t){o.showModal({content:t.message||"请求服务失败",showCancel:!1})})).finally((function(){o.hideLoading()}))},getParams:function(){var t=(new Date).getTime(),n=this.detailData?this.detailData:{buyAmount:0,sellAmount:0,position:this.formData.position,targetPercent:this.formData.targetPercent,totalBuyAmount:0,totalSellAmount:0,isProfit:!0,isOnceProfit:!0,isTotalProfit:!0,profitAdnLoss:0,onceProfitAdnLoss:0,totalProfitAdnLoss:0,percentage:0,oncePercentage:0,totalPercentage:0,preAdvise:"",isComplete:!1,createDate:t},e=u(u({},n),{},{planId:this.planId,opType:1===this.opType?"buy":"sell",updateDate:t});switch(this.formData.buyAmount&&(e.buyAmount=Number(this.formData.buyAmount)),this.formData.sellAmount&&(e.sellAmount=Number(this.formData.sellAmount)),1===this.opType&&(e.position=this.formData.position,e.targetPercent=this.formData.targetPercent),this.opType){case 0:this.handleSell(e,n);break;case 1:this.handleBuy(e,n);break}return e&&e._id&&delete e._id,this.addRecord(e),console.log(e),e},handleBuy:function(t,n){n&&n._id?t.totalBuyAmount=this.$evaluate(n.totalBuyAmount+t.buyAmount):t.totalBuyAmount=t.buyAmount},handleSell:function(t,n){t.totalSellAmount=this.$evaluate(n.totalSellAmount+t.sellAmount),t.totalProfitAdnLoss=this.$evaluate(t.totalSellAmount-n.totalBuyAmount),t.isTotalProfit=!(t.totalProfitAdnLoss<0),t.totalPercentage=Number(this.$evaluate(t.totalProfitAdnLoss/n.totalBuyAmount*100).toFixed(2)),t.profitAdnLoss=this.$evaluate(t.sellAmount-n.buyAmount),t.isProfit=!(t.profitAdnLoss<0),t.percentage=Number(this.$evaluate(t.profitAdnLoss/n.buyAmount*100).toFixed(2)),n.onceProfitAdnLoss>0?(t.onceProfitAdnLoss=t.profitAdnLoss,t.oncePercentage=t.percentage):(t.onceProfitAdnLoss=this.$evaluate(n.onceProfitAdnLoss+t.profitAdnLoss),t.oncePercentage=this.$evaluate(n.oncePercentage+t.percentage),t.isComplete=t.onceProfitAdnLoss>0);var e=Math.abs(Math.floor(this.$evaluate(t.oncePercentage/n.targetPercent)));t.preAdvise="下次买入建议加仓".concat(e)},resetForm:function(){this.formData.buyAmount="",this.formData.sellAmount="",this.formData.targetPercent=10,this.formData.position=1}}};n.default=m}).call(this,e("a9ff")["default"],e("543d")["default"])},"5c78":function(t,n,e){"use strict";e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return o}));var o={uniGroup:function(){return e.e("uni_modules/uni-group/components/uni-group/uni-group").then(e.bind(null,"882a"))},uniGrid:function(){return e.e("uni_modules/uni-grid/components/uni-grid/uni-grid").then(e.bind(null,"d806"))},uniGridItem:function(){return e.e("uni_modules/uni-grid/components/uni-grid-item/uni-grid-item").then(e.bind(null,"dbff"))},uniDateformat:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat")]).then(e.bind(null,"5d2e"))},uniIcons:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(e.bind(null,"e446"))},noData:function(){return e.e("components/no-data/no-data").then(e.bind(null,"d7b2"))},uniPopup:function(){return e.e("uni_modules/uni-popup/components/uni-popup/uni-popup").then(e.bind(null,"c252"))},uniForms:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uni-forms/components/uni-forms/uni-forms")]).then(e.bind(null,"4df2"))},uniFormsItem:function(){return e.e("uni_modules/uni-forms/components/uni-forms-item/uni-forms-item").then(e.bind(null,"1b42"))},uniEasyinput:function(){return e.e("uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput").then(e.bind(null,"46c00"))},uniNumberBox:function(){return e.e("uni_modules/uni-number-box/components/uni-number-box/uni-number-box").then(e.bind(null,"7d47"))}},i=function(){var t=this,n=t.$createElement;t._self._c},a=[]},9218:function(t,n,e){},"9ba7":function(t,n,e){"use strict";e.r(n);var o=e("5c1f"),i=e.n(o);for(var a in o)"default"!==a&&function(t){e.d(n,t,(function(){return o[t]}))}(a);n["default"]=i.a},b717:function(t,n,e){"use strict";e.r(n);var o=e("5c78"),i=e("9ba7");for(var a in i)"default"!==a&&function(t){e.d(n,t,(function(){return i[t]}))}(a);e("e1c0");var u,r=e("f0c5"),s=Object(r["a"])(i["default"],o["b"],o["c"],!1,null,"c62a6680",null,!1,o["a"],u);n["default"]=s.exports},e1c0:function(t,n,e){"use strict";var o=e("9218"),i=e.n(o);i.a}},[["30d1","common/runtime","common/vendor"]]]);