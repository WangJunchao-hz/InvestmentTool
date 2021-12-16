<script>
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
									uni.showModal({
										content: err || '登录失败',
										showCancel: false
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
							if (res.data && res.data.status === 200 && res.data.data) {
								const data = res.data.data;
								uni.getStorage({
									key: 'openid',
									success(res) {
										if (res.data === data.openid) {
											_this.initApp(data.openid);
										} else {
											uni.setStorage({
												key: 'openid',
												data: data.openid,
												success() {
													_this.initApp(data.openid);
													uni.getUserInfo({
														provider,
														success(res1) {
															_this.addUser(data.openid, res1
																.userInfo);
														}
													})
												}
											});
										}
									},
									fail(err) {
										uni.setStorage({
											key: 'openid',
											data: data.openid,
											success() {
												_this.initApp(data.openid);
												uni.getUserInfo({
													provider,
													success(res1) {
														_this.addUser(data.openid, res1
															.userInfo);
													}
												})
											}
										});
									}
								})
							}
						},
						fail(err) {
							console.error(err);
							uni.showModal({
								content: err || '获取用户信息失败',
								showCancel: false
							})
						}
					})
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
									uni.showModal({
										content: err || '登录失败',
										showCancel: false
									})
								}
							});
						}
					});
				}
			},
			initApp(openid) {
				getApp().globalData.userId = openid
			},
			addUser(id, info) {
				const time = new Date().getTime();
				const base = uniCloud.database().collection('user');
				base.where({
					openid: id
				}).get().then(res => {
					if (!res.result.data.length) {
						base.add({
							openid: id,
							userInfo: info,
							createDate: time,
							updateDate: time
						})
					} else {
						base.where({
							openid: id
						}).update({
							userInfo: info,
							updateDate: time
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@font-face {
		font-family: 'iconfont';
		/* Project id 2667753 */
		src: url('//at.alicdn.com/t/font_2667753_2wdb95g8big.woff2?t=1639462601269') format('woff2'),
			url('//at.alicdn.com/t/font_2667753_2wdb95g8big.woff?t=1639462601269') format('woff'),
			url('//at.alicdn.com/t/font_2667753_2wdb95g8big.ttf?t=1639462601269') format('truetype');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	page {
		background-color: #eaedf2;
	}

	.asset-total {
		color: #FFFFFF;
		background-color: #409EFF;

		text {
			display: block;
			text-align: center;
		}

		.part1 {
			padding: 8px 0;

			.amount {
				font-size: 28px;
			}
		}

		.part2 {
			padding: 8px 0;
			display: flex;
			justify-content: space-between;
			background-color: #53a8ff;

			view {
				flex: 1;

				.amount {
					font-size: 18px;
				}
			}
		}
	}

	.group {
		&__title {
			padding-top: 10px;
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

	.list-item {
		&__header {}

		&__body {
			flex: 1;

			&-title {
				padding-right: 18px;
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #303133;
			}

			&-text {
				margin-top: 6px;
				font-size: 12px;
				color: #909399;
			}
		}

		&__footer {
			display: flex;
			align-items: center;
			font-size: 14px;
		}
	}

	.steps {
		display: flex;
		flex-direction: row-reverse;
		background-color: #fff;

		&__text-container {
			display: flex;
			flex-direction: column;
			flex: 1;
		}

		&__container {
			display: inline-flex;
			width: 30px;
			flex-direction: column;
		}

		&__text {
			padding: 6px 15px 6px 0;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: #e5e5e5;
			display: flex;
			flex-direction: column;

			&.active {
				color: #67C23A;
			}

			&--item {
				display: flex;

				&-text {
					width: 42%;
					flex-shrink: 0;

					&:first-child {
						width: 16%;
					}
				}
			}
		}

		&__line-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			align-items: center;
			justify-content: center;

			&:first-child {
				.steps__line-item--before {
					background-color: transparent;
				}
			}

			&--before {
				width: 1px;
				height: 6px;
				background-color: #999;
				transform: translate(0px, -1px);

				&.active {
					background-color: #67C23A;
				}
			}

			&--circle {
				width: 5px;
				height: 5px;
				border-radius: 100px;
				background-color: #999;
				margin: 4px 0px 5px 0px;

				&.active {
					background-color: #67C23A;
				}
			}

			&--check {
				height: 14px;
				line-height: 14px;
				margin: 2px 0px;
			}

			&--after {
				width: 1px;
				background-color: #999;
				flex: 1;
				transform: translate(0px, 1px);

				&.active {
					background-color: #67C23A;
				}
			}
		}
	}

	.buy-long {
		position: relative;
		top: -1px;
		margin-right: 4px;
		display: inline-block;
		padding: 0 4px;
		background-color: rgba(103, 194, 58, 0.18);
		border-radius: 2px;
		color: #67C23A;
		font-size: 11px;
	}

	.sell-short {
		position: relative;
		top: -1px;
		margin-right: 4px;
		display: inline-block;
		padding: 0 4px;
		background-color: rgba(245, 108, 108, 0.18);
		border-radius: 2px;
		color: #F56C6C;
		font-size: 11px;
	}
</style>
