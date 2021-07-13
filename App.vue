<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.onTabBarMidButtonTap(() => {
				console.log(111);
				uni.navigateTo({
					url: '/pages/add/index'
				})
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@font-face {
		font-family: 'iconfont';
		/* Project id 2667753 */
		src: url('//at.alicdn.com/t/font_2667753_9javve9llpo.woff2?t=1626170109659') format('woff2'),
			url('//at.alicdn.com/t/font_2667753_9javve9llpo.woff?t=1626170109659') format('woff'),
			url('//at.alicdn.com/t/font_2667753_9javve9llpo.ttf?t=1626170109659') format('truetype');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
