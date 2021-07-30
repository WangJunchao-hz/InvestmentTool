<template>
	<view>
		<uni-group class="group">
			<template #title>
				<view class="group__title">
					<view style="width: 100%;display: flex;justify-content: space-between;padding-right: 15px;">
						<view>
							{{accountInfo.name}} ({{accountInfo.type.name}})
							<uni-icons type="compose" size="18px" style="margin-left: 8px;"
								@click="navJump('/pages/assets/add')"></uni-icons>
						</view>
						<uni-icons type="trash" size="18px" @click="deleteAccount"></uni-icons>
					</view>
				</view>
			</template>
			<uni-list>
				<uni-list-item class="list-item">
					<template #body>
						<view class="list-item__body">
							<view class="list-item__body-title" :class="accountInfo.isProfit ? 'success' : 'danger'">
								余额：{{accountInfo.amount || 0}}
							</view>
							<view class="list-item__body-text">
								{{accountInfo.remarks}}
							</view>
						</view>
					</template>
					<template #footer>
						<view class="list-item__footer">
							<uni-dateformat class="list-item__body-text" :date="accountInfo.updateDate">
							</uni-dateformat>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</uni-group>
		<uni-group class="group">
			<template #title>
				<view class="group__title">
					操作记录
				</view>
			</template>
			<view class="steps">
				<view class="steps__text-container">
					<view class="steps__text normal" v-for="(item,i) in details" :key="item._id">
						<view class="steps__text--item">
							<text class="steps__text--item-text">
								余额：
							</text>
							<text class="steps__text--item-text">{{item.amount}}</text>
							<view class="steps__text--item-text primary"
								style="display: inline-flex;justify-content: space-between;">
								<text :class="item.isProfit ? 'success':'danger'">
									变动 {{item.percentage}}%
								</text>
								<uni-icons v-if="i===0" type="trash" size="18" color="#909399"
									@click="deleteItem(item._id)">
								</uni-icons>
							</view>
						</view>
						<view class="steps__text--item" style="margin-top: 6px;font-size: 14px;">
							<text style="width: 50%;">
								{{item.remarks}}
							</text>
							<uni-dateformat class="info" style="width: 50%;text-align: right;"
								:date="item.updateDate" />
						</view>
					</view>
				</view>
				<view class="steps__container">
					<view class="steps__line-item" v-for="item in details" :key="item._id">
						<view class="steps__line-item--before active"></view>
						<view class="steps__line-item--check">
							<uni-icons type="checkbox-filled" color="#67C23A" size="14"></uni-icons>
						</view>
						<view class="steps__line-item--after active"></view>
					</view>
				</view>
			</view>
		</uni-group>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const accountDB = 'account';
	const accountDetailDB = 'accountDetails';
	export default {
		data() {
			return {
				accountId: '',
				accountInfo: {
					name: '',
					type: {
						name: ''
					}
				},
				details: []
			}
		},
		onLoad(op) {
			this.accountId = op.id;
		},
		onShow() {
			this.getAccount();
			this.getDetails();
		},
		methods: {
			getAccount() {
				db.collection(accountDB).where({
					_id: this.accountId
				}).get().then(res => {
					if (res.result.data.length) {
						this.accountInfo = res.result.data[0];
						// console.log(this.accountInfo);
					}
				});
			},
			getDetails() {
				db.collection(accountDetailDB).where({
					accountId: this.accountId
				}).orderBy('updateDate desc').get().then(res => {
					this.details = [];
					if (res.result.data) {
						this.details = res.result.data;
					}
				})
			},
			navJump(path) {
				uni.navigateTo({
					url: path + '?id=' + this.accountId,
				})
			},
			deleteAccount() {
				const _this = this;
				uni.showModal({
					title: '警告',
					content: '确定删除吗？',
					success(res) {
						if (res.confirm) {
							const p = new Promise((resolve, reject) => {
								const base = db.collection(accountDB);
								base.where({
									_id: _this.accountId
								}).remove().then(() => {
									resolve(true);
								}).catch((err) => {
									reject(err);
								});
							});
							uni.showLoading({
								mask: true
							})
							Promise.all([_this.deleteDetail(), p]).then(res => {
								uni.showToast({
									title: '删除成功'
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 300)
							}).catch(err => {
								uni.showModal({
									content: JSON.stringify(err) || '删除失败',
									showCancel: false
								})
							}).finally(() => {
								uni.hideLoading();
							})
						}
					}
				})
			},
			deleteDetail() {
				return new Promise((resolve, reject) => {
					const base = db.collection(accountDetailDB);
					base.where({
						accountId: this.accountId
					}).get().then(res => {
						if (res.result.data.length) {
							res.result.data.map(async (item) => {
								return await base.where({
									_id: item._id
								}).remove();
							});
						}
						resolve(true);
					}).catch(err => {
						reject(err);
					})
				})
			},
			deleteItem(id) {
				const _this = this;
				uni.showModal({
					title: '警告',
					content: '确定删除吗？',
					success(res) {
						if (res.confirm) {
							uni.showLoading({
								mask: true
							})
							db.collection(accountDetailDB).where({
								_id: id
							}).remove().then(res => {
								uni.showToast({
									title: '删除成功'
								})
								_this.updateAccount();
							}).catch(err => {
								uni.showModal({
									content: JSON.stringify(err) || '删除失败',
									showCancel: false
								})
							}).finally(() => {
								uni.hideLoading();
							});
						}
					}
				})
			},
			updateAccount() {
				const time = new Date().getTime();
				const params = {
					isProfit: true,
					amount: 0,
					lastAmount: 0,
					percentage: 0,
					updateDate: time
				};
				if (this.details.length > 1) {
					const last = this.details[1];
					params.isProfit = last.isProfit;
					params.amount = last.amount;
					params.lastAmount = last.lastAmount;
					params.percentage = last.percentage;
				}
				db.collection(accountDB).where({
					_id: this.accountId
				}).update(params).then(res => {
					this.getAccount();
					this.getDetails();
				})
			}
		},
	}
</script>

<style lang="scss" scoped></style>
