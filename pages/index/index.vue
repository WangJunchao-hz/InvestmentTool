<template>
	<view>
		<view v-if="indexData" class="asset-total">
			<view class="part1">
				<view style="display: flex; justify-content: center; align-items: center;">
					<text style="margin-right: 6px;">资产汇总</text>
					<uni-icons @click="switchSee" :type="isSee" color="#fff"></uni-icons>
				</view>
				<text class="amount">{{total}}</text>
			</view>
			<view class="part2">
				<view>
					<text>固定资产</text>
					<text class="amount">{{fixedAsset}}</text>
				</view>
				<view>
					<text>浮动资产</text>
					<text class="amount">{{floatAsset}}</text>
				</view>
				<view>
					<text>负债</text>
					<text class="amount">{{liabilities}}</text>
				</view>
			</view>
		</view>
		<uni-notice-bar v-if="indexData" single="true" :text="planText"></uni-notice-bar>
		<uni-group v-if="indexData" class="group" v-for="list in planLists" :key="list.id">
			<template #title>
				<view class="group__title">{{list.name}} ({{list.children.length}})</view>
			</template>
			<uni-list>
				<uni-list-item class="list-item" v-for="subList in list.children" :key="subList._id" link
					:to="'/pages/assistant/detail?id='+subList._id">
					<template #body>
						<view class="list-item__body">
							<view class="list-item__body-title">
								<text>
									<text class="buy-long" v-if="subList.operateType&&subList.operateType.
									field === 'buyLong'">多</text>
									<text class="sell-short" v-else-if="subList.operateType&&subList.operateType.
									field === 'sellShort'">空</text>
									{{subList.planName}}
								</text>
							</view>
							<view class="list-item__body-text">
								{{subList.remarks}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer primary">
							<text :class="subList.isProfit? 'success' : 'danger'">{{subList.cumulativeNum || 0}}</text>
							<text v-if="subList.opType === 'sell'" style="margin-left: 18px;">
								加仓价: {{subList.increasePrice || 0}}</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-group>
		<no-data v-if="!planLists.length">
			<template #text>
				优秀的猎人总是在等待时机，一击必中！
			</template>
		</no-data>
		<no-data v-if="nodata"></no-data>
		<uni-fab :pattern="pattern" :horizontal="'right'" :content="fastNav" @trigger="fabTrigger"></uni-fab>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command
	const planDB = 'plan';
	const accountDB = 'account';
	export default {
		data() {
			return {
				isSee: 'eye-slash',
				nodata: false,
				indexData: false,
				userId: '',
				total: 0,
				cacheTotal: 0,
				fixedAsset: 0,
				cacheFixedAsset: 0,
				floatAsset: 0,
				cacheFloatAsset: 0,
				liabilities: 0,
				cacheLiabilities: 0,
				planLists: [],
				planText: '暂无进行中的计划',
				pattern: {
					color: "#303133",
					buttonColor: "#007aff"
				},
				fastNav: [{
					iconPath: "/static/images/zhushou.png",
					selectedIconPath: "/static/images/zhushou-active.png",
					text: "计划",
					active: false,
					path: '/pages/assistant/add'
				}, {
					iconPath: "/static/images/zichan.png",
					selectedIconPath: "/static/images/zichan-active.png",
					text: "资产",
					active: false,
					path: '/pages/assets/add'
				}]
			}
		},
		onReady() {
			const timer = setInterval(() => {
				this.userId = getApp().globalData.userId
				if (this.userId) {
					this.initPage();
					clearInterval(timer);
				}
			}, 8);
		},
		onShow() {
			if (this.userId) {
				this.initPage();
			}
		},
		methods: {
			switchSee() {
				if (this.isSee === 'eye-slash') {
					this.isSee = 'eye';
					this.cacheTotal = this.total;
					this.cacheFixedAsset = this.fixedAsset;
					this.cacheFloatAsset = this.floatAsset;
					this.cacheLiabilities = this.liabilities;
					this.total = '******';
					this.fixedAsset = '******';
					this.floatAsset = '******';
					this.liabilities = '******';
				} else {
					this.isSee = 'eye-slash';
					this.total = this.cacheTotal;
					this.fixedAsset = this.cacheFixedAsset;
					this.floatAsset = this.cacheFloatAsset;
					this.liabilities = this.cacheLiabilities;
				}
				uni.setStorage({
					key: 'isSee',
					data: this.isSee
				})
			},
			initPage() {
				uni.showLoading({
					mask: true
				})
				Promise.all([this.getAccountLists(), this.getPlanLists()]).then(res => {
					if ((res[0] && res[0].length) || (res[1] && res[1].length)) {
						this.indexData = true;
						this.nodata = false;
					} else {
						this.nodata = true;
						this.indexData = false;
					}
				}).catch(err => {
					console.error(err);
					uni.showModal({
						content: '请求失败！',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			getAccountLists() {
				return new Promise((resolve, reject) => {
					db.collection(accountDB).where({
						userId: dbCmd.eq(this.userId)
					}).get().then(res => {
						resolve(res.result.data);
						this.total = 0;
						this.fixedAsset = 0;
						this.floatAsset = 0;
						this.liabilities = 0;
						if (res.result.data.length) {
							res.result.data.forEach(item => {
								switch (item.type.relationType) {
									case 'fixedAsset':
										this.fixedAsset = this.$NP.plus(this.fixedAsset, item
											.amount);
										break;
									case 'floatAsset':
										this.floatAsset = this.$NP.plus(this.floatAsset, item
											.amount);
										break;
									case 'liabilities':
										this.liabilities = this.$NP.plus(this.liabilities, item
											.amount);
										break;
								}
							})
							const a = this.$NP.plus(this.fixedAsset, this.floatAsset);
							this.total = this.$NP.minus(a, this.liabilities);
							this.total = this.total + '¥';
							this.fixedAsset = this.fixedAsset + '¥';
							this.floatAsset = this.floatAsset + '¥';
							this.liabilities = this.liabilities + '¥';
							const _this = this;
							uni.getStorage({
								key: 'isSee',
								success(res) {
									_this.isSee = res.data;
									if (res.data === 'eye') {
										_this.cacheTotal = _this.total;
										_this.cacheFixedAsset = _this.fixedAsset;
										_this.cacheFloatAsset = _this.floatAsset;
										_this.cacheLiabilities = _this.liabilities;
										_this.total = '******';
										_this.fixedAsset = '******';
										_this.floatAsset = '******';
										_this.liabilities = '******';
									}
								}
							})
						}
					}).catch(err => {
						reject(err);
					});
				});
			},
			getPlanLists() {
				return new Promise((resolve, reject) => {
					db.collection(planDB).where({
						userId: dbCmd.eq(this.userId),
						opType: 'buy',
					}).orderBy('updateDate desc').get().then(res => {
						resolve(res.result.data);
						this.planLists = [];
						this.planText = '暂无进行中的计划';
						if (res.result.data.length) {
							this.planText = `${res.result.data.length} 条计划进行中`;
							const typeTolist = new Map();
							res.result.data.forEach(item => {
								const hasExt = typeTolist.get(item.planType.field)
								if (hasExt) {
									hasExt.children.push(item)
								} else {
									const newList = {
										id: item.planType._id,
										name: item.planType.name,
										field: item.planType.field,
										children: [item]
									}
									typeTolist.set(item.planType.field, newList)
								}
							})
							typeTolist.forEach(item => {
								this.planLists.push(item)
							})
						}
					}).catch(err => {
						reject(err);
					});
				});
			},
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
