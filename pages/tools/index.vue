<template>
	<view class="tools">
		<uni-grid :column="3" :square="false">
			<uni-grid-item v-for="list in toolLists" :key="list">
				<uni-icons type="gear" size="28"></uni-icons>
				<text class="text">{{list.text}}</text>
			</uni-grid-item>
		</uni-grid>
		<no-data v-if="!toolLists.length"></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				toolLists: [{
					text: '类型'
				}]
			}
		},
		created() {},
		mounted() {},
		methods: {},
	}
</script>

<style lang="scss" scoped>
	.tools {
		padding: 16px;

		::v-deep .uni-grid-item--border-top {
			padding: 16px 0;
			text-align: center;
		}
	}
</style>
