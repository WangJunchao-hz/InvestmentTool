<template>
	<view>
		<uni-fab :pattern="pattern" :horizontal="'right'" :content="fastNav" @trigger="fabTrigger"></uni-fab>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pattern: {
					color: "#303133",
					buttonColor: "#007aff"
				},
				fastNav: [{
					iconPath: "/static/images/zhushou.png",
					selectedIconPath: "/static/images/zhushou-active.png",
					text: "计划",
					active: false,
					path: '/pages/assistant/add/index'
				}, {
					iconPath: "/static/images/zichan.png",
					selectedIconPath: "/static/images/zichan-active.png",
					text: "资产",
					active: false,
					path: '/pages/assets/add/index'
				}, {
					iconPath: "/static/images/gongju.png",
					selectedIconPath: "/static/images/gongju-active.png",
					text: "工具",
					active: false,
					path: '/pages/tools/add/index'
				}]
			}
		},
		created() {},
		mounted() {},
		methods: {
			fabTrigger(val) {
				this.fastNav[val.index].active = !this.fastNav[val.index].active
				if (this.fastNav[val.index].active && this.fastNav[val.index].path) {
					uni.navigateTo({
						url: this.fastNav[val.index].path
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>

</style>
