<template>
	<view class="no-data">
		<text class="iconfont">&#xe642;</text>
		<slot name="text">
			<view>暂无数据</view>
		</slot>
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
		text-align: center;
		color: #909399;
		font-size: 18px;
		background-color: #fff;

		.iconfont {
			font-size: 88px;
		}
	}
</style>
