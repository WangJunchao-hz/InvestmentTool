<template>
	<view class="no-data">
		<text class="iconfont">&#xe600;</text>
		<view>暂无数据</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		created() {},
		mounted() {},
		methods: {},
	}
</script>

<style lang="scss" scoped>
	.no-data {
		padding: 16px;
		width: 100%;
		text-align: center;
		color: #909399;
		font-size: 18px;

		.iconfont {
			font-size: 88px;
		}
	}
</style>
