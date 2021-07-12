<template>
	<view class="no-data">
		<icon type="#909399" class="iconfont icon-nodata"></icon>
		<view>暂无数据</view>
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
		font-size: 32px;
		.icon-nodata{
			font-size: 188px;
		}
	}
</style>
