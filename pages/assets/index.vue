<template>
	<view>
		<view class="asset-total">
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
		<uni-group class="group" v-for="list in accountLists" :key="list.id">
			<template #title>
				<view class="group__title">{{list.name}} ({{list.total}}¥)</view>
			</template>
			<uni-list>
				<uni-list-item class="list-item" v-for="subList in list.children" :key="subList._id" link
					:to="'/pages/assets/detail?id='+subList._id">
					<template #body>
						<view class="list-item__body">
							<view class="list-item__body-title">
								<text>{{subList.name}}</text>
							</view>
							<view class="list-item__body-text">
								{{subList.remarks}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer primary">
							<text :class="subList.isProfit? 'success' : 'danger'">{{subList.percentage}}%</text>
							<text style="margin-left: 18px;">{{subList.amount}}¥</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-group>
		<uni-fab :horizontal="'right'" :popMenu="false" @fabClick="fabClick"></uni-fab>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command
	const accountDB = 'account';
	export default {
		data() {
			return {
				isSee: 'eye-slash',
				userId: '',
				total: 0,
				cacheTotal: 0,
				fixedAsset: 0,
				cacheFixedAsset: 0,
				floatAsset: 0,
				cacheFloatAsset: 0,
				liabilities: 0,
				cacheLiabilities: 0,
				accountLists: []
			}
		},
		onLoad() {
			this.userId = getApp().globalData.userId
		},
		onShow() {
			this.getAccountLists()
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
			getAccountLists() {
				db.collection(accountDB).where({
					userId: dbCmd.eq(this.userId)
				}).orderBy('updateDate desc').get().then(res => {
					this.accountLists = [];
					this.total = 0;
					this.fixedAsset = 0;
					this.floatAsset = 0;
					this.liabilities = 0;
					if (res.result.data.length) {
						const typeTolist = new Map();
						res.result.data.forEach(item => {
							const hasExt = typeTolist.get(item.type.field)
							if (hasExt) {
								hasExt.total = this.$NP.plus(hasExt.total, item.amount);
								hasExt.children.push(item)
							} else {
								const newList = {
									id: item.type._id,
									name: item.type.name,
									field: item.type.field,
									total: item.amount,
									children: [item]
								}
								typeTolist.set(item.type.field, newList)
							}

							switch (item.type.relationType) {
								case 'fixedAsset':
									this.fixedAsset = this.$NP.plus(this.fixedAsset, item.amount);
									break;
								case 'floatAsset':
									this.floatAsset = this.$NP.plus(this.floatAsset, item.amount);
									break;
								case 'liabilities':
									this.liabilities = this.$NP.plus(this.liabilities, item.amount);
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
						typeTolist.forEach(item => {
							this.accountLists.push(item)
						})
					}
				})
			},
			fabClick() {
				uni.navigateTo({
					url: '/pages/assets/add'
				})
			}
		},
	}
</script>

<style lang="scss" scoped></style>
