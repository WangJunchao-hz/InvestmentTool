<script>
	import {
		EventBus
	} from './tools/event-bus.js'
	export default {
		globalData: {
			userId: ''
		},
		onLaunch() {
			console.log('App Launch')
			const _this = this
			// 登录处理逻辑
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					_this.doLogin(res.provider)
				},
				fail(err) {
					console.error(err);
					_this.doLogin(['weixin'])
				}
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			doLogin(provider) {
				const _this = this
				if (provider.indexOf('weixin') !== -1) {
					uni.checkSession({
						success(res) {
							console.info(res);
							_this.getUserInfo('weixin')
						},
						fail(err) {
							console.error(err);
							uni.login({
								provider: 'weixin',
								success: function(res) {
									console.info('登录成功');
									_this.getUserInfo('weixin', res.code)
								},
								fail(err) {
									console.error("登录失败", err);
									uni.showToast({
										title: "登录失败",
										icon: "none"
									})
								}
							});
						}
					})
				}
			},
			getUserInfo(provider, code) {
				const _this = this
				if (code) {
					uni.request({
						url: `https://a66382c2-33a3-4481-ac46-85f29505c5fe.bspapp.com/http/login?code=${code}`,
						success(res) {
							console.log(res);
						},
						fail(err) {
							console.error(err);
							uni.showToast({
								title: "获取用户信息失败11:" + JSON.stringify(err),
								icon: "none"
							})
						}
					})
					uniCloud.callFunction({
						name: "login",
						data: {
							code
						}
					}).then(res => {
						console.log(res);
						if (res && res.result && res.result.data) {
							const data = res.result.data;
							uni.setStorage({
								key: 'openid',
								data: data.openid,
								success() {
									_this.initApp(data.openid);
									uni.getUserInfo({
										provider,
										success(res1) {
											uniCloud.database().collection('user').add({
												openid: data.openid,
												userInfo: res1.userInfo
											})
										}
									})
								}
							});
						}
					}).catch(err => {
						console.error(err)
						uni.showToast({
							title: "获取用户信息失败:" + JSON.stringify(err),
							icon: "none"
						})
					});
				} else {
					uni.getStorage({
						key: 'openid',
						success: function(res) {
							_this.initApp(res.data)
						},
						fail(err) {
							console.error(err);
							uni.login({
								provider: 'weixin',
								success: function(res) {
									console.info('登录成功');
									_this.getUserInfo('weixin', res.code)
								},
								fail(err) {
									console.error("登录失败", err);
									uni.showToast({
										title: "登录失败",
										icon: "none"
									})
								}
							});
						}
					});
				}
			},
			initApp(openid) {
				getApp().globalData.userId = openid
				EventBus.$emit('AppReady', openid)
			}
		}
	}
</script>

<style lang="scss">
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

	.group {
		&__title {
			display: flex;
			align-items: center;
			padding-left: 15px;
			color: #303133;
			font-size: 16px;

			&::before {
				content: '';
				margin-right: 8px;
				display: inline-block;
				width: 2px;
				height: 16px;
				background-color: #409EFF;
			}
		}

		.uni-group__content {
			padding: 15px 0 !important;
		}
	}

	.grid-item-box {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
		color: #303133;
	}

	.success {
		color: #67C23A;
	}

	.warning {
		color: #E6A23C;
	}

	.danger {
		color: #F56C6C;
	}

	.info {
		color: #909399;
	}

	.primary {
		color: #409EFF;
	}

	.normal {
		color: #303133;
	}
</style>
