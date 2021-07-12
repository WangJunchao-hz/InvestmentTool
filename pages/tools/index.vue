<template>
	<view class="tools">
		<uni-grid :column="3" :square="false">
		    <uni-grid-item class="tool-grid-item">
		        <text class="text">文本</text>
		    </uni-grid-item>
		    <uni-grid-item class="tool-grid-item">
		        <text class="text">文本</text>
		    </uni-grid-item>
		    <uni-grid-item class="tool-grid-item">
		        <text class="text">文本</text>
		    </uni-grid-item>
			<uni-grid-item class="tool-grid-item">
			    <text class="text">文本</text>
			</uni-grid-item>
			<uni-grid-item class="tool-grid-item">
			    <text class="text">文本</text>
			</uni-grid-item>
		</uni-grid>
		<no-data></no-data>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	},
	created(){},
	mounted(){},
	methods: {},
}
</script>

<style lang="scss" scoped>
	.tools{
		padding: 16px;
		.tool-grid-item{
			text-align: center;
		}
	}
</style>
