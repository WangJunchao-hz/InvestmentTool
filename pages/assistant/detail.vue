<template>
	<view>
		<template v-if="detailData">
			<uni-group class="group">
				<template #title>
					<view class="group__title">进行中</view>
				</template>
				<uni-grid :column="3" :square="false">
					<uni-grid-item>
						<view class="grid-item-box">
							<text class="text">买入金额</text>
							<text class="text">{{detailData.buyAmount}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box primary">
							<text class="text">仓位</text>
							<text class="text">{{detailData.position}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<button plain style="border-color: #F56C6C; color: #F56C6C;" @click="opClick(1)">买
								入</button>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<text class="text">卖出金额</text>
							<text class="text">{{detailData.sellAmount}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isProfit?'success':'danger'">
							<text class="text">{{detailData.isProfit?'盈利':'亏损'}}</text>
							<text class="text">{{detailData.profitAdnLoss}}</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<button plain style="border-color: #67C23A; color: #67C23A;" @click="opClick(0)">卖
								出</button>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isProfit ? 'success' : 'danger'">
							<text class="text">盈亏</text>
							<text class="text">{{detailData.percentage}}%</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isOnceProfit ? 'success' : 'danger'">
							<text class="text">累计盈亏</text>
							<text class="text">{{detailData.oncePercentage}}%({{detailData.targetPercent}}%)</text>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box" :class="detailData.isTotalProfit ? 'success' : 'danger'">
							<text class="text">总盈亏</text>
							<text class="text">{{detailData.totalPercentage}}%</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-group>
			<uni-group class="group">
				<template #title>
					<view class="group__title">
						<view style="width: 100%;display: flex;justify-content: space-between;padding-right: 15px;">
							<text>操作记录</text>
							<text class="primary" style="font-size: 14px;">查看全部</text>
						</view>
					</view>
				</template>
				<view class="steps">
					<view class="steps__text-container">
						<view class="steps__text normal" v-for="item in recordLists" :key="item._id">
							<view class="steps__text--item">
								<text class="steps__text--item-text"
									:class="item.opType === 'buy' ? 'danger' : 'success'">
									{{item.opType === 'buy' ? '买入' : '卖出'}}
								</text>
								<text
									class="steps__text--item-text">{{item.opType === 'buy' ? item.buyAmount : item.sellAmount}}</text>
								<text
									class="steps__text--item-text">{{item.opType === 'buy' ? item.buyAmount : item.sellAmount}}</text>
							</view>
							<view class="steps__text--item" style="margin-top: 6px;">
								<text style="width: 50%;" v-if="item.opType === 'buy'"
									class="primary">{{item.amount}}</text>
								<text style="width: 50%;" v-else
									:class="item.isProfit ? 'success' : 'danger'">{{item.percentage}}%</text>
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
			</uni-group>
		</template>
		<no-data v-if="nodata">
			<view class="grid-item-box">
				<button plain style="width: 80%;border-color: #409EFF; color: #409EFF;" @click="opClick(1)">新
					增</button>
			</view>
		</no-data>
		<uni-popup ref="popup" type="bottom" :mask-click="false">
			<view style="background-color: #ffffff;padding: 15px;border-radius: 2px 2px 0 0;">
				<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast"
					labelAlign="right" labelWidth="85">
					<uni-forms-item v-if="opType === 1" name="buyAmount" label="买入金额" required>
						<uni-easyinput placeholder="请输入" v-model="formData.buyAmount" type="digit"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 0" name="sellAmount" label="卖出金额" required>
						<uni-easyinput placeholder="请输入" v-model="formData.sellAmount" type="digit"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item v-if="opType === 1" name="position" label="仓位" required>
						<uni-number-box v-model="formData.position" min="1" max="10" />
					</uni-forms-item>
					<uni-forms-item v-if="opType === 1" name="targetPercent" label="加仓%" required>
						<uni-number-box v-model="formData.targetPercent" min="0" max="100" />
					</uni-forms-item>
					<view style="text-align: center;">
						<button size="mini" style="width: 40%;margin-right: 10px;" @click="cancle">取消</button>
						<button size="mini" style="width: 40%;" type="primary" @click="submit">提交</button>
					</view>
				</uni-forms>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/planDetails.js';
	const db = uniCloud.database();
	const dbCmd = db.command
	const planDetailsDB = 'planDetails';
	const recordsDB = 'detailRecords';

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				result[key] = validator[key]
			}
		}
		return result
	}
	export default {
		data() {
			const formData = {
				buyAmount: '',
				sellAmount: '',
				targetPercent: 10,
				position: 1
			}
			return {
				planId: '',
				opType: 1, // 0 卖出 1 买入
				formData,
				detailData: '',
				recordLists: [],
				rules: {
					...getValidator(Object.keys(formData))
				},
				nodata: false
			}
		},
		onLoad(op) {
			this.planId = op.id;
		},
		onShow() {
			this.getPlanDetails()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			getPlanDetails() {
				db.collection(planDetailsDB).where({
					planId: dbCmd.eq(this.planId)
				}).get().then(res => {
					if (res.result.data.length) {
						this.detailData = res.result.data[0]
						this.getRecordLists()
						this.nodata = false;
					} else {
						this.nodata = true;
					}
				})
			},
			getRecordLists() {
				db.collection(recordsDB).where({
					planId: dbCmd.eq(this.planId)
				}).limit(9).orderBy('updateDate desc').get().then(res => {
					if (res.result.data.length) {
						this.recordLists = res.result.data;
					}
				})
			},
			addRecord(params) {
				db.collection(recordsDB).add(params)
			},
			opClick(type) {
				this.opType = type;
				this.$refs.popup.open()
			},
			cancle() {
				this.$refs.popup.close()
			},
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					this.submitForm(res)
				}).catch(() => {
					uni.hideLoading()
				})
			},
			submitForm() {
				if (this.detailData && this.detailData._id) {
					this.updateDetails()
				} else {
					this.addDetails()
				}
			},
			addDetails() {
				db.collection(planDetailsDB).add(this.getParams()).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					this.resetForm();
					this.cancle();
					setTimeout(() => {
						this.getPlanDetails();
					}, 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			updateDetails() {
				db.collection(planDetailsDB).where({
					_id: this.detailData._id
				}).update(this.getParams()).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '更新成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					this.resetForm();
					this.cancle();
					setTimeout(() => {
						this.getPlanDetails();
					}, 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			getParams() {
				const time = new Date().getTime();
				const lastInfo = this.detailData;
				const params = {
					planId: this.planId,
					buyAmount: Number(this.formData.buyAmount),
					totalBuyAmount: 0,
					sellAmount: Number(this.formData.sellAmount),
					totalSellAmount: 0,
					targetPercent: Number(this.formData.targetPercent),
					position: this.formData.position,
					isProfit: true,
					isOnceProfit: true,
					isTotalProfit: true,
					opType: this.opType === 1 ? 'buy' : 'sell',
					profitAdnLoss: 0,
					onceProfitAdnLoss: 0,
					totalProfitAdnLoss: 0,
					percentage: 0,
					oncePercentage: 0,
					totalPercentage: 0,
					preAdvise: '',
					isComplete: false,
					updateDate: time,
					createDate: time
				}
				switch (this.opType) {
					case 0: // 卖出
						this.handleSell(params, lastInfo);
						break;
					case 1: // 买入
						this.handleBuy(params, lastInfo);
						break;
				}
				this.addRecord(params)
				console.log(params);
				return params;
			},
			handleBuy(params, lastInfo) {
				if (lastInfo && lastInfo._id) {
					params.totalBuyAmount = this.$evaluate(lastInfo.totalBuyAmount + params.buyAmount);
					params.totalProfitAdnLoss = lastInfo.totalProfitAdnLoss;
					params.onceProfitAdnLoss = lastInfo.onceProfitAdnLoss;
					params.totalPercentage = lastInfo.totalPercentage;
					params.oncePercentage = lastInfo.oncePercentage;
				} else {
					params.totalBuyAmount = params.buyAmount;
				}
			},
			handleSell(params, lastInfo) {
				params.totalSellAmount = this.$evaluate(lastInfo.totalSellAmount + params.sellAmount);
				params.totalProfitAdnLoss = this.$evaluate(params.totalSellAmount - lastInfo.totalBuyAmount);
				params.isTotalProfit = params.totalProfitAdnLoss < 0 ? false : true;
				params.totalPercentage = Number((this.$evaluate(params.totalProfitAdnLoss / lastInfo.totalBuyAmount * 100))
					.toFixed(2));
				params.profitAdnLoss = this.$evaluate(params.sellAmount - lastInfo.buyAmount);
				params.isProfit = params.profitAdnLoss < 0 ? false : true;
				params.percentage = Number((this.$evaluate(params.profitAdnLoss / lastInfo.buyAmount * 100)).toFixed(2));
				params.oncePercentage = this.$evaluate(lastInfo.oncePercentage + params.percentage);
				const position = Math.abs(Math.floor(this.$evaluate(params.oncePercentage / lastInfo.targetPercent)))
				params.preAdvise = `下次买入建议加仓${position}`
				console.log(this.$evaluate(params.oncePercentage / lastInfo.targetPercent));
				params.buyAmount = lastInfo.buyAmount;
			},
			resetForm() {
				this.formData.buyAmount = '';
				this.formData.sellAmount = '';
				this.formData.targetPercent = 10;
				this.formData.position = 1;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.steps {
		display: flex;
		flex-direction: row-reverse;

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
					width: 33.3%;
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
</style>
