<template>
	<view>
		<view v-if="indexData" class="asset-total">
			<view class="part1">
				<text>资产汇总</text>
				<text class="amount">{{total}}¥</text>
			</view>
			<view class="part2">
				<view>
					<text>固定资产</text>
					<text class="amount">{{fixedAsset}}¥</text>
				</view>
				<view>
					<text>浮动资产</text>
					<text class="amount">{{floatAsset}}¥</text>
				</view>
				<view>
					<text>负债</text>
					<text class="amount">{{liabilities}}¥</text>
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
								<text>{{subList.planName}}</text>
							</view>
							<view class="list-item__body-text">
								{{subList.remarks}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer primary">
							<text
								:class="subList.isTotalProfit? 'success' : 'danger'">{{subList.totalPercentage}}%</text>
							<text v-if="subList.opType === 'sell'" style="margin-left: 18px;">
								建议仓位: {{subList.preAdvise}}</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-group>
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
				nodata: false,
				indexData: false,
				userId: '',
				total: 0,
				fixedAsset: 0,
				floatAsset: 0,
				liabilities: 0,
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
				}, {
					iconPath: "/static/images/gongju.png",
					selectedIconPath: "/static/images/gongju-active.png",
					text: "工具",
					active: false,
					path: '/pages/tools/add'
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
						if (res.result.data.length) {
							this.total = 0;
							this.fixedAsset = 0;
							this.floatAsset = 0;
							this.liabilities = 0;
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
								const a = this.$NP.plus(this.fixedAsset, this.floatAsset);
								this.total = this.$NP.minus(a, this.liabilities);
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
						if (res.result.data.length) {
							this.planText = `${res.result.data.length} 条计划进行中`;
							this.planLists = [];
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
