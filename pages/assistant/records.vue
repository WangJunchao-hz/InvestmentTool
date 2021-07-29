<template>
	<view class="steps">
		<view class="steps__text-container">
			<view class="steps__text normal" v-for="(item,i) in recordLists" :key="item._id">
				<view class="steps__text--item">
					<text class="steps__text--item-text" :class="item.opType === 'buy' ? 'danger' : 'success'">
						{{item.opType === 'buy' ? '买入' : '卖出'}}
					</text>
					<text
						class="steps__text--item-text">金额：{{item.opType === 'buy' ? item.buyAmount : item.sellAmount}}</text>
					<view class="steps__text--item-text primary"
						style="display: inline-flex;justify-content: space-between;">
						<text>{{item.opType === 'buy' ? '仓位：'+item.position : '盈亏：'+item.percentage+'%'}}</text>
						<uni-icons v-if="i===0" type="trash" size="18" color="#909399" @click="deleteItem(item._id)">
						</uni-icons>
					</view>
				</view>
				<view class="steps__text--item" style="margin-top: 6px;font-size: 14px;">
					<text style="width: 50%;" v-if="item.opType === 'buy'" class="primary">
						亏损 {{item.targetPercent}}% 加仓
					</text>
					<text style="width: 50%;" v-else
						:class="item.isProfit ? 'success' : 'danger'">盈亏额：{{item.profitAdnLoss}}</text>
					<uni-dateformat class="info" style="width: 50%;" :date="item.updateDate" />
				</view>
			</view>
		</view>
		<view class="steps__container">
			<view class="steps__line-item" v-for="item in recordLists" :key="item._id">
				<view class="steps__line-item--before" :class="{'active':item.opType === 'sell'}"></view>
				<view class="steps__line-item--circle" v-if="item.opType === 'buy'"></view>
				<view class="steps__line-item--check" v-else>
					<uni-icons type="checkbox-filled" color="#67C23A" size="14"></uni-icons>
				</view>
				<view class="steps__line-item--after" :class="{'active':item.opType === 'sell'}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const dbCmd = db.command;
	const plan = 'plan';
	const planDetailsDB = 'planDetails';
	const recordsDB = 'detailRecords';
	export default {
		data() {
			return {
				planId: '',
				recordLists: [],
			}
		},
		onLoad(op) {
			this.planId = op.id;
		},
		onShow() {
			this.getRecordLists()
		},
		methods: {
			getRecordLists() {
				uni.showLoading({
					mask: true
				})
				db.collection(recordsDB).where({
					planId: dbCmd.eq(this.planId)
				}).orderBy('updateDate desc').get().then(res => {
					if (res.result.data.length) {
						this.recordLists = res.result.data;
					}
				}).finally(() => {
					uni.hideLoading();
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
							db.collection(recordsDB).where({
								_id: id
							}).remove().then(res => {
								uni.showToast({
									title: '删除成功'
								})
								_this.handleData();
								setTimeout(() => {
									_this.getRecordLists();
								}, 500)
							}).catch(err => {
								uni.showModal({
									content: err.message || '删除失败',
									showCancel: false
								})
							}).finally(() => {
								uni.hideLoading();
							})
						}
					}
				});
			},
			handleData() {
				const delItem = this.recordLists[0];
				const time = new Date().getTime();
				let params = {
					opType: '',
					buyAmount: 0,
					onceBuyAmount: 0,
					totalBuyAmount: 0,
					updateDate: time
				};
				if (this.recordLists.length > 1) {
					const last = this.recordLists[1];
					params = {
						...last,
						updateDate: time
					}
				}
				db.collection(planDetailsDB).where({
					planId: this.planId
				}).update(params);
				db.collection(plan).where({
					_id: this.planId
				}).update({
					isTotalProfit: params.isTotalProfit || 0,
					preAdvise: params.preAdvise || 1,
					totalPercentage: params.totalPercentage || 0,
					opType: params.opType,
					updateDate: params.updateDate
				});
			}
		},
	}
</script>

<style lang="scss" scoped></style>
